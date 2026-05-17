// api/chat.js — Vercel Serverless Function
// Gebruikt Groq (gratis) als AI provider
// Zet je Groq API key in Vercel: Settings → Environment Variables → GROQ_API_KEY
// Gratis key aanmaken op: console.groq.com

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { messages, system } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array verplicht' });
  }

  // Voeg system prompt toe als eerste bericht als Groq dat nodig heeft
  const groqMessages = [
    { role: 'system', content: system || '' },
    ...messages
  ];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // Groq's beste gratis model
        max_tokens: 1000,
        messages: groqMessages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq fout:', data);
      return res.status(response.status).json({ error: 'API fout', detail: data });
    }

    // Vertaal Groq response naar Anthropic formaat zodat de frontend hetzelfde blijft
    return res.status(200).json({
      content: [{ text: data.choices[0].message.content }]
    });

  } catch (err) {
    console.error('Server fout:', err);
    return res.status(500).json({ error: 'Interne serverfout' });
  }
}
