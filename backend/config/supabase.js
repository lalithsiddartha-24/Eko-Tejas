const { createClient } = require("@supabase/supabase-js");

function getRequiredEnvironmentValue(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function createSupabaseClient() {
  const supabaseUrl = getRequiredEnvironmentValue("SUPABASE_URL");
  const publicKey =
    process.env.SUPABASE_ANON_KEY?.trim() ||
    process.env.SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!publicKey) {
    throw new Error(
      "Missing required environment variable: SUPABASE_ANON_KEY or SUPABASE_PUBLISHABLE_KEY"
    );
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(supabaseUrl);
  } catch {
    throw new Error("SUPABASE_URL must be a valid HTTP(S) URL");
  }
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("SUPABASE_URL must be a valid HTTP(S) URL");
  }

  return createClient(supabaseUrl, publicKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

module.exports = { createSupabaseClient };
