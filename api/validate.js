const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret';

module.exports = async (req, res) => {
  const token = req.query.token || req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(400).json({ ok: false, error: 'token required' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return res.json({ ok: true, payload });
  } catch (err) {
    return res.status(401).json({ ok: false, error: err.message });
  }
};
