const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../db');

// Get all lessons
router.get('/', auth, async (req, res) => {
    try {
        let { data: lessons, error } = await supabase
            .from('lessons')
            .select('id, title, topic, difficulty, estimated_duration');

        if (error) {
            throw error;
        }

        res.json(lessons);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get a single lesson
router.get('/:id', auth, async (req, res) => {
    try {
        let { data: lesson, error } = await supabase
            .from('lessons')
            .select('*, content_json->>interactive_elements AS interactive_elements')
            .eq('id', req.params.id)
            .single();
        
        if(error) {
            throw error;
        }

        if(!lesson) {
            return res.status(404).json({ msg: 'Lesson not found' });
        }

        res.json(lesson);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Submit lesson progress
router.post('/:id/progress', auth, async (req, res) => {
    const { status, points_earned } = req.body;

    try {
        await supabase
            .from('user_progress')
            .insert([
                { user_id: req.user.id, lesson_id: req.params.id, status, points_earned, completed_at: new Date() }
            ]);

        res.json({ msg: 'Progress updated successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;