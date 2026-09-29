# CivicPulse — Citizen Complaint Portal

A web application that lets citizens file formal complaints about local
infrastructure issues (roads, water, electricity, sanitation, lighting…) and
gives authorized administrators a dashboard to review, act on, and resolve them.

Built for the BRICS Track on AI for Digital Public Infrastructure & Governance
as a demonstration of a simple citizen → government feedback loop.

## Stack

- **Frontend:** Next.js (App Router) + React + TypeScript + Tailwind CSS
- **Backend / Database:** Supabase (Postgres) with Row Level Security
- **Auth:** Google OAuth via Supabase Auth

## Project overview

| Route | Purpose |
|-------|---------|
| `/` | Public citizen complaint form |
| `/admin` | Admin sign-in (Google) + complaint dashboard |
| `/admin/complaints/[id]` | Complaint detail + take action |

## Getting started

### 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL editor** and run the migration in
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
   This creates the `complaints` and `admin_emails` tables and their RLS policies.
3. Add **at least one admin**: run
   ```sql
   insert into public.admin_emails (email) values ('you@example.com');
   ```
   (Replace `you@example.com` with your own email — or run it via the dashboard
   using the service role before opening the site.)
4. Enable **Google OAuth**:
   - **Supabase → Authentication → Providers → Google**: enable it and copy the
     *Callback URL* it shows (e.g. `https://<ref>.supabase.co/auth/v1/callback`).
   - **Supabase → Authentication → URL Configuration → Redirect URLs**: add your
     app callback (for local dev):
     ```
     http://localhost:3000/auth/callback
     ```
   - **Google Cloud Console → APIs & Services → Credentials → your OAuth Client**:
     add as an **Authorized redirect URI** exactly the Supabase callback URL
     copied above (and you can also add `http://localhost:3000/auth/callback`).
   - All three must agree; a mismatch anywhere produces
     `Error 400: redirect_uri_mismatch`.

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
**Project Settings → API**.

### 3. Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## How authorization works

- Any visitor can submit a complaint (the `complaints` row-level insert policy
  is open; reads are restricted so PII stays private).
- An admin is any Supabase user whose authenticated Google email appears in the
  `admin_emails` table. Signing in with any other account shows an
  “Not authorized” screen.
- Admins can list complaints, view details, change their status
  (`new → acknowledged → in_progress → resolved/rejected`) and record the
  initiative taken.

> Security note: the `admin_emails` table is self-managed (admins can add
> others). For a real deployment, restrict who can manage it further or manage
> it only through the service role / dashboard.

## Deployment

The app is a standard Next.js application and deploys to any host that supports
Next.js (Vercel, Render, etc.) provided the two `NEXT_PUBLIC_*` environment
variables are set. See [next.config.ts](next.config.ts).

## Scripts

```bash
pnpm dev       # development server
pnpm build     # production build
pnpm start     # run the production build
pnpm lint      # eslint
```

## License

See [LICENSE](LICENSE).
