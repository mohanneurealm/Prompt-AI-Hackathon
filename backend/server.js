// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {analyzeJiraTicket} from './gemini.js'; 

dotenv.config();

const app = express();
const port = 3003;

// For ES modules to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve static files from frontend/
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve the frontend/index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

function cleanJSON(text) {
  return text.replace(/json|/g, '').trim();
}

// ========================= GEMINI-BASED APIs =========================

app.post("/summarize", async (req, res) => {
  const { githubUrl } = req.body;
  if (!githubUrl) {
    return res.status(400).json({ error: "GitHub URL is required." });
  }

  try {
    const result = await summarizeRepo(githubUrl);
    const cleanedResult = cleanJSON(result);
    const parsedResult = JSON.parse(cleanedResult);
    console.log(parsedResult);
    res.json(parsedResult);
  } catch (error) {
    console.error("Error parsing Gemini result:", error.message);
    res.status(500).json({ error: "Something went wrong parsing the response." });
  }
});

app.post("/analyze-code", async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: "Code is required." });
  }

  try {
    const result = await analyzeCode(code);
    const cleaned = cleanJSON(result);
    const parsed = JSON.parse(cleaned);
    res.json(parsed);
  } catch (err) {
    console.error("Code analysis error:", err.message);
    res.status(500).json({ error: "Failed to analyze code." });
  }
});

app.post("/analyze-jira", async (req, res) => {
  const { ticket } = req.body;
  if (!ticket) {
    return res.status(400).json({ error: "JIRA ticket JSON is required." });
  }

  try {
    const result = await analyzeJiraTicket(ticket);
    const cleaned = cleanJSON(result);
    const parsed = JSON.parse(cleaned);
    res.json(parsed);
  } catch (err) {
    console.error("JIRA analysis error:", err.message);
    res.status(500).json({ error: "Failed to analyze JIRA ticket." });
  }
});

// ========================= Server Listen =========================
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});