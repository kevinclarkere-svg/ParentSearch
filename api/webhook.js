const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BD_API_KEY = process.env.BD_API_KEY; // required header from BD

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // simple header-based auth
  const incomingKey = req.headers['x-bd-api-key'] || req.body?.apiKey;
  if (!incomingKey || incomingKey !== BD_API_KEY) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const { memberId, email, name } = req.body || {};
  if (!memberId) return res.status(400).json({ error: 'memberId required' });

  const hostname = \`\${memberId}.parentsearch.org\`;

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
    console.error('Supabase insert error', error);
    return res.status(500).json({ ok: false, error: error.message });
  }

  return res.json({ ok: true, memberId, hostname, row: data?.[0] || null });
};
