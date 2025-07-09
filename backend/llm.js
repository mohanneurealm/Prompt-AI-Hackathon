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