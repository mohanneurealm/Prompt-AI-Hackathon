// backend/gemini.js
import 'dotenv/config';
import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function analyzeJiraTicket(ticketJson) {
  const ticketString = JSON.stringify(ticketJson, null, 2);
  const prompt = `
You are a JIRA expert AI assistant. Analyze the following JIRA ticket data.

---
${ticketString}
---

Return a professional analysis strictly in this JSON format:

\\\`json
{
  "summary": "",
  "type": "",
  "priority": "",
  "status": "",
  "insights": [
    "Short insight 1 based on fields like description, comments, etc.",
    "Short insight 2",
    "..."
  ],
  "recommendation": "One or two lines of recommendation based on the issue's data."
}
\\\`

No extra text. Do not make up details that are not in the JSON. Keep the insights realistic and helpful.
`;

  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    },
    { headers: { "Content-Type": "application/json" } }
  );

  const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  console.log("📋 Gemini JIRA analysis reply:", reply);
  return reply;
}