const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth');
const onboardingRouter = require('./routes/onboarding');
const dashboardRouter = require('./routes/dashboard');
const lessonsRouter = require('./routes/lessons');
const challengesRouter = require('./routes/challenges');
const chatbotRouter = require('./routes/chatbot');
const gamificationRouter = require('./routes/gamification');
const analyticsRouter = require('./routes/analytics');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/onboarding', onboardingRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/lessons', lessonsRouter);
app.use('/api/challenges', challengesRouter);
app.use('/api/chatbot', chatbotRouter);
app.use('/api/gamification', gamificationRouter);
app.use('/api/analytics', analyticsRouter);

app.get('/', (req, res) => {
  res.send('FinEd AI Backend is running!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
