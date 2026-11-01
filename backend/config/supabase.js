const { createClient } = require("@supabase/supabase-js");

function getRequiredEnvironmentValue(names, label) {
  const value = names
    .map((name) => process.env[name])
    .find((candidate) => typeof candidate === "string" && candidate.trim());
  if (!value) {
    throw new Error(`Missing required environment variable: ${label}`);
  }
  return value.trim();
}

function createSupabaseClients() {
  const supabaseUrl = getRequiredEnvironmentValue(
    ["SUPABASE_URL"],
    "SUPABASE_URL"
  );
  const serviceKey = getRequiredEnvironmentValue(
    ["SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_SECRET_KEY"],
    "SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY"
  );
  const publicKey =
    process.env.SUPABASE_ANON_KEY?.trim() ||
    process.env.SUPABASE_PUBLISHABLE_KEY?.trim() ||
    serviceKey;

  let parsedUrl;
  try {
    parsedUrl = new URL(supabaseUrl);
  } catch {
    throw new Error("SUPABASE_URL must be a valid HTTP(S) URL");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("SUPABASE_URL must be a valid HTTP(S) URL");
  }

  const authClient = createClient(supabaseUrl, publicKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  const databaseClient = createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return { authClient, databaseClient };
}

module.exports = { createSupabaseClients };
