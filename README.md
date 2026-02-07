# Celestine Advisory Partners — Enterprise Platform (Starter)

Includes:
- Public site shell (style aligned to your reference)
- Secure portal: password-gated, requires name+email, 200MB direct-to-S3 uploads
- PostgreSQL + Prisma schema for links/uploads/audit logging

## Setup
1) `npm install`
2) Copy `.env.example` → `.env` and fill values
3) `npm run prisma:migrate`
4) `npm run seed`
5) `npm run dev`

## Deploy (Option A)
- Two Vercel projects:
  - Public: celestine.com
  - Portal: portal.celestine.com
- Same env vars in both (DB + S3)
- S3 bucket: private + encryption on + allow CORS from portal domain


## Admin Link Generator
- Set `ADMIN_API_KEY` in your environment.
- Open `/admin/links` and paste the key to manage secure upload links.
- Admin APIs require header `x-admin-key: <ADMIN_API_KEY>`.
