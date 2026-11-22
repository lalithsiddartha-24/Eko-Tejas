import { LogOut, ShieldAlert } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";
import { isAdmin, useAdminSession } from "../../hooks/useAdminSession";
import { supabase } from "../../lib/supabase";
import Button from "../ui/Button";

/**
 * The guard at the door of every admin page.
 *
 *   <RequireAdmin><AdminDashboard /></RequireAdmin>
 *
 *   loading            -> show a small "Checking…" message
 *   not logged in      -> send to /admin/login (and remember where they wanted to go)
 *   logged in, no role -> "This account isn't an admin" + log out button
 *   admin              -> show the page
 *
 * This is the FRONTEND twin of the backend's `authenticate` + `requireRole("admin")`.
 * It only hides screens. The backend still checks every request, because anyone
 * can skip the browser and call /api/bookings directly.
 */
function RequireAdmin({ children }) {
  const { status, session } = useAdminSession();
  const location = useLocation();

  if (status === "loading") {
    return (
      <p role="status" className="py-24 text-center text-sm text-muted">
        Checking your login…
      </p>
    );
  }

  if (status === "signed-out") {
    // `state.from` lets the login page send them back here after logging in.
    // `replace` swaps the history entry, so the Back button doesn't loop here.
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin(session)) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-5 py-24 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-600">
          <ShieldAlert size={22} aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-forest-950">This account isn&apos;t an admin</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          You&apos;re logged in as <strong className="text-forest-900">{session.user.email}</strong>, but it doesn&apos;t have
          the admin role. Ask the owner to add it, then log in again.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => supabase.auth.signOut()}>
          <LogOut size={16} /> Log out
        </Button>
      </div>
    );
  }

  return children;
}

export default RequireAdmin;
