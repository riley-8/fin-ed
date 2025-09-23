const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// @route   GET api/profile
// @desc    Get user budget and goals
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get Budget
        const budgetRes = await db.query('SELECT * FROM budgets WHERE user_id = $1', [userId]);
        const budget = budgetRes.rows[0] || {};

        // Get Goals
        const goalsRes = await db.query('SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at', [userId]);
        const goals = goalsRes.rows;
        
        res.json({ budget, goals });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/profile/budget
// @desc    Create or update user budget
// @access  Private
router.post('/budget', auth, async (req, res) => {
    const { income, expenses_json } = req.body;
    try {
        const userId = req.user.id;
        
        const budgetRes = await db.query('SELECT id FROM budgets WHERE user_id = $1', [userId]);
        
        let newBudget;
        if (budgetRes.rows.length > 0) {
            // Update
            const budgetId = budgetRes.rows[0].id;
            newBudget = await db.query(
                'UPDATE budgets SET income = $1, expenses_json = $2, timestamp = NOW() WHERE id = $3 RETURNING *',
                [income, expenses_json, budgetId]
            );
        } else {
            // Insert
            newBudget = await db.query(
                'INSERT INTO budgets (user_id, income, expenses_json) VALUES ($1, $2, $3) RETURNING *',
                [userId, income, expenses_json]
            );
        }
        
        res.json(newBudget.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/profile/goals
// @desc    Add a new goal
// @access  Private
router.post('/goals', auth, async (req, res) => {
    const { goal_type, target_amount, target_date } = req.body;
    try {
        const newGoal = await db.query(
            'INSERT INTO goals (user_id, goal_type, target_amount, target_date) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, goal_type, target_amount, target_date]
        );
        res.json(newGoal.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   DELETE api/profile/goals/:id
// @desc    Delete a goal
// @access  Private
router.delete('/goals/:id', auth, async (req, res) => {
    try {
        const result = await db.query('DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING *', [req.params.id, req.user.id]);
        if (result.rowCount === 0) {
             return res.status(404).json({ msg: 'Goal not found or user not authorized' });
        }
        res.json({ msg: 'Goal deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
