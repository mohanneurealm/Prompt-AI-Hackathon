// backend/gemini.js
import 'dotenv/config';
import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function summarizeRepo(githubUrl) {
  const prompt = `
Given the public GitHub repository URL: ${githubUrl}

Extract and provide the following details strictly in the JSON format mentioned below:

1. Author username (GitHub user) and their profile URL.
2. Date of repository creation (if available).
3. Type of repository (e.g., website, machine learning project, API, CLI tool, etc.).
4. A short summary explaining what this repository is about.
5. Languages used (comma-separated).
6. Important files: list of main files, each with its:
   - Filename
   - File URL
   - Brief 2–3 lines explanation.
7. Flow of the code: Explain how the code executes, from start to end, step-by-step, in 5–7 sentences.

Format your answer exactly like this inside a JSON:

\`\`\`json
{
  "author": {"name": "", "url": ""},
  "date": "",
  "type": "",
  "summary": "",
  "languages": "",
  "files": [
    {"filename": "", "url": "", "description": ""},
    {"filename": "", "url": "", "description": ""}
  ],
  "flow": ""
}
\`\`\`

Strictly no extra words outside JSON block. And remember do not hallucinate any information. The information you get and the fies and url must be in that repository.
`;

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    },
    { headers: { "Content-Type": "application/json" } }
  );

  const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  console.log("🔍 Gemini raw reply:", reply);
  return reply; // ✅ raw text returned (no parsing here)
}


export async function analyzeCode(codeText) {
  const prompt = `
You are a professional code analyst.

Here is a block of code:
---
${codeText}
---

Break it down and return the following strictly in this JSON format:

\`\`\`json
{
  "language": "",
  "type": "",
  "segments": [
    {"part": "Function definition", "description": "This defines the main sorting function that..."},
    {"part": "Loop structure", "description": "This loop iterates through..."},
    {"part": "...", "description": "..."}
  ],
  "flow": "Describe the step-by-step flow of this program",
  "time_complexity": "",
  "space_complexity": ""
}
\`\`\`

Strictly return only the JSON block. Do not hallucinate. Base all answers on the provided code.
`;

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    },
    { headers: { "Content-Type": "application/json" } }
  );

  const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  console.log("📊 Gemini code analysis reply:", reply);
  return reply; 
}