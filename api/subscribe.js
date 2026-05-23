export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        email: email,
        listIds: [5],
        updateEnabled: true
      })
    });

    if (response.ok || response.status === 201 || response.status === 204) {
      return res.status(200).json({ success: true });
    }

    const err = await response.json();
    if (err.code === 'duplicate_parameter') {
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: 'Failed to subscribe' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}
