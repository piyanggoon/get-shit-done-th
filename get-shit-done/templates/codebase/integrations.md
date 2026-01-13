# เทมเพลต External Integrations

เทมเพลตสำหรับ `.planning/codebase/INTEGRATIONS.md` - บันทึก external service dependencies

**วัตถุประสงค์:** บันทึกว่า codebase นี้ติดต่อกับ external systems อะไรบ้าง เน้นที่ "อะไรอยู่นอกโค้ดของเราที่เราขึ้นอยู่กับ"

---

## เทมเพลตไฟล์

```markdown
# External Integrations

**วันที่วิเคราะห์:** [YYYY-MM-DD]

## APIs & External Services

**Payment Processing:**
- [Service] - [ใช้สำหรับ: เช่น "subscription billing, one-time payments"]
  - SDK/Client: [เช่น "stripe npm package v14.x"]
  - Auth: [เช่น "API key ใน STRIPE_SECRET_KEY env var"]
  - Endpoints ที่ใช้: [เช่น "checkout sessions, webhooks"]

**Email/SMS:**
- [Service] - [ใช้สำหรับ: เช่น "transactional emails"]
  - SDK/Client: [เช่น "sendgrid/mail v8.x"]
  - Auth: [เช่น "API key ใน SENDGRID_API_KEY env var"]
  - Templates: [เช่น "managed ใน SendGrid dashboard"]

**External APIs:**
- [Service] - [ใช้สำหรับ]
  - Integration method: [เช่น "REST API via fetch", "GraphQL client"]
  - Auth: [เช่น "OAuth2 token ใน AUTH_TOKEN env var"]
  - Rate limits: [ถ้ามี]

## Data Storage

**Databases:**
- [Type/Provider] - [เช่น "PostgreSQL on Supabase"]
  - Connection: [เช่น "via DATABASE_URL env var"]
  - Client: [เช่น "Prisma ORM v5.x"]
  - Migrations: [เช่น "prisma migrate ใน migrations/"]

**File Storage:**
- [Service] - [เช่น "AWS S3 สำหรับ user uploads"]
  - SDK/Client: [เช่น "@aws-sdk/client-s3"]
  - Auth: [เช่น "IAM credentials ใน AWS_* env vars"]
  - Buckets: [เช่น "prod-uploads, dev-uploads"]

**Caching:**
- [Service] - [เช่น "Redis สำหรับ session storage"]
  - Connection: [เช่น "REDIS_URL env var"]
  - Client: [เช่น "ioredis v5.x"]

## Authentication & Identity

**Auth Provider:**
- [Service] - [เช่น "Supabase Auth", "Auth0", "custom JWT"]
  - Implementation: [เช่น "Supabase client SDK"]
  - Token storage: [เช่น "httpOnly cookies", "localStorage"]
  - Session management: [เช่น "JWT refresh tokens"]

**OAuth Integrations:**
- [Provider] - [เช่น "Google OAuth สำหรับ sign-in"]
  - Credentials: [เช่น "GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET"]
  - Scopes: [เช่น "email, profile"]

## Monitoring & Observability

**Error Tracking:**
- [Service] - [เช่น "Sentry"]
  - DSN: [เช่น "SENTRY_DSN env var"]
  - Release tracking: [เช่น "via SENTRY_RELEASE"]

**Analytics:**
- [Service] - [เช่น "Mixpanel สำหรับ product analytics"]
  - Token: [เช่น "MIXPANEL_TOKEN env var"]
  - Events tracked: [เช่น "user actions, page views"]

**Logs:**
- [Service] - [เช่น "CloudWatch", "Datadog", "none (stdout only)"]
  - Integration: [เช่น "AWS Lambda built-in"]

## CI/CD & Deployment

**Hosting:**
- [Platform] - [เช่น "Vercel", "AWS Lambda", "Docker on ECS"]
  - Deployment: [เช่น "automatic on main branch push"]
  - Environment vars: [เช่น "configured ใน Vercel dashboard"]

**CI Pipeline:**
- [Service] - [เช่น "GitHub Actions"]
  - Workflows: [เช่น "test.yml, deploy.yml"]
  - Secrets: [เช่น "stored ใน GitHub repo secrets"]

## Environment Configuration

**Development:**
- Required env vars: [List critical vars]
- Secrets location: [เช่น ".env.local (gitignored)", "1Password vault"]
- Mock/stub services: [เช่น "Stripe test mode", "local PostgreSQL"]

**Staging:**
- Environment-specific differences: [เช่น "uses staging Stripe account"]
- Data: [เช่น "separate staging database"]

**Production:**
- Secrets management: [เช่น "Vercel environment variables"]
- Failover/redundancy: [เช่น "multi-region DB replication"]

## Webhooks & Callbacks

**Incoming:**
- [Service] - [Endpoint: เช่น "/api/webhooks/stripe"]
  - Verification: [เช่น "signature validation via stripe.webhooks.constructEvent"]
  - Events: [เช่น "payment_intent.succeeded, customer.subscription.updated"]

**Outgoing:**
- [Service] - [อะไร trigger มัน]
  - Endpoint: [เช่น "external CRM webhook on user signup"]
  - Retry logic: [ถ้ามี]

---

*Integration audit: [วันที่]*
*อัปเดตเมื่อเพิ่ม/ลบ external services*
```

