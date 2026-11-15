import { useState } from "react";
import { AutoIllustration, ScooterIllustration } from "./VehicleIllustrations";

/**
 * Shows a vehicle photo, or a designed placeholder when there is no photo.
 *
 * WHY: the API often returns `image: null`. The old card fell back to the
 * same scooter photo for every vehicle, so a three-wheeler showed a scooter,
 * which is confusing. The placeholder shows a simple line drawing of the
 * right kind of vehicle plus its name, so the card still looks intentional.
 *
 * If a photo URL exists but fails to load (broken link), `onError` remembers
 * that URL and we show the placeholder instead of a broken-image icon.
 */
function VehicleImage({ src, alt, name = "", isThreeWheeler = false, className = "", imgClassName = "" }) {
  const [failedSrc, setFailedSrc] = useState("");
  const showPhoto = Boolean(src) && src !== failedSrc;

  return (
    <div
      className={`@container relative isolate flex items-center justify-center overflow-hidden bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff_0%,var(--color-mint-100)_55%,var(--color-mint-200)_100%)] ${className}`}
    >
      {/* Soft "floor" shadow so the vehicle looks like it is standing somewhere. */}
      <div
        aria-hidden="true"
        className="absolute bottom-[12%] left-1/2 -z-10 h-[10%] w-[70%] -translate-x-1/2 rounded-[50%] bg-forest-900/15 blur-xl"
      />

      {showPhoto ? (
        <img
          src={src}
          alt={alt || name}
          loading="lazy"
          onError={() => setFailedSrc(src)}
          className={`h-full w-full object-contain p-6 drop-shadow-[0_20px_22px_rgb(15_46_39/0.18)] ${imgClassName}`}
        />
      ) : (
        <div role="img" aria-label={`${name || "Vehicle"} – photo coming soon`} className="flex h-full w-full flex-col items-center justify-center">
          {/* Big faded name in the background, like a magazine cover. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none truncate px-4 text-center font-display text-[clamp(3rem,14cqw,6rem)] font-extrabold uppercase leading-none tracking-[-0.05em] text-forest-900/[0.05]"
          >
            {name}
          </span>
          {isThreeWheeler ? (
            <AutoIllustration className="relative w-[48%] max-w-60 text-forest-700/45" />
          ) : (
            <ScooterIllustration className="relative w-[46%] max-w-56 text-forest-700/45" />
          )}
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-forest-900/10 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-forest-600 backdrop-blur">
            Photo coming soon
          </span>
        </div>
      )}
    </div>
  );
}

export default VehicleImage;
