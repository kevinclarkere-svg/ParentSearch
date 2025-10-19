/**
 * util/createMemberFolder.js
 * CommonJS for Vercel serverless
 */
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.MEDIA_BUCKET || 'member-media';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

/**
 * Ensure member folder exists by uploading a tiny marker file.
 * Returns data object on success, throws on error.
 */
async function ensureMemberFolder(memberId) {
  if (!memberId) throw new Error('memberId required');
  const safeId = String(memberId).replace(/[^0-9a-zA-Z-_]/g, '');
  const key = `${safeId}/.init`;
  const content = Buffer.from('initialized');

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(key, content, { upsert: true, contentType: 'text/plain' });

  if (error) {
    throw error;
  }
  return data;
}

module.exports = { ensureMemberFolder };
