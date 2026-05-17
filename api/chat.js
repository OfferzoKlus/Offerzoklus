// api/chat.js — Vercel Serverless Function
// Zet je API key in Vercel dashboard: Settings → Environment Variables → ANTHROPIC_API_KEY

export default async function handler(req, res) {
  // Alleen POST toestaan
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers zodat je HTML pagina deze functie mag aanroepen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { messages, system } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array verplicht' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: system || '',
        messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic fout:', data);
      return res.status(response.status).json({ error: 'API fout', detail: data });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error('Server fout:', err);
    return res.status(500).json({ error: 'Interne serverfout' });
  }
}
