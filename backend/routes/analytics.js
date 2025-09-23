const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../db');

// Get KPIs
router.get('/kpis', auth, async (req, res) => {
    try {
        // --- User Engagement ---
        let { data: weeklyActiveUsers, error: wauError } = await supabase
            .rpc('get_weekly_active_users'); // Assumes a PostgreSQL function

        // --- Lesson Metrics ---
        let { data: lessonCompletions, error: lessonError } = await supabase
            .from('user_progress')
            .select('lesson_id, status')
            .not('lesson_id', 'is', null);
        const totalLessons = (await supabase.from('lessons').select('id')).data.length;
        const completionRate = (lessonCompletions.filter(l => l.status === 'completed').length / totalLessons) * 100;

        // --- Goal Metrics ---
        let { data: goals, error: goalsError } = await supabase
            .from('goals')
            .select('status, target_amount, current_amount');
        const goalsAchieved = goals.filter(g => g.status === 'completed').length;
        const totalGoals = goals.length;
        const avgProgress = goals.reduce((sum, g) => sum + (g.current_amount / g.target_amount), 0) / totalGoals * 100;

        if (wauError || lessonError || goalsError) {
            // Handle errors appropriately
        }

        res.json({
            kpis: {
                user_engagement: {
                    weekly_active_users: weeklyActiveUsers
                },
                learning_progress: {
                    lesson_completion_rate: `${completionRate.toFixed(2)}%`,
                },
                financial_health: {
                    goals_achieved: goalsAchieved,
                    average_goal_progress: `${avgProgress.toFixed(2)}%`
                }
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;