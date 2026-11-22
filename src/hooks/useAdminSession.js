import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/**
 * Tells a component whether the manager is logged in, and keeps it updated.
 *
 * Returns { status, session }:
 *   status = "loading"    -> still asking Supabase (first split second)
 *          | "signed-out" -> nobody logged in
 *          | "signed-in"  -> logged in; `session.user` and `session.access_token` exist
 *
 * WHY "loading" exists: reading the saved session takes a moment. Without it,
 * the guard would think "nobody's logged in" on the first render and bounce a
 * logged-in manager to the login page every time they refresh.
 */
export function useAdminSession() {
  const [state, setState] = useState({ status: supabase ? "loading" : "signed-out", session: null });

  useEffect(() => {
    if (!supabase) return undefined;

    const apply = (session) => setState({ status: session ? "signed-in" : "signed-out", session });

    // 1. What's saved right now?
    supabase.auth.getSession().then(({ data }) => apply(data.session));

    // 2. Tell me whenever it changes (login, logout, token refreshed, another tab logs out).
    const { data } = supabase.auth.onAuthStateChange((_event, session) => apply(session));

    // WHY unsubscribe: when this component disappears, stop listening, or the
    // listener would keep running in the background and try to update a dead component.
    return () => data.subscription.unsubscribe();
  }, []);

  return state;
}

/**
 * Is this user an admin? Reads the same field as the backend's getUserRole():
 * app_metadata.role (only the server can change app_metadata; users CAN edit
 * their own user_metadata, so that one is never trusted for roles).
 *
 * WHY check in the browser if the backend checks anyway: only for a nicer
 * screen ("this account isn't an admin") instead of a page full of 403 errors.
 * The REAL protection is the backend's requireRole("admin").
 */
export function isAdmin(session) {
  return session?.user?.app_metadata?.role === "admin";
}
