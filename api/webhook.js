export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const response = await fetch(
      'https://hook.eu1.make.com/245bh06ybcfe13c97pb7wyibmmo0b0u9',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      }
    );

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Webhook fout' });
  }
}
