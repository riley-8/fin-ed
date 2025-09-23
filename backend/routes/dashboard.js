const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../db');

// Get Dashboard data
router.get('/', auth, async (req, res) => {
    try {
        // Get budget
        let { data: budget, error: budgetError } = await supabase
            .from('budgets')
            .select('income, expenses_json')
            .eq('user_id', req.user.id)
            .order('timestamp', { ascending: false })
            .limit(1)
            .single();
        
        if (budgetError && budgetError.code !== 'PGRST116') { // Ignore 'single row not found' error
            throw budgetError;
        }

        // Get goals
        let { data: goals, error: goalsError } = await supabase
            .from('goals')
            .select('goal_type, target_amount, current_amount')
            .eq('user_id', req.user.id)
            .eq('status', 'active');

        if (goalsError) {
            throw goalsError;
        }

        // Get recent lessons
        let { data: lessons, error: lessonsError } = await supabase
            .from('user_progress')
            .select('lessons(title, topic)')
            .eq('user_id', req.user.id)
            .order('completed_at', { ascending: false })
            .limit(5);

        if (lessonsError) {
            throw lessonsError;
        }
        
        res.json({ 
            budget: budget || { income: 0, expenses_json: {}}, 
            goals: goals || [], 
            recent_lessons: lessons ? lessons.map(l => l.lessons) : []
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
