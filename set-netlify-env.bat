@echo off
netlify env:set DATABASE_URL "postgresql://neondb_owner:npg_vx8MlZPgQ3AY@ep-broad-term-a13plrc-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
netlify env:set AWS_ACCESS_KEY_ID "test-key"
netlify env:set AWS_SECRET_ACCESS_KEY "test-secret"
netlify env:set AWS_REGION "us-east-1"
netlify env:set S3_BUCKET "celestine-portal-uploads"
netlify env:set ADMIN_API_KEY "admin-key-123"
netlify env:set ADMIN_EMAIL "admin@millernexus.net"
netlify env:set ADMIN_NAME "Super Admin"
netlify env:set ADMIN_PASSWORD "ChangeMe_Immediately!"
netlify env:set ADMIN_ROLE "super_admin"
netlify env:set NEXT_PUBLIC_PORTAL_URL "https://millernexus.netlify.app"
netlify env:set PORTAL_RATE_LIMIT_PER_MIN "10"
echo All environment variables set!