<good_examples>
```markdown
# External Integrations

**วันที่วิเคราะห์:** 2025-01-20

## APIs & External Services

**Payment Processing:**
- Stripe - Subscription billing และ one-time course payments
  - SDK/Client: stripe npm package v14.8
  - Auth: API key ใน STRIPE_SECRET_KEY env var
  - Endpoints ที่ใช้: checkout sessions, customer portal, webhooks

**Email/SMS:**
- SendGrid - Transactional emails (receipts, password resets)
  - SDK/Client: @sendgrid/mail v8.1
  - Auth: API key ใน SENDGRID_API_KEY env var
  - Templates: Managed ใน SendGrid dashboard (template IDs ในโค้ด)

**External APIs:**
- OpenAI API - Course content generation
  - Integration method: REST API via openai npm package v4.x
  - Auth: Bearer token ใน OPENAI_API_KEY env var
  - Rate limits: 3500 requests/นาที (tier 3)

## Data Storage

**Databases:**
- PostgreSQL on Supabase - Primary data store
  - Connection: via DATABASE_URL env var
  - Client: Prisma ORM v5.8
  - Migrations: prisma migrate ใน prisma/migrations/

**File Storage:**
- Supabase Storage - User uploads (profile images, course materials)
  - SDK/Client: @supabase/supabase-js v2.x
  - Auth: Service role key ใน SUPABASE_SERVICE_ROLE_KEY
  - Buckets: avatars (public), course-materials (private)

**Caching:**
- ไม่มีปัจจุบัน (ทุก database queries ไม่มี Redis)

## Authentication & Identity

**Auth Provider:**
- Supabase Auth - Email/password + OAuth
  - Implementation: Supabase client SDK พร้อม server-side session management
  - Token storage: httpOnly cookies via @supabase/ssr
  - Session management: JWT refresh tokens handled โดย Supabase

**OAuth Integrations:**
- Google OAuth - Social sign-in
  - Credentials: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET (Supabase dashboard)
  - Scopes: email, profile

## Monitoring & Observability

**Error Tracking:**
- Sentry - Server และ client errors
  - DSN: SENTRY_DSN env var
  - Release tracking: Git commit SHA via SENTRY_RELEASE

**Analytics:**
- ไม่มี (วางแผน: Mixpanel)

**Logs:**
- Vercel logs - stdout/stderr only
  - Retention: 7 วันบน Pro plan

## CI/CD & Deployment

**Hosting:**
- Vercel - Next.js app hosting
  - Deployment: Automatic on main branch push
  - Environment vars: Configured ใน Vercel dashboard (synced ไปยัง .env.example)

**CI Pipeline:**
- GitHub Actions - Tests และ type checking
  - Workflows: .github/workflows/ci.yml
  - Secrets: ไม่ต้องการ (public repo tests only)

## Environment Configuration

**Development:**
- Required env vars: DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- Secrets location: .env.local (gitignored), team shared via 1Password vault
- Mock/stub services: Stripe test mode, Supabase local dev project

**Staging:**
- ใช้ separate Supabase staging project
- Stripe test mode
- Same Vercel account, different environment

**Production:**
- Secrets management: Vercel environment variables
- Database: Supabase production project พร้อม daily backups

## Webhooks & Callbacks

**Incoming:**
- Stripe - /api/webhooks/stripe
  - Verification: Signature validation via stripe.webhooks.constructEvent
  - Events: payment_intent.succeeded, customer.subscription.updated, customer.subscription.deleted

**Outgoing:**
- ไม่มี

---

*Integration audit: 2025-01-20*
*อัปเดตเมื่อเพิ่ม/ลบ external services*
```
</good_examples>

<guidelines>
**อะไรควรอยู่ใน INTEGRATIONS.md:**
- External services ที่โค้ดติดต่อด้วย
- Authentication patterns (secrets อยู่ที่ไหน ไม่ใช่ secrets เอง)
- SDKs และ client libraries ที่ใช้
- Environment variable names (ไม่ใช่ values)
- Webhook endpoints และ verification methods
- Database connection patterns
- File storage locations
- Monitoring และ logging services

**อะไรไม่ควรอยู่ที่นี่:**
- Actual API keys หรือ secrets (ไม่เขียนสิ่งเหล่านี้เด็ดขาด)
- Internal architecture (นั่นคือ ARCHITECTURE.md)
- Code patterns (นั่นคือ PATTERNS.md)
- Technology choices (นั่นคือ STACK.md)
- Performance issues (นั่นคือ CONCERNS.md)

**เมื่อกรอกเทมเพลตนี้:**
- ตรวจสอบ .env.example หรือ .env.template สำหรับ required env vars
- มองหา SDK imports (stripe, @sendgrid/mail, เป็นต้น)
- ตรวจสอบ webhook handlers ใน routes/endpoints
- Note ว่า secrets managed ที่ไหน (ไม่ใช่ secrets)
- Document environment-specific differences (dev/staging/prod)
- รวม auth patterns สำหรับแต่ละ service

**มีประโยชน์สำหรับ phase planning เมื่อ:**
- เพิ่ม external service integrations ใหม่
- Debugging authentication issues
- เข้าใจ data flow นอก application
- ตั้งค่า environments ใหม่
- Auditing third-party dependencies
- วางแผนสำหรับ service outages หรือ migrations

**Security note:**
Document WHERE secrets อยู่ (env vars, Vercel dashboard, 1Password) ไม่ใช่ WHAT secrets เป็น
</guidelines>
