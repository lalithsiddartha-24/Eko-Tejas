import { ArrowRight, RotateCw, Search, SearchX } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useVehicles } from "../hooks/useVehicles";
import VehicleCard, { VehicleCardSkeleton } from "./Vehiclecard";
import Button from "./ui/Button";
import Container from "./ui/Container";
import Reveal from "./ui/Reveal";

const categoryTabs = [
  { label: "2-Wheelers", to: "/twowheelers" },
  { label: "3-Wheelers", to: "/vehicles" },
];

/**
 * The full listing page, shared by the 2-wheeler and 3-wheeler routes.
 * Each page passes its own text and API category; the layout is identical,
 * which is exactly what makes the two pages feel like one product.
 *
 * Every data request has FOUR possible states, and good UI designs each one:
 *   loading -> skeleton cards (the page shape appears instantly)
 *   error   -> a clear message and a "Try again" button
 *   empty   -> a friendly "nothing here" message
 *   success -> the grid of vehicles
 */
function VehicleListing({ category, eyebrow, title, accent, description, detailPath }) {
  const { vehicles, loading, error, retry } = useVehicles(category);
  const [query, setQuery] = useState("");

  // Simple search: filter in the browser, no extra API call needed.
  const search = query.trim().toLocaleLowerCase();
  const visible = search
    ? vehicles.filter((vehicle) =>
        `${vehicle.name} ${vehicle.tagline || ""}`.toLocaleLowerCase().includes(search),
      )
    : vehicles;

  return (
    <main>
      {/* Dark page header that sits behind the floating navbar (like the home hero). */}
      <header className="relative isolate -mt-19 overflow-hidden bg-forest-900 pb-24 pt-19 text-white sm:-mt-20 sm:pb-28 sm:pt-20">
        <div aria-hidden="true" className="bg-grid-dark absolute inset-0 -z-10" />
        <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 h-[28rem] w-[28rem] rounded-full bg-forest-600/45 blur-[110px]" />

        <Container className="pt-14 sm:pt-20">
          <nav aria-label="Vehicle categories" className="inline-flex rounded-full border border-white/10 bg-white/[0.06] p-1 backdrop-blur">
            {categoryTabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive ? "bg-volt text-forest-950" : "text-white/70 hover:text-white"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>

          <p className="mt-10 text-xs font-bold uppercase tracking-[0.22em] text-volt">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-[2.6rem] font-extrabold leading-[1] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            {title} <span className="text-sage-300">{accent}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">{description}</p>
        </Container>
      </header>

      <Container className="relative -mt-12 pb-20 sm:pb-28">
        {/* Toolbar: result count + search. Overlaps the header like the home feature strip. */}
        <div className="flex flex-col gap-3 rounded-2xl border border-forest-900/8 bg-white p-3 shadow-lift sm:flex-row sm:items-center sm:justify-between sm:pl-6">
          <p className="px-2 text-sm text-muted sm:px-0" aria-live="polite">
            {loading
              ? "Loading vehicles…"
              : error
                ? "Couldn't load vehicles"
                : `${visible.length} ${visible.length === 1 ? "model" : "models"}${search ? ` matching “${query.trim()}”` : " available"}`}
          </p>
          <label className="relative block sm:w-72">
            <span className="sr-only">Search vehicles</span>
            <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name"
              disabled={loading || Boolean(error)}
              className="h-11 w-full rounded-xl border border-forest-900/10 bg-mint-50 pl-11 pr-4 text-sm text-ink placeholder:text-muted/70 focus:border-forest-600 focus:outline-none focus:ring-4 focus:ring-forest-600/15 disabled:opacity-60"
            />
          </label>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <VehicleCardSkeleton key={index} />
              ))}
              <span className="sr-only" role="status">Loading vehicles…</span>
            </div>
          ) : error ? (
            <EmptyState
              icon={<RotateCw size={26} />}
              title="Something went wrong"
              text={error}
              action={
                <Button variant="dark" onClick={retry}>
                  <RotateCw size={16} /> Try again
                </Button>
              }
              alert
            />
          ) : visible.length === 0 ? (
            <EmptyState
              icon={<SearchX size={26} />}
              title={search ? "No matching vehicles" : "No vehicles yet"}
              text={search ? "Try a different name, or clear the search." : "New models are on the way. Check back soon."}
              action={
                search ? (
                  <Button variant="outline" onClick={() => setQuery("")}>
                    Clear search
                  </Button>
                ) : null
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((vehicle, index) => (
                <Reveal key={vehicle.id ?? vehicle.name} delay={(index % 3) * 0.06}>
                  <VehicleCard vehicle={vehicle} index={index} viewTo={detailPath(vehicle)} />
                </Reveal>
              ))}
            </div>
          )}
        </div>

        {/* Closing call to action */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-mint-100 p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-forest-900 sm:text-3xl">Not sure which one fits you?</h2>
            <p className="mt-2 max-w-lg text-muted">Tell us how you ride or what you carry, and we&apos;ll help you choose.</p>
          </div>
          <Button to="/#contact" variant="dark" size="lg">
            Talk to our team <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </Container>
    </main>
  );
}

function EmptyState({ icon, title, text, action, alert = false }) {
  return (
    <div
      role={alert ? "alert" : undefined}
      className="flex flex-col items-center rounded-[2rem] border border-dashed border-forest-900/15 bg-white px-6 py-16 text-center"
    >
      <span className="grid h-14 w-14 place-items-center rounded-full bg-mint-100 text-forest-600">{icon}</span>
      <h2 className="mt-5 font-display text-xl font-bold text-forest-900">{title}</h2>
      <p className="mt-2 max-w-sm text-muted">{text}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export default VehicleListing;
