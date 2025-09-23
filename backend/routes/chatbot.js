const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const supabase = require('../db');
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// Mock Gemini AI Client
const getGeminiMockResponse = (message, context) => {
    // Simple logic to generate a response based on keywords
    if (message.toLowerCase().includes('budget')) {
        const { income, expenses_json } = context.budget;
        const totalExpenses = Object.values(expenses_json).reduce((sum, val) => sum + val, 0);
        const savings = income - totalExpenses;
        return `Based on your budget, your total income is $${income} and your total expenses are $${totalExpenses}. You are saving $${savings} per month. How can I help you optimize this?`;
    }
    if (message.toLowerCase().includes('goal')) {
         if (context.goals && context.goals.length > 0) {
            const goal = context.goals[0];
            return `I see you have a goal to ${goal.goal_type}. You have saved $${goal.current_amount} out of $${goal.target_amount}. You are doing great!`;
         }
         return "You don't have any active goals. Would you like to set one up?";
    }
    return `You said: "${message}". I'm a mock AI. In a real application, I would provide a more detailed financial analysis.`;
};


router.post('/chat', auth, async (req, res) => {
    const { message } = req.body;

    try {
        // In a real implementation, you would get context for the AI
        let { data: budget, error: budgetError } = await supabase
            .from('budgets')
            .select('income, expenses_json')
            .eq('user_id', req.user.id)
            .order('timestamp', { ascending: false })
            .limit(1)
            .single();

        let { data: goals, error: goalsError } = await supabase
            .from('goals')
            .select('goal_type, target_amount, current_amount')
            .eq('user_id', req.user.id)
            .eq('status', 'active');
        
        if (budgetError && budgetError.code !== 'PGRST116') throw budgetError;
        if (goalsError) throw goalsError;

        const context = {
            budget: budget || { income: 0, expenses_json: {} },
            goals: goals || [],
        };

        // --- Real Gemini Integration would look something like this ---
        // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // const model = genAI.getGenerativeModel({ model: "gemini-pro"});
        // const chat = model.startChat({
        //   history: [], // You could load chat history here
        //   generationConfig: {
        //     maxOutputTokens: 100,
        //   },
        // });
        // const prompt = `User message: "${message}". User context: ${JSON.stringify(context)}`;
        // const result = await chat.sendMessage(prompt);
        // const response = await result.response;
        // const text = response.text();
        // res.json({ reply: text });
        // --- End of Real Gemini Integration ---


        // Using mock response for now
        const reply = getGeminiMockResponse(message, context);
        res.json({ reply });


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;