const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../db');

// Get all challenges
router.get('/', auth, async (req, res) => {
    try {
        let { data: challenges, error } = await supabase
            .from('challenges')
            .select('*');

        if (error) {
            throw error;
        }

        res.json(challenges);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get a single challenge
router.get('/:id', auth, async (req, res) => {
    try {
        let { data: challenge, error } = await supabase
            .from('challenges')
            .select('*')
            .eq('id', req.params.id)
            .single();
        
        if(error) {
            throw error;
        }

        if(!challenge) {
            return res.status(404).json({ msg: 'Challenge not found' });
        }

        res.json(challenge);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Submit challenge progress
router.post('/:id/progress', auth, async (req, res) => {
    const { status, points_earned } = req.body;

    try {
        await supabase
            .from('user_progress')
            .insert([
                { user_id: req.user.id, challenge_id: req.params.id, status, points_earned, completed_at: new Date() }
            ]);

        res.json({ msg: 'Progress updated successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;