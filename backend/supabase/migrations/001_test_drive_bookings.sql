-- =====================================================================
-- 001_test_drive_bookings.sql
-- Run once in: Supabase Dashboard -> SQL Editor -> New query -> Run
--
-- WHY a migration file in git (instead of clicking in the dashboard):
-- the table design is versioned with the code that uses it. A new
-- environment (staging, a teammate's project) can be rebuilt exactly.
-- =====================================================================

create table if not exists public.test_drive_bookings (
  id                  bigint generated always as identity primary key,

  -- WHY a foreign key: the database itself refuses a booking for a
  -- vehicle that doesn't exist. "on delete restrict" stops someone from
  -- deleting a vehicle that still has bookings attached.
  vehicle_id          bigint not null references public.vehicles(id) on delete restrict,

  customer_name       text   not null check (char_length(customer_name) between 2 and 80),
  phone               text   not null check (phone ~ '^[6-9][0-9]{9}$'),  -- Indian mobile, 10 digits
  email               text            check (email is null or char_length(email) <= 254),
  city                text   not null check (char_length(city) between 2 and 60),

  preferred_date      date   not null,
  preferred_time_slot text   not null check (preferred_time_slot in ('morning', 'afternoon', 'evening')),
  message             text            check (message is null or char_length(message) <= 500),

  -- WHY a status column: the dealership's workflow. Every booking starts
  -- 'pending'; staff move it to confirmed -> completed, or cancelled.
  status              text   not null default 'pending'
                             check (status in ('pending', 'confirmed', 'completed', 'cancelled')),

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- WHY these CHECKs duplicate the Zod rules: Zod is the first gate (friendly
-- error messages). The database is the last gate. Even a bug in our code,
-- or someone editing rows in the dashboard, can't store a phone like "abc".

-- Stop double-booking: the same phone can't hold two ACTIVE bookings for the
-- same vehicle on the same day. Cancelled/completed ones don't count, so a
-- customer can re-book after cancelling.
-- WHY in the database and not only in code: if the customer double-clicks
-- "Book", two requests arrive at the same moment. Both could pass a
-- "does it exist?" check in code; only a unique index truly blocks the second.
create unique index if not exists test_drive_bookings_no_duplicate_active
  on public.test_drive_bookings (phone, vehicle_id, preferred_date)
  where status in ('pending', 'confirmed');

-- Speeds up the admin list, which filters by status and sorts by date.
create index if not exists test_drive_bookings_status_date_idx
  on public.test_drive_bookings (status, preferred_date);

-- Keep updated_at correct automatically on every UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists test_drive_bookings_set_updated_at on public.test_drive_bookings;
create trigger test_drive_bookings_set_updated_at
  before update on public.test_drive_bookings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- RLS ON + NO POLICIES = the public anon/publishable key can do NOTHING
-- with this table (no read, no insert). Customer phone numbers stay
-- private. Only our backend, using the secret key, can touch it.
-- That is exactly Rule 2: Frontend -> Our Backend -> Supabase.
-- ---------------------------------------------------------------------
alter table public.test_drive_bookings enable row level security;
