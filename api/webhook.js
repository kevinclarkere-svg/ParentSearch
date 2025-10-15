const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BD_API_KEY = process.env.BD_API_KEY; // required header from BD

const supabase = createClient(SUPABASE_URL || '', SUPABASE_KEY || '');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Simple header-based auth
    const incomingKey = req.headers['x-bd-api-key'] || req.body?.apiKey;
    if (!incomingKey || incomingKey !== BD_API_KEY) {
      return res.status(403).json({ error: 'forbidden' });
    }

    const { memberId, email, name } = req.body || {};
    if (!memberId) return res.status(400).json({ error: 'memberId required' });

    // Defensive checks for env variables
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      const msg = 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables';
      console.error(msg, { SUPABASE_URL: !!SUPABASE_URL, SUPABASE_KEY: !!SUPABASE_KEY });
      return res.status(500).json({ ok: false, error: msg });
    }

    const hostname = `${memberId}.parentsearch.org`;

    // Upsert into Supabase
    const { data, error } = await supabase
      .from('members')
      .upsert({
        member_id: String(memberId),
        email: email || null,
        name: name || null,
        hostname,
        provisioned: true
      }, { onConflict: 'member_id' });

    if (error) {
      console.error('Supabase error', error);
      return res.status(500).json({ ok: false, error: error.message || error });
    }

    return res.json({ ok: true, memberId, hostname, row: data?.[0] || null });
  } catch (err) {
    // Log full error and return message for debugging (remove this in production)
    console.error('Webhook caught exception', err && err.stack ? err.stack : err);
    return res.status(500).json({ ok: false, error: String(err && err.message ? err.message : err) });
  }
};
