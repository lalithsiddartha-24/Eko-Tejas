/**
 * config/supabase.js
 *
 * WHY THIS FILE EXISTS:
 * This is the ONLY place in the backend that knows how to connect to Supabase.
 * Services import `supabase` from here. If the URL or key ever changes, we fix
 * it in one file instead of hunting through every service.
 *
 * WHY THE SECRET (SERVICE ROLE) KEY:
 * Our backend is a trusted server. It uses the secret key, which bypasses Row
 * Level Security (RLS), so it can insert bookings and enquiries on behalf of
 * customers. Because this key is so powerful it must NEVER reach the frontend,
 * a git commit, or a log line. It lives only in backend/.env.
 */

const { createClient } = require("@supabase/supabase-js");

// Read an env variable and fail loudly at startup if it is missing.
// WHY: a missing key should crash the server immediately with a clear message,
// not later with a confusing "401 Invalid API key" when a customer books a ride.
function requireEnv(name, ...fallbackNames) {
  for (const key of [name, ...fallbackNames]) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  throw new Error(
    `Missing environment variable: ${[name, ...fallbackNames].join(" or ")}. ` +
      "Add it to backend/.env (local) or to your Vercel project settings (production)."
  );
}

const supabaseUrl = requireEnv("SUPABASE_URL");

// SUPABASE_SECRET_KEY is the new-style key (sb_secret_...).
// SUPABASE_SERVICE_ROLE_KEY is the older JWT-style key. Both work the same way.
const supabaseSecretKey = requireEnv(
  "SUPABASE_SECRET_KEY",
  "SUPABASE_SERVICE_ROLE_KEY"
);

// WHY these auth options: a server has no browser, no localStorage and no
// "logged-in user" of its own. Turning these off stops supabase-js from trying
// to save or refresh a session that doesn't exist.
const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

module.exports = { supabase };
