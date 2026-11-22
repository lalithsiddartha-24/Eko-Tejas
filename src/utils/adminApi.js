import { supabase } from "../lib/supabase";
import { readApiJson } from "./api";

/**
 * fetch() for admin pages: same as a normal fetch, plus the login token.
 *
 * WHY one helper: every admin request needs the header
 *   Authorization: Bearer <token>
 * Writing it once here means no page can forget it.
 *
 * On the backend, `authenticate` (auth.middleware.js) reads exactly this
 * header: header.split(" ") -> ["Bearer", token]. This is where the two
 * halves of the project meet.
 *
 * Usage:
 *   const payload = await adminFetch("/api/bookings?page=1");
 *   const payload = await adminFetch("/api/bookings/41/status", {
 *     method: "PATCH",
 *     body: { status: "confirmed" },
 *   });
 */
export async function adminFetch(url, { method = "GET", body } = {}) {
  // Supabase remembers the logged-in session in the browser.
  // getSession() reads it back (and refreshes the token if it expired).
  const { data } = supabase ? await supabase.auth.getSession() : { data: {} };
  const token = data?.session?.access_token;

  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  // Same reader as the public forms: returns { success, message, data },
  // or throws an Error carrying `status` (401, 403, 409...) and `errors`.
  return readApiJson(response);
}
