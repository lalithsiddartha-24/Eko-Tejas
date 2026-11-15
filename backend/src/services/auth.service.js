/**
 * services/auth.service.js
 *
 * WHY THIS FILE EXISTS:
 * Checking a login token means asking Supabase Auth. Supabase calls belong
 * in services, so the auth middleware asks this service instead of calling
 * Supabase itself. Same layering rule as everywhere else.
 */

const { supabase } = require("../config/supabase");
const ApiError = require("../utils/ApiError");

/**
 * Turns an access token (JWT) into the logged-in Supabase user.
 * @param {string} accessToken  The token the frontend got from supabase.auth.signInWithPassword()
 */
async function getUserFromToken(accessToken) {
  // WHY getUser(token) and not just decoding the JWT ourselves:
  // getUser asks Supabase Auth to check it, so a token from a user who was
  // deleted, banned or logged out is rejected too.
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data?.user) {
    throw ApiError.unauthorized("Your session is invalid or has expired. Please log in again.");
  }
  return data.user;
}

/**
 * Reads the user's role.
 * WHY app_metadata and NOT user_metadata:
 *   - user_metadata can be changed by the user themselves from the browser.
 *     Anyone could make themselves "admin".
 *   - app_metadata can only be changed with the secret key (our backend or
 *     the dashboard/SQL). Safe to trust for permissions.
 */
function getUserRole(user) {
  return user?.app_metadata?.role ?? null;
}

module.exports = { getUserFromToken, getUserRole };
