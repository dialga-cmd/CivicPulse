-- =============================================================================
-- CivicPulse — public complaints listing
--
-- Exposes a public-safe view over `complaints` so that anyone can browse
-- reported issues and their resolution status WITHOUT revealing complainant
-- PII (name, email, phone). Those columns stay readable only by admins on the
-- base table via RLS.
--
-- The view intentionally selects only non-sensitive columns. It uses the
-- default (security definer) behavior so anonymous users can read it, while the
-- select never touches PII.
-- =============================================================================

drop view if exists public.complaints_public;

create view public.complaints_public as
select
  id,
  created_at,
  updated_at,
  category,
  location,
  description,
  status,
  initiative,
  handled_by
from public.complaints;

-- Everyone (including anonymous users) can read the public view.
grant select on public.complaints_public to anon, authenticated;
