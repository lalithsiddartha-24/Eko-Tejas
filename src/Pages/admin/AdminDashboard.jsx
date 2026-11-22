import { CalendarCheck, LogOut, MessageSquare } from "lucide-react";
import { NavLink } from "react-router-dom";
import BookingsTable from "../../Components/admin/BookingsTable";
import EnquiriesTable from "../../Components/admin/EnquiriesTable";
import PageMeta from "../../Components/PageMeta";
import Button from "../../Components/ui/Button";
import { useAdminSession } from "../../hooks/useAdminSession";
import { supabase } from "../../lib/supabase";

/**
 * The staff area: a header, two tabs, and the list for the chosen tab.
 *
 *   /admin            -> test drive bookings  (section="bookings")
 *   /admin/enquiries  -> enquiries            (section="enquiries")
 *
 * WHY each tab has its own URL (instead of a tab remembered only in memory):
 * refreshing the page, the Back button and bookmarks all keep the right tab.
 *
 * RequireAdmin (in App.jsx) has already checked the login before this renders.
 */
const TABS = [
  { to: "/admin", label: "Test drives", icon: CalendarCheck, end: true },
  { to: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
];

function AdminDashboard({ section = "bookings" }) {
  const { session } = useAdminSession();

  return (
    <main className="min-h-svh bg-mint-50">
      <PageMeta title={section === "enquiries" ? "Admin · Enquiries" : "Admin · Test drives"} />
      {/* WHY noindex: admin pages must not appear in Google results. */}
      <meta name="robots" content="noindex" />

      <header className="border-b border-forest-900/8 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <p className="font-display text-lg font-semibold tracking-tight text-forest-950">
            Eko Tejas <span className="font-normal text-muted">· Admin</span>
          </p>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted sm:inline">{session?.user?.email}</span>
            {/* signOut() deletes the saved session. useAdminSession hears it, and the guard sends us to /admin/login. */}
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>
              <LogOut size={16} /> Log out
            </Button>
          </div>
        </div>

        {/* Tabs. NavLink knows which one matches the URL; `end` stops "/admin" matching "/admin/enquiries" too. */}
        <nav aria-label="Admin sections" className="mx-auto flex max-w-5xl gap-1 px-5">
          {TABS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `-mb-px inline-flex items-center gap-2 border-b-2 px-3 pb-3 pt-1 text-sm font-semibold transition-colors ${
                  isActive ? "border-forest-950 text-forest-950" : "border-transparent text-muted hover:text-forest-900"
                }`
              }
            >
              <Icon size={16} aria-hidden="true" /> {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:py-12">
        {section === "enquiries" ? <EnquiriesTable /> : <BookingsTable />}
      </div>
    </main>
  );
}

export default AdminDashboard;
