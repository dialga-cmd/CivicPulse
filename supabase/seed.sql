-- =============================================================================
-- CivicPulse — DEMO SEED DATA
--
-- Run this in the Supabase SQL editor (it runs with elevated privileges, so it
-- can insert regardless of RLS). It populates a handful of realistic complaints
-- across every status, including authority comments (initiative / handled_by)
-- that the public page will display.
--
-- Safe to re-run: it skips inserts if a complaint with the same id exists.
-- =============================================================================

insert into public.complaints
  (id, name, email, phone, category, location, description, status, initiative, handled_by, created_at)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'Rahul Verma', 'rahul.verma@example.com', '+91 98765 43210',
    'Roads & Pavements', 'MG Road, near Block C',
    'A large pothole on MG Road near Block C has been growing for weeks and damaged two car tyres. It becomes nearly invisible at night and is a hazard for cyclists.',
    'resolved',
    'Road crew filled and compacted the pothole on MG Road. Surface was re-marked and the stretch is now driveable. Thanks for the report.',
    'Aditya Raj', now() - interval '12 days'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Priya Sharma', 'priya.sharma@example.com', '+91 99887 76655',
    'Street Lighting', 'Sector 7, Park Avenue',
    'The streetlight in front of house 45 has not worked for over a month. The entire block is dark after 8pm, which is unsafe especially for pedestrians.',
    'in_progress',
    'Electrical crew visited and identified a faulty ballast. Replacement part is ordered and fitting is scheduled within 3 working days.',
    'Aditya Raj', now() - interval '8 days'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'Arjun Nair', 'arjun.nair@example.com', NULL,
    'Water Supply', 'Lakeview Colony, Gate 2',
    'There is a visible leak in the main supply line near Gate 2 that is wasting a large volume of water daily and flooding the footpath.',
    'acknowledged',
    'Complaint acknowledged. Water department has logged the leak and scheduled an inspection early next week.',
    NULL, now() - interval '5 days'
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'Sneha Kulkarni', 'sneha.k@example.com', '+91 90040 12345',
    'Waste Management', 'Greenwood Heights, Bin Point 3',
    'Garbage has not been collected from bin point 3 in five days. Overflowing bins are attracting stray animals and creating a bad smell across the colony.',
    'new', NULL, NULL, now() - interval '2 days'
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'Imran Khan', 'imran.khan@example.com', NULL,
    'Electricity', 'Azad Nagar, Lane 2',
    'Frequent power cuts in Lane 2 during peak hours, sometimes 4-5 times a day. Several residents reported voltage surges that damaged appliances.',
    'rejected',
    'Inspection found local demand is within capacity. Issue appears to be from a private electrical load; recommended residents contact their provider for meter-specific checks.',
    'Aditya Raj', now() - interval '9 days'
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    'Meera Joshi', 'meera.joshi@example.com', '+91 98123 45678',
    'Sanitation & Drainage', 'Old Market Road, Drain 12',
    'An open drain outside the old market is clogged and overflowing sewage into the street during the rains. The smell is unbearable for nearby shops.',
    'in_progress',
    'Cleaning crew deployed to unclog drain 12 and the surrounding network. Full desilting is in progress, expected completion in 2 days.',
    'Aditya Raj', now() - interval '3 days'
  );

-- Optional: uncomment and set your OWN admin email to seed the authorization list
-- (works for the admin dashboard after Google sign-in).
-- insert into public.admin_emails (email)
-- values ('adityaraj11d@gmail.com')
-- on conflict (email) do nothing;
