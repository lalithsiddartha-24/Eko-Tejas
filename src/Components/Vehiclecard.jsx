import { ArrowRight, Gauge, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { formatSpecificationValue, isThreeWheelerCategory } from "../utils/vehicleFormat";
import VehicleImage from "./ui/VehicleImage";
import { getVehicleMedia } from "./vehicleShowcaseUtils";

/**
 * One vehicle in the listing grid.
 *
 * Design choices:
 *   - The photo area is the hero of the card (big, soft gradient behind it).
 *   - Range and power are shown as "spec pills": the two numbers buyers
 *     compare first, readable at a glance.
 *   - Two clear actions: see details, or jump straight to booking a test
 *     drive (`#book` scrolls to the form on the detail page).
 */
function VehicleCard({ vehicle, index, viewTo = "/vehicles" }) {
  const threeWheeler = isThreeWheelerCategory(vehicle.category);
  // Use the API image if there is one; otherwise the first gallery photo we
  // know about (the same source the detail page uses). If neither exists,
  // <VehicleImage> draws its placeholder.
  const media = getVehicleMedia(vehicle);
  const photo = vehicle.image || media.images[0]?.src || [...media.colorImages.values()][0]?.[0]?.src;
  const specs = [
    vehicle.range && { icon: Gauge, label: "Range", value: formatSpecificationValue("range", vehicle.range) },
    vehicle.power && { icon: Zap, label: "Power", value: formatSpecificationValue("power", vehicle.power) },
  ].filter(Boolean);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-forest-900/8 bg-white p-2.5 transition duration-500 hover:-translate-y-1 hover:border-forest-900/15 hover:shadow-lift has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-forest-600 motion-reduce:hover:translate-y-0">
      <div className="relative overflow-hidden rounded-[1.35rem]">
        <VehicleImage
          src={photo}
          name={vehicle.name}
          alt=""
          isThreeWheeler={threeWheeler}
          className="aspect-[4/3] w-full"
          imgClassName="transition-transform duration-700 group-hover:scale-[1.05] motion-reduce:transition-none"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/80 px-2.5 py-1 font-display text-xs font-bold text-forest-700 backdrop-blur">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-5 sm:px-4">
        <h3 className="font-display text-2xl font-semibold tracking-[-0.035em] text-forest-950">
          {/* "Stretched link": the ::after layer covers the whole card, so a click anywhere opens the details. */}
          <Link to={viewTo} state={{ vehicle }} className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline">
            {vehicle.name}
          </Link>
        </h3>
        {vehicle.tagline && <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-muted">{vehicle.tagline}</p>}

        {specs.length > 0 && (
          <dl className="mt-5 grid grid-cols-2 gap-2">
            {specs.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl bg-mint-50 px-3.5 py-3">
                <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                  <Icon size={12} className="text-forest-600" aria-hidden="true" />
                  {label}
                </dt>
                <dd className="mt-1 font-display text-base font-bold text-forest-900">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-auto flex items-center gap-2 pt-5">
          {/* `relative z-10` lifts this link above the card-wide click area. */}
          <Link
            to={`${viewTo}#book`}
            className="relative z-10 inline-flex h-11 flex-1 items-center justify-center rounded-full border border-forest-900/15 px-4 text-sm font-semibold text-forest-900 transition-colors hover:border-forest-900/40 hover:bg-mint-50"
          >
            Book test drive
          </Link>
          <span
            aria-hidden="true"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest-950 text-white transition-colors group-hover:bg-forest-700"
          >
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

/** Grey placeholder shapes shown while vehicles are loading. */
export function VehicleCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col rounded-[1.75rem] border border-forest-900/8 bg-white p-2.5">
      <div className="aspect-[4/3] animate-pulse rounded-[1.35rem] bg-mint-100" />
      <div className="space-y-3 px-4 pb-4 pt-6">
        <div className="h-6 w-1/2 animate-pulse rounded-full bg-mint-100" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-mint-100" />
        <div className="grid grid-cols-2 gap-2 pt-3">
          <div className="h-16 animate-pulse rounded-2xl bg-mint-50" />
          <div className="h-16 animate-pulse rounded-2xl bg-mint-50" />
        </div>
        <div className="h-11 animate-pulse rounded-full bg-mint-50" />
      </div>
    </div>
  );
}

export default VehicleCard;
