-- =============================================================================
-- CivicPulse — Supabase schema
-- Run this once in the Supabase SQL editor, or commit it and use the CLI.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Complaints — the citizen reports
-- -----------------------------------------------------------------------------
create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  category text not null,
  location text not null,
  description text not null,
  status text not null default 'new'
    check (status in ('new','acknowledged','in_progress','resolved','rejected')),
  initiative text,
  handled_by text
);

create index if not exists complaints_created_at_idx
  on public.complaints (created_at desc);

create index if not exists complaints_status_idx
  on public.complaints (status);

-- -----------------------------------------------------------------------------
-- Admin emails — the authorized administrator accounts
-- -----------------------------------------------------------------------------
create table if not exists public.admin_emails (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Row Level Security
--
--   * Citizens (and anonymous users) can INSERT complaints, but never read
--     the private records (they contain PII).
--   * Only authenticated admins whose email is in admin_emails can SELECT and
--     UPDATE complaints and read admin_emails.
-- =============================================================================
alter table public.complaints enable row level security;
alter table public.admin_emails enable row level security;

-- Anyone can submit a complaint.
create policy "citizens can insert complaints"
  on public.complaints for insert
  with check (true);

-- Admins can read complaints.
create policy "admins can read complaints"
  on public.complaints for select
  using (
    exists (
      select 1 from public.admin_emails
      where email = lower(auth.jwt() ->> 'email')
    )
  );

-- Admins can update complaints (take action).
create policy "admins can update complaints"
  on public.complaints for update
  using (
    exists (
      select 1 from public.admin_emails
      where email = lower(auth.jwt() ->> 'email')
    )
  );

-- Admins can read the admin email list (used at sign-in to gate the dashboard).
-- NOTE: this must NOT self-reference admin_emails in a subquery — RLS re-applies
-- to the inner query and the policy would see nothing. Compare the column
-- directly against the JWT email instead.
create policy "admins can read admin emails"
  on public.admin_emails for select
  using ( lower(email) = lower(auth.jwt() ->> 'email') );

-- Admins can manage the admin email list (add/remove admins).
create policy "admins can insert admin emails"
  on public.admin_emails for insert
  with check (
    exists (
      select 1 from public.admin_emails
      where email = lower(auth.jwt() ->> 'email')
    )
  );

create policy "admins can delete admin emails"
  on public.admin_emails for delete
  using (
    exists (
      select 1 from public.admin_emails
      where email = lower(auth.jwt() ->> 'email')
    )
  );

create policy "admins can update admin emails"
  on public.admin_emails for update
  using (
    exists (
      select 1 from public.admin_emails
      where email = lower(auth.jwt() ->> 'email')
    )
  );

-- -----------------------------------------------------------------------------
-- Bootstrap: add your first admin email here (REPLACE with your own email).
-- A good practice is to insert the admin via the Supabase Dashboard SQL editor
-- with the service-role before enabling Google OAuth for others.
-- -----------------------------------------------------------------------------
-- insert into public.admin_emails (email)
-- values ('your-admin@example.com');
