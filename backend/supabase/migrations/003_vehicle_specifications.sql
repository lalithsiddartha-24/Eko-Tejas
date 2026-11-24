-- =====================================================================
-- 003_vehicle_specifications.sql
-- Run once in: Supabase Dashboard -> SQL Editor -> New query -> Run
--
-- WHAT: turns the hand-made table "All vehicles" into a proper
-- `vehicle_specifications` table that is LINKED to `vehicles`, so the
-- vehicle detail page can show the full spec sheet.
--
-- WHY a new migration (and not editing 001/002): those already ran.
-- Each change to the database gets its own numbered file: 001 -> 002 -> 003.
--
-- SAFE TO RUN TWICE: every step checks first ("if exists", "if not exists").
-- NO DATA IS DELETED: we rename the table and ADD a column. Every spec value
-- stays exactly as it is.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Step 1: rename "All vehicles" -> vehicle_specifications
-- WHY: a name with a space and capital letters must be written with quotes
-- everywhere ("All vehicles"). snake_case matches our other tables
-- (test_drive_bookings, enquiries) and says what the table holds.
-- WHY the `do $$ ... $$` block: plain SQL can't say "rename only if the old
-- table exists and the new one doesn't". This small block can, so running the
-- file a second time does nothing instead of failing.
-- ---------------------------------------------------------------------
do $$
begin
  if to_regclass('public."All vehicles"') is not null
     and to_regclass('public.vehicle_specifications') is null then
    alter table public."All vehicles" rename to vehicle_specifications;
  end if;
end;
$$;

-- ---------------------------------------------------------------------
-- Step 2: add the link column, vehicle_id -> vehicles(id)
-- WHY a foreign key: today the two tables only line up because their ids
-- HAPPEN to be equal. A foreign key makes the link a rule the database
-- enforces: a spec sheet can't point to a vehicle that doesn't exist.
-- WHY "on delete cascade" (bookings use "restrict"): a spec sheet has no
-- meaning without its vehicle, so if a vehicle is ever deleted its specs go
-- with it. (Bookings are different: they are customer records we must keep,
-- so they BLOCK the delete instead.)
-- ---------------------------------------------------------------------
alter table public.vehicle_specifications
  add column if not exists vehicle_id bigint references public.vehicles(id) on delete cascade;

-- ---------------------------------------------------------------------
-- Step 3: fill vehicle_id for the existing 23 rows, matched by NAME
-- WHY by name and not by copying id: the name is what both tables really
-- agree on ("Axel Pro" is "Axel Pro"). Matching ids would only be a coincidence.
-- Only rows that are still empty are touched, so a second run changes nothing.
-- ---------------------------------------------------------------------
update public.vehicle_specifications s
set vehicle_id = v.id
from public.vehicles v
where s.vehicle_id is null
  and v.name = s.name;

-- Stop here with a clear message if any spec row found no vehicle
-- (e.g. a spelling difference). Better to fail loudly than to lose a link.
do $$
declare
  unmatched text;
begin
  select string_agg(name, ', ') into unmatched
  from public.vehicle_specifications
  where vehicle_id is null;

  if unmatched is not null then
    raise exception 'These spec rows have no matching vehicle name: %. Fix the names, then run this file again.', unmatched;
  end if;
end;
$$;

-- ---------------------------------------------------------------------
-- Step 4: make the link required, and one spec sheet per vehicle
-- WHY not null: every spec sheet must belong to a vehicle.
-- WHY unique: one vehicle = one spec sheet. The database now refuses a
-- second spec row for the same vehicle.
-- (Note: the Supabase API still returns the embed as a one-item list,
-- specifications: [{...}], because this is a unique INDEX, not a unique
-- CONSTRAINT. vehicle.service.js takes the first item, so both shapes work.)
-- ---------------------------------------------------------------------
alter table public.vehicle_specifications
  alter column vehicle_id set not null;

create unique index if not exists vehicle_specifications_vehicle_id_key
  on public.vehicle_specifications (vehicle_id);

-- ---------------------------------------------------------------------
-- Step 5: keep the table locked (RLS ON, no policies)
-- It already was. Saying it again here means a NEW project built from these
-- files gets the same protection. Only our backend (secret key) reads it.
-- ---------------------------------------------------------------------
alter table public.vehicle_specifications enable row level security;

-- Tell the Supabase API about the renamed table and the new link right away
-- (otherwise it can take a minute: the "schema cache" error you saw in Module 3).
notify pgrst, 'reload schema';
