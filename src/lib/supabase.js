import { createClient } from "@supabase/supabase-js";

/**
 * The browser's Supabase client, used ONLY for admin login.
 *
 * WHY the frontend talks to Supabase here at all (Rule 2 says it shouldn't):
 * Rule 2 is about DATA. Bookings, enquiries and vehicles still go
 * Frontend -> Our Backend -> Supabase. Logging in is different: Supabase Auth
 * checks the password and hands the manager a token (their "staff ID card").
 * Our backend then checks that token on every admin request.
 *
 * WHY the PUBLISHABLE key is safe in the browser:
 * anything in a VITE_ variable is visible to every visitor. That's fine for the
 * publishable key: it can't read our tables, because RLS is ON with no policies.
 * The SECRET key must never be put here. It lives only in backend/.env.
 *
 * WHY `null` instead of crashing when the keys are missing:
 * customers never need this file. If the keys aren't set (e.g. on a fresh
 * checkout), the public site must still work. The admin login page shows a
 * setup message instead.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = url && publishableKey ? createClient(url, publishableKey) : null;
