import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from src/frontend directory
app.use(express.static(path.join(__dirname, 'src', 'frontend')));

// Connect to Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Serve landing page at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'frontend', 'html', 'landing.html'));
});

// Serve dashboard page
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'frontend', 'html', 'dashboard.html'));
});

// API routes
app.get("/api", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// AI Chat endpoint for Gemini integration
app.post("/api/chat", async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Import Google Generative AI (you'll need to install this package)
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // Enhanced system prompt for financial advisor
    const systemPrompt = `You are a professional Personal Financial Advisor and Cybersecurity Expert for FinSecure app. 

Your role:
- Provide accurate, personalized financial advice
- Help with budgeting, investing, saving, and financial planning
- Identify and warn about cybersecurity threats
- Scan URLs and messages for potential fraud
- Educate users about financial literacy and security best practices
- Be encouraging, professional, and easy to understand

Guidelines:
- Always prioritize user financial security and safety
- Provide actionable, specific advice
- Explain financial concepts in simple terms
- Include relevant cybersecurity warnings when appropriate
- If scanning URLs or messages, provide detailed threat analysis
- Keep responses concise but informative (2-3 sentences usually)
- Use a friendly but professional tone

Current context: ${context || 'General financial and security consultation'}

User question: ${message}`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const aiMessage = response.text();

    res.json({ 
      message: aiMessage,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Fallback responses for common scenarios
    const fallbackResponses = {
      investment: "I'd recommend starting with a diversified portfolio. Consider low-cost index funds for beginners - they offer broad market exposure with lower risk. What's your investment timeline and risk tolerance?",
      budget: "Let's create a budget using the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings. What's your monthly after-tax income?",
      security: "For better security, enable two-factor authentication on all financial accounts, use unique strong passwords, and be cautious of phishing emails. What specific security concern do you have?",
      scan: "I can help analyze links and messages for threats. Please share the URL or message content you'd like me to review for potential scams or phishing attempts.",
      default: "I'm here to help with your financial and security questions. Could you provide more details about what specific advice you're looking for?"
    };

    const message = req.body.message.toLowerCase();
    let fallbackMessage = fallbackResponses.default;
    
    if (message.includes('invest') || message.includes('stock') || message.includes('portfolio')) {
      fallbackMessage = fallbackResponses.investment;
    } else if (message.includes('budget') || message.includes('expense') || message.includes('save')) {
      fallbackMessage = fallbackResponses.budget;
    } else if (message.includes('security') || message.includes('password') || message.includes('hack')) {
      fallbackMessage = fallbackResponses.security;
    } else if (message.includes('scan') || message.includes('link') || message.includes('url')) {
      fallbackMessage = fallbackResponses.scan;
    }

    res.json({ 
      message: fallbackMessage,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
});

// Example: Get all users from Supabase
app.get("/api/users", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// 404 handler for API routes - must come after all API routes
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Serve landing page for all other routes (SPA fallback) - must be last
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'frontend', 'html', 'landing.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));