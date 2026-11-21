import { ArrowRight, RotateCw, Search, SearchX } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useVehicles } from "../hooks/useVehicles";
import VehicleCard, { VehicleCardSkeleton } from "./Vehiclecard";
import Button from "./ui/Button";
import Container from "./ui/Container";
import FocusInText from "./ui/FocusInText";
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
/*
 * Where the header photo sits on desktop:
 *   - "full":  fills the whole header (the 3-wheeler photo; the vehicle
 *              spans most of the picture anyway)
 *   - "right": fills only the right 60%, with its left edge faded out by a
 *              mask. For photos whose subject is in the CENTRE (the green
 *              scooter): it moves the subject out from behind the title.
 * On phones the photo always fills the header.
 */
const imagePlacements = {
  full: "lg:inset-0",
  right:
    "lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[60%] lg:[mask-image:linear-gradient(90deg,transparent,black_35%)]",
};

function VehicleListing({
  category,
  eyebrow,
  title,
  accent,
  description,
  detailPath,
  image,
  imageAlt = "",
  imagePlacement = "full",
}) {
  const { vehicles, loading, error, retry } = useVehicles(category);
  const dark = Boolean(image); // a photo header uses white text
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
      {/*
        Page header. Two looks:
          - no `image`: light white-to-mint fade (2-wheeler page)
          - with `image`: the photo fills the header as a background, and a
            black fade sits on top of it. The fade is darkest on the LEFT,
            behind the text, and clears toward the right so the vehicle
            stays vivid. That's how text stays readable on a busy photo.
        `dark` switches the text colours to white for the photo version.
      */}
      <header
        className={`relative isolate -mt-19 overflow-hidden pb-24 pt-19 sm:-mt-20 sm:pb-28 sm:pt-20 ${
          dark
            ? "bg-forest-950 lg:flex lg:min-h-[min(640px,80svh)] lg:items-center"
            : "bg-[linear-gradient(180deg,#ffffff_0%,var(--color-mint-100)_100%)]"
        }`}
      >
        {dark && (
          <>
            <img
              src={image}
              alt={imageAlt}
              // It's at the top of the page, so load it straight away.
              fetchPriority="high"
              className={`absolute inset-0 -z-20 h-full w-full object-cover ${imagePlacement === "full" ? "object-[62%_center]" : "object-center"} ${imagePlacements[imagePlacement]}`}
            />
            {/* Phones: text covers the whole width, so an even, stronger shade. */}
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/60 lg:hidden" />
            {/* Desktop: dark on the left behind the words, clear on the right. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgb(6_8_7/0.88)_0%,rgb(6_8_7/0.7)_35%,rgb(6_8_7/0.2)_65%,rgb(6_8_7/0)_85%)] lg:block"
            />
            {/* A little extra shade at the bottom, where the search bar overlaps. */}
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
          </>
        )}

        <Container className="pt-14 sm:pt-20 lg:pt-8">
          <div className={dark ? "max-w-xl" : ""}>
            <nav
              aria-label="Vehicle categories"
              className={`inline-flex rounded-full border p-1 ${
                dark ? "border-white/15 bg-white/10 backdrop-blur" : "border-forest-900/8 bg-white"
              }`}
            >
              {categoryTabs.map((tab) => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? dark
                          ? "bg-white text-forest-950"
                          : "bg-forest-950 text-white"
                        : dark
                          ? "text-white/75 hover:text-white"
                          : "text-muted hover:text-forest-950"
                    }`
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
            </nav>

            {/* `flex w-fit` (not inline-flex) keeps the label on its own line under the tabs. */}
            <p
              className={`mt-10 flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] ${
                dark ? "text-white/75" : "text-muted"
              }`}
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />
              {eyebrow}
            </p>
            <h1
              className={`mt-4 max-w-3xl text-balance font-display text-[2.6rem] font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl lg:text-7xl ${
                dark ? "text-white" : "text-forest-950"
              }`}
            >
              {/* Each header gets the word animation that suits its background:
                  - light header: `highlight-sweep` (index.css), a mint marker stroke behind the word
                  - photo header: <FocusInText>, the letters blur into focus one by one,
                    matching the motion-blur photo behind them */}
              {title}{" "}
              {dark ? <FocusInText text={accent} /> : <span className="highlight-sweep">{accent}</span>}
            </h1>
            <p className={`mt-5 max-w-xl text-base leading-7 sm:text-lg sm:leading-8 ${dark ? "text-white/80" : "text-muted"}`}>
              {description}
            </p>
          </div>
        </Container>
      </header>

      <Container className="relative -mt-12 pb-20 sm:pb-28">
        {/* Toolbar: result count + search. Overlaps the header like the home feature strip. */}
        <div className="flex flex-col gap-3 rounded-2xl border border-forest-900/8 bg-white p-3 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:pl-6">
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
        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-mint-50 p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-forest-950 sm:text-3xl">Not sure which one fits you?</h2>
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
