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