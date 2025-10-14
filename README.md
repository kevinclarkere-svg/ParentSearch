bd-memogram-provision
Serverless endpoints for Brilliant Directories -> Memogram provisioning

APIs:
- POST /api/webhook  -> called by BD on new member signup (requires x-bd-api-key)
- POST /api/issue-token -> BD server->server get a short JWT for upload iframe
- GET  /api/validate -> debug/validate a token

Environment variables required:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- BD_API_KEY
- JWT_SECRET
- TOKEN_TTL (optional, default 5m)
