const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../db');

// --- Badge Definitions ---
const badgeDefinitions = [
    { id: 'budget_beginner', name: 'Budget Beginner', description: 'Create your first budget.' },
    { id: 'lesson_learner', name: 'Lesson Learner', description: 'Complete 5 lessons.' },
    { id: 'challenge_champion', name: 'Challenge Champion', description: 'Complete 3 challenges.' },
    { id: 'goal_setter', name: 'Goal Setter', description: 'Set up your first financial goal.' }
];

// --- Reward Definitions ---
const rewardDefinitions = [
    { id: 'discount_1', name: '10% off Financial Planning Course', points_required: 1000 },
    { id: 'ebook_1', name: 'Free eBook on Investing Basics', points_required: 500 },
];

// Get Leaderboard
router.get('/leaderboard', auth, async (req, res) => {
    try {
        let { data, error } = await supabase
            .from('user_progress')
            .select('user_id, points_earned');

        if (error) throw error;

        // Sum points for each user
        const userPoints = data.reduce((acc, progress) => {
            acc[progress.user_id] = (acc[progress.user_id] || 0) + progress.points_earned;
            return acc;
        }, {});

        // Fetch user details
        let { data: users, error: usersError } = await supabase
            .from('users')
            .select('id, username')
            .in('id', Object.keys(userPoints));
        
        if (usersError) throw usersError;

        const leaderboard = users.map(user => ({
            username: user.username,
            total_points: userPoints[user.id]
        })).sort((a, b) => b.total_points - a.total_points);

        res.json({ leaderboard });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get Badges
router.get('/badges', auth, async (req, res) => {
    try {
        const earnedBadges = [];

        // Check for 'Budget Beginner' badge
        let { data: budget, error: budgetError } = await supabase.from('budgets').select('id').eq('user_id', req.user.id).limit(1);
        if (budget && budget.length > 0) earnedBadges.push(badgeDefinitions.find(b => b.id === 'budget_beginner'));

        // Check for 'Lesson Learner' badge
        let { data: lessons, error: lessonsError } = await supabase.from('user_progress').select('id').eq('user_id', req.user.id).not('lesson_id', 'is', null);
        if (lessons && lessons.length >= 5) earnedBadges.push(badgeDefinitions.find(b => b.id === 'lesson_learner'));

        // Check for 'Challenge Champion' badge
        let { data: challenges, error: challengesError } = await supabase.from('user_progress').select('id').eq('user_id', req.user.id).not('challenge_id', 'is', null);
        if (challenges && challenges.length >= 3) earnedBadges.push(badgeDefinitions.find(b => b.id === 'challenge_champion'));

        // Check for 'Goal Setter' badge
        let { data: goal, error: goalError } = await supabase.from('goals').select('id').eq('user_id', req.user.id).limit(1);
        if (goal && goal.length > 0) earnedBadges.push(badgeDefinitions.find(b => b.id === 'goal_setter'));

        res.json({ badges: earnedBadges });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get Rewards
router.get('/rewards', auth, async (req, res) => {
    try {
        // In a real app, you might also check which rewards a user has already redeemed.
        res.json({ rewards: rewardDefinitions });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
