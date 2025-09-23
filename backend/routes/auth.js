const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../db');

// Register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user exists
        let { data: user, error } = await supabase
            .from('users')
            .select('email')
            .eq('email', email)
            .single();

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([{ name, email, hashed_password: hashedPassword }])
            .single();
        
        if(insertError){
            throw insertError;
        }

        // Generate tokens
        const payload = { user: { id: newUser.id } };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '7d' });

        res.json({ accessToken, refreshToken });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        let { data: user, error } = await supabase
            .from('users')
            .select('id, hashed_password')
            .eq('email', email)
            .single();

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.hashed_password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate tokens
        const payload = { user: { id: user.id } };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '7d' });

        res.json({ accessToken, refreshToken });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Refresh Token
router.post('/refresh-token', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.REFRESH_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const payload = { user: { id: user.id } };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.json({ accessToken });
    });
});

// Google OAuth - Placeholder
router.post('/google-oauth', (req, res) => {
    res.status(511).send('Google OAuth not implemented');
});

// Logout - Placeholder
router.delete('/logout', (req, res) => {
    // On the client-side, the tokens should be deleted.
    // For a more secure implementation, a token blocklist on the server would be needed.
    res.send({ msg: 'Logout successful' });
});

module.exports = router;