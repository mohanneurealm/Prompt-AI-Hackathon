// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeJiraTicket } from './llm.js';

dotenv.config();

const app = express();
const port = 3003;

// For ES modules to get __dirname
const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);

app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// === Improved JSON Extractor ===
function cleanJSON(text) {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/i);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }

  // Fallback: Try to find a pure JSON object
  const braceMatch = text.match(/{[\s\S]*}/);
  if (braceMatch) {
    return braceMatch[0];
  }

  throw new Error("Response does not contain valid JSON.");
}


// === Routes ===

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

// === Start Server ===
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});