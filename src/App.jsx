import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Contact from "./Components/Contact";
import Coreservice from "./Components/Coreservice";
import Features from "./Components/Features";
import Footer from "./Components/Footer";
import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar";
import PageMeta from "./Components/PageMeta";
import ScrollManager from "./Components/ScrollManager";
import Service from "./Components/Service";
import Vehiclecards from "./Components/Vehiclecards";

/*
 * CODE SPLITTING: load each page's code only when someone visits it.
 *
 * Before, the browser downloaded the code for EVERY page on the first
 * visit, even if the person only looked at the home page. `lazy()` puts
 * each of these pages into its own small file that is fetched the first
 * time that page is opened. The home page is imported normally, because
 * almost everyone lands there first, so it should be ready instantly.
 *
 * <Suspense> shows its `fallback` for the split second while a page's file
 * is downloading.
 */
const Twowheeler = lazy(() => import("./Pages/Twowheeler"));
const Threewheeler = lazy(() => import("./Pages/Threewheeler"));
const VehiclePresentation = lazy(() => import("./Pages/VehiclePresentation"));
const NotFound = lazy(() => import("./Pages/NotFound"));
// Admin pages are lazy too: customers never download the admin code
// (or the Supabase login library it uses).
const AdminLogin = lazy(() => import("./Pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./Pages/admin/AdminDashboard"));
const RequireAdmin = lazy(() => import("./Components/admin/RequireAdmin"));

function HomePage() {
  return (
    <main>
      <PageMeta />
      <Hero />
      <Features />
      <Vehiclecards />
      <Service />
      <Coreservice />
      <Contact />
    </main>
  );
}

/** A quiet placeholder while a page's code loads (usually a blink). */
function PageLoading() {
  return (
    <div role="status" className="flex min-h-[60vh] items-center justify-center">
      <span className="h-1.5 w-24 animate-pulse rounded-full bg-mint-200" />
      <span className="sr-only">Loading page…</span>
    </div>
  );
}

function App() {
  // WHY: admin pages are a staff tool with their own header, so they don't
  // show the customer navbar ("Book a test drive"...) or the footer.
  const isAdminPage = useLocation().pathname.startsWith("/admin");

  return (
    // `flex min-h-svh flex-col` + `flex-1` on the content keeps the footer at
    // the bottom of the screen even on short pages (like an error page).
    <div className="flex min-h-svh flex-col">
      <ScrollManager />
      {!isAdminPage && <Navbar />}

      <div className="flex-1">
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/twowheelers" element={<Twowheeler />} />
            <Route path="/vehicles" element={<Threewheeler />} />
            <Route path="/vehicle-presentation/:vehicleCategory/:vehicleName" element={<VehiclePresentation />} />
            <Route path="/vehicle-presentation/:vehicleName" element={<VehiclePresentation />} />
            <Route path="/vehicle-presentation" element={<VehiclePresentation />} />

            {/* Staff only. RequireAdmin = the frontend guard; the backend still checks every request. */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminDashboard section="bookings" />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/enquiries"
              element={
                <RequireAdmin>
                  <AdminDashboard section="enquiries" />
                </RequireAdmin>
              }
            />
            {/* Any other address: a friendly "page not found" instead of a silent redirect. */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>

      {!isAdminPage && <Footer />}
    </div>
  );
}

export default App;
