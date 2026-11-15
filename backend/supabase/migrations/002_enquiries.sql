-- =====================================================================
-- 002_enquiries.sql
-- Run once in: https://supabase.com/dashboard/project/oqnacezxghmmskgkxypw/sql/new
--
-- An enquiry = "I have a question" (price, finance, dealership, service).
-- Different from a test drive booking: no date, no slot, vehicle optional.
-- =====================================================================

create table if not exists public.enquiries (
  id            bigint generated always as identity primary key,

  customer_name text not null check (char_length(customer_name) between 2 and 80),
  phone         text not null check (phone ~ '^[6-9][0-9]{9}$'),
  email         text          check (email is null or char_length(email) <= 254),
  city          text          check (city is null or char_length(city) between 2 and 60),

  -- WHY a type: the sales team routes enquiries. Pricing goes to sales,
  -- dealership goes to the business team, service goes to the workshop.
  enquiry_type  text not null default 'general'
                check (enquiry_type in ('general', 'pricing', 'finance', 'dealership', 'service')),

  -- Optional: "I want the price of the RUGD 120" vs a general question.
  -- "on delete set null": if a vehicle is removed, keep the enquiry
  -- (it's still a real customer) and just forget the vehicle link.
  vehicle_id    bigint references public.vehicles(id) on delete set null,

  message       text not null check (char_length(message) between 10 and 1000),

  -- Workflow: new -> contacted -> closed  (or new -> closed for spam/no answer)
  status        text not null default 'new'
                check (status in ('new', 'contacted', 'closed')),

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Admin list filters by status and shows newest first.
create index if not exists enquiries_status_created_idx
  on public.enquiries (status, created_at desc);

-- Reuse the updated_at trigger function created in 001.
drop trigger if exists enquiries_set_updated_at on public.enquiries;
create trigger enquiries_set_updated_at
  before update on public.enquiries
  for each row execute function public.set_updated_at();

-- RLS ON + no policies: the public key can't read or write customer
-- enquiries. Only our backend (secret key) can.
alter table public.enquiries enable row level security;
