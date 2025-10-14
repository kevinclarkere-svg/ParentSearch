const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';
const TOKEN_TTL = process.env.TOKEN_TTL || '5m';
const BD_API_KEY = process.env.BD_API_KEY;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const incomingKey = req.headers['x-bd-api-key'] || req.body?.apiKey;
  if (!incomingKey || incomingKey !== BD_API_KEY) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { memberId } = req.body || {};
  if (!memberId) return res.status(400).json({ error: 'memberId required' });

  const token = jwt.sign({ memberId }, JWT_SECRET, { expiresIn: TOKEN_TTL });
  res.json({ ok: true, token, expiresIn: TOKEN_TTL });
};
