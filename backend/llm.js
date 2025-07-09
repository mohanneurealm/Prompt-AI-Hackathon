// backend/llm.js
import 'dotenv/config';
import Groq from 'groq-sdk';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  baseUrl: 'https://api.groq.com/openai/v1'
});

async function callGroq(prompt, role = 'system', systemMessage = 'You are an intelligent assistant.') {
  const res = await client.chat.completions.create({
    model: 'llama3-8b-8192',
    temperature: 0.2,
    max_tokens: 1000,
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: prompt }
    ]
  });

  return res.choices[0]?.message?.content || '';
}

export async function summarizeRepo(githubUrl) {
  const prompt = `
Given the public GitHub repository URL: ${githubUrl}

Extract and return the following strictly in JSON format:

\\\`json
{
  "author": {"name": "", "url": ""},
  "date": "",
  "type": "",
  "summary": "",
  "languages": "",
  "files": [
    {"filename": "", "url": "", "description": ""}
  ],
  "flow": ""
}
\\\`

Only return the JSON. Do not hallucinate any values. Use only the information from the repo.
`;

  return callGroq(prompt, 'system', 'You are a GitHub repository summarizer.');
}

export async function analyzeCode(codeText) {
  const prompt = `
Here is a code block:
---
${codeText}
---

Analyze and return this JSON:

\\\`json
{
  "language": "",
  "type": "",
  "segments": [
    {"part": "Function definition", "description": ""},
    {"part": "Loop structure", "description": ""}
  ],
  "flow": "",
  "time_complexity": "",
  "space_complexity": ""
}
\\\`

Do not return anything outside the JSON block. Use only the code provided to make your observations.
`;

  return callGroq(prompt, 'system', 'You are a code analysis expert.');
}

export async function analyzeJiraTicket(ticketJson) {
  const ticketString = JSON.stringify(ticketJson, null, 2);
  const prompt = `
Analyze the following JIRA ticket data:

${ticketString}

Return your output strictly in the following JSON format:

\\\`json
{
  "summary": "",
  "type": "",
  "priority": "",
  "status": "",
  "insights": [
    "Insight 1 based on content",
    "Insight 2"
  ],
  "recommendation": "One or two sentence recommendation."
}
\\\`

Don't make assumptions. Use only available information.
`;

  return callGroq(prompt, 'system', 'You are a JIRA ticket analyst.');
}