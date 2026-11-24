import { useState } from "react";

/**
 * Shows a vehicle photo, or a designed placeholder when there is no photo.
 *
 * WHY: the API often returns `image: null`. The old card fell back to the
 * same scooter photo for every vehicle, so a three-wheeler showed a scooter,
 * which is confusing. The placeholder is pure typography: the model name in
 * large, soft letters, with the vehicle type above it. No clip-art: it
 * matches the quiet, editorial style of the rest of the site.
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
      {showPhoto ? (
        // WHY object-cover (fill the frame, trim the edges a little) and no padding:
        // our vehicle photos are studio shots with their own background and floor.
        // Shrinking them with padding (object-contain) showed a photo inside a frame.
        <img
          src={src}
          alt={alt || name}
          loading="lazy"
          onError={() => setFailedSrc(src)}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <div
          role="img"
          aria-label={`${name || "Vehicle"} – photo coming soon`}
          className="flex h-full w-full flex-col items-center justify-center px-6 text-center"
        >
          {/* Small vehicle-type label, then the model name, large and soft.
              `cqw` sizes the name relative to the card's width (the card is a
              @container), so it fits small cards and big gallery frames alike. */}
          <span aria-hidden="true" className="text-[10px] font-semibold uppercase tracking-[0.22em] text-forest-600/70">
            {isThreeWheeler ? "Electric 3-wheeler" : "Electric scooter"}
          </span>
          <span
            aria-hidden="true"
            className="mt-2 line-clamp-2 select-none text-balance font-display text-[clamp(2.25rem,13cqw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-forest-950/20"
          >
            {name}
          </span>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-forest-900/10 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-forest-600 backdrop-blur">
            Photo coming soon
          </span>
        </div>
      )}
    </div>
  );
}

export default VehicleImage;
