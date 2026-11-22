import { LoaderCircle, LockKeyhole, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import PageMeta from "../../Components/PageMeta";
import Button from "../../Components/ui/Button";
import FormField from "../../Components/ui/FormField";
import { useAdminSession } from "../../hooks/useAdminSession";
import { supabase } from "../../lib/supabase";

/**
 * /admin/login: the manager types email + password and gets their token.
 *
 * WHO checks the password: Supabase Auth, not our backend. We never see or
 * store passwords. Supabase hands back a session containing the token, and
 * remembers it in the browser, so adminFetch() can read it later.
 */
function AdminLogin() {
  const { status } = useAdminSession();
  const navigate = useNavigate();
  const location = useLocation();
  // Where to go after logging in: the admin page they first tried to open, or /admin.
  const goTo = location.state?.from || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  // Already logged in? Skip the form.
  if (status === "signed-in") return <Navigate to={goTo} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault(); // stop the browser's page reload; we send in the background
    setError("");

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setSending(true);
    // ★ The one line that logs in. On success Supabase saves the session
    // (with data.session.access_token = the token) in the browser.
    const { error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setSending(false);

    if (loginError) {
      // WHY one vague message: saying "no such email" would tell an attacker
      // which emails have accounts. Same message for wrong email or password.
      setError("Email or password is incorrect.");
      return;
    }
    navigate(goTo, { replace: true });
  };

  return (
    <main className="flex min-h-svh items-center justify-center bg-mint-50 px-5 py-16">
      <PageMeta title="Admin login" />
      {/* WHY noindex: admin pages must not appear in Google results. */}
      <meta name="robots" content="noindex" />

      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center font-display text-lg font-semibold tracking-tight text-forest-950">
          Eko Tejas
        </Link>

        <div className="mt-6 rounded-[2rem] border border-forest-900/8 bg-white p-7 shadow-soft sm:p-8">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint-100 text-forest-700">
            <LockKeyhole size={20} aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight text-forest-950">Staff login</h1>
          <p className="mt-1 text-sm text-muted">Manage test drives and enquiries.</p>

          {!supabase ? (
            // Keys not set up yet: explain instead of crashing.
            <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              Admin login isn&apos;t set up yet. Add <code>VITE_SUPABASE_URL</code> and{" "}
              <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> to <code>.env.local</code> (see <code>.env.example</code>), then
              restart the dev server.
            </p>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4">
              <FormField
                label="Email"
                name="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FormField
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </p>
              )}

              <Button type="submit" size="lg" className="mt-2 w-full" disabled={sending}>
                {sending ? <LoaderCircle size={18} className="animate-spin" /> : <LogIn size={18} />}
                {sending ? "Logging in…" : "Log in"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;
