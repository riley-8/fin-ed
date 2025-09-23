const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../db');

// Get Onboarding status
router.get('/status', auth, async (req, res) => {
    try {
        let { data: user, error } = await supabase
            .from('users')
            .select('profile_json')
            .eq('id', req.user.id)
            .single();

        if (error) {
            throw error;
        }

        if (user && user.profile_json && user.profile_json.onboarding_completed) {
            res.json({ onboarding_completed: true });
        } else {
            res.json({ onboarding_completed: false });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Submit Onboarding data
router.post('/', auth, async (req, res) => {
    const { income, expenses } = req.body;

    try {
        // Save budget
        await supabase
            .from('budgets')
            .insert([
                { user_id: req.user.id, income, expenses_json: expenses }
            ]);

        // Update user profile
        await supabase
            .from('users')
            .update({ profile_json: { onboarding_completed: true } })
            .eq('id', req.user.id);

        res.json({ msg: 'Onboarding completed successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
