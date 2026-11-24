import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Battery, Bike, ChevronLeft, ChevronRight, Clock3, Gauge, Truck, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { normalizedKey } from "../utils/vehicleFormat";
import CountUp from "./ui/CountUp";
import VehicleImage from "./ui/VehicleImage";

const commonSwatches = {
  black: "#202522",
  white: "#f8f8f5",
  red: "#b7443f",
  blue: "#48749a",
  green: "#4b735b",
  grey: "#929795",
  gray: "#929795",
  silver: "#c2c7c5",
  yellow: "#d9b84b",
  orange: "#d8793e",
  brown: "#795b45",
  purple: "#826292",
};

function swatchColor(color) {
  if (/^#[0-9a-f]{3,8}$/i.test(color.swatch)) return color.swatch;
  if (/^(rgb|hsl)a?\(/i.test(color.swatch)) return color.swatch;
  if (typeof CSS !== "undefined" && CSS.supports("color", color.swatch)) {
    return color.swatch;
  }
  return commonSwatches[color.name.toLocaleLowerCase()] || color.name;
}

export function VehicleColorSelector({ colors, selectedColor, onSelect }) {
  if (!colors.length) return null;
  const selected = colors.find((color) => color.key === selectedColor);

  return (
    <section aria-label="Available colours">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Colour</h2>
        {selected && (
          <p className="text-sm font-semibold text-forest-900" aria-live="polite">
            {selected.name}
          </p>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2.5">
        {colors.map((color) => {
          const isSelected = color.key === selectedColor;
          return (
            <button
              key={color.key}
              type="button"
              aria-label={`Select ${color.name}`}
              aria-pressed={isSelected}
              title={color.name}
              onClick={() => onSelect(color.key)}
              className={`grid h-10 w-10 place-items-center rounded-full border-2 bg-white transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600 ${
                isSelected ? "border-forest-900" : "border-transparent hover:border-forest-900/25"
              }`}
            >
              <span
                aria-hidden="true"
                className="h-7 w-7 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)]"
                style={{ backgroundColor: swatchColor(color) }}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Photo carousel for the vehicle page.
 * - Auto-advances every 4.5s, but pauses on hover/focus so it never moves
 *   while someone is looking closely (and never when "reduce motion" is on).
 * - Swipe left/right on phones.
 * - With no photos (or a broken one) it shows the same designed placeholder
 *   as the vehicle cards.
 */
export function VehicleGallery({ images, vehicleName, colorName, isThreeWheeler = false }) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageStatus, setImageStatus] = useState({ src: "", loaded: false, failed: false });
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const activeImage = images[activeIndex];
  const loaded = activeImage?.src === imageStatus.src && imageStatus.loaded;
  const failed = activeImage?.src === imageStatus.src && imageStatus.failed;

  useEffect(() => {
    if (images.length < 2 || isPaused || reduceMotion) return undefined;
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, 4500);
    return () => window.clearInterval(interval);
  }, [images.length, isPaused, reduceMotion]);

  const move = (offset) => {
    setActiveIndex((index) => (index + offset + images.length) % images.length);
  };

  const frame =
    "group relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-forest-900/8 shadow-soft sm:aspect-[5/4] lg:aspect-[4/3.4]";

  if (!activeImage || failed) {
    return (
      <div className="min-w-0">
        <VehicleImage src={null} name={vehicleName} isThreeWheeler={isThreeWheeler} className={frame} />
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <div
        className={`${frame} bg-[radial-gradient(120%_90%_at_50%_0%,#ffffff_0%,var(--color-mint-100)_55%,var(--color-mint-200)_100%)]`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
        }}
        onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
        onTouchEnd={(event) => {
          if (touchStart === null) return;
          const delta = event.changedTouches[0].clientX - touchStart;
          if (Math.abs(delta) > 45 && images.length > 1) move(delta < 0 ? 1 : -1);
          setTouchStart(null);
        }}
      >
        {!loaded && <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-mint-100" />}
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage.src}
            src={activeImage.src}
            alt={activeImage.alt || `${vehicleName}${colorName ? ` in ${colorName}` : ""}`}
            onLoad={() => setImageStatus({ src: activeImage.src, loaded: true, failed: false })}
            onError={() => setImageStatus({ src: activeImage.src, loaded: false, failed: true })}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            // Studio photos have their own background, so they fill the frame.
            className="relative h-full w-full object-cover"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <GalleryArrow side="left" onClick={() => move(-1)} />
            <GalleryArrow side="right" onClick={() => move(1)} />
            {/* Dots show position; the counter is read out to screen readers. */}
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5" aria-hidden="true">
              {images.map((image, index) => (
                <span
                  key={`${image.src}-dot-${index}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === activeIndex ? "w-6 bg-forest-900" : "w-1.5 bg-forest-900/25"
                  }`}
                />
              ))}
            </div>
            <span className="sr-only" aria-live="polite">
              Image {activeIndex + 1} of {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div aria-label="Choose a vehicle image" className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={`h-[72px] w-[92px] shrink-0 overflow-hidden rounded-2xl border-2 bg-mint-100 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600 ${
                index === activeIndex ? "border-forest-900" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={image.src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryArrow({ side, onClick }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Previous vehicle image" : "Next vehicle image"}
      onClick={onClick}
      className={`absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-forest-900 shadow-soft backdrop-blur transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100 ${
        side === "left" ? "left-3 sm:left-5" : "right-3 sm:right-5"
      }`}
    >
      <Icon size={20} />
    </button>
  );
}

const specificationIcons = [
  { fields: ["range", "driving range", "range per charge"], icon: Gauge },
  { fields: ["power", "rated power", "motor power"], icon: Zap },
  { fields: ["battery capacity", "battery"], icon: Battery },
  { fields: ["maximum speed", "max speed", "top speed"], icon: Gauge },
  { fields: ["charging time", "charge time"], icon: Clock3 },
];

function iconFor(label) {
  return (
    specificationIcons.find(({ fields }) => fields.some((field) => normalizedKey(field) === normalizedKey(label)))?.icon ||
    (label.toLocaleLowerCase().includes("payload") ? Truck : Bike)
  );
}

/**
 * Full specification list, laid out like a printed spec sheet:
 * label on the left, value on the right, thin lines between rows.
 * WHY a <dl> (description list): it's the HTML element made for
 * "name: value" pairs, so screen readers announce them as pairs.
 */
export function VehicleSpecifications({ items }) {
  return (
    <dl className="grid gap-x-12 sm:grid-cols-2">
      {items.map((item) => {
        const Icon = iconFor(item.label);
        return (
          <div key={item.label} className="flex items-center justify-between gap-6 border-b border-forest-900/8 py-4">
            <dt className="flex items-center gap-3 text-sm text-muted">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-mint-100 text-forest-600">
                <Icon aria-hidden="true" size={15} strokeWidth={1.9} />
              </span>
              {item.label}
            </dt>
            <dd className="text-right font-display font-bold text-forest-900">{item.value}</dd>
          </div>
        );
      })}
    </dl>
  );
}

/** Big headline numbers (range, power...) for the overview band on the vehicle page. */
const desktopColumns = ["", "md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3", "md:grid-cols-4"];

export function VehicleKeySpecs({ items }) {
  const shown = items.slice(0, 4);
  return (
    // gap-px over a lighter background draws hairline dividers between cells.
    <dl className={`grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-mint-200 bg-mint-200 ${desktopColumns[shown.length]}`}>
      {shown.map((item) => {
        const Icon = iconFor(item.label);
        return (
          // An odd last item stretches across both columns on phones (no empty gap).
          <div key={item.label} className="bg-white p-5 last:odd:col-span-2 sm:p-7 md:last:odd:col-span-1">
            <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              <Icon size={14} className="text-forest-600" aria-hidden="true" />
              {item.label}
            </dt>
            <dd className="mt-2 font-display text-2xl font-semibold tracking-tight text-forest-950 sm:text-4xl">
              {/* Rolls up like an odometer ("0 km" → "120 km") when the band scrolls into view. */}
              <CountUp value={item.value} duration={1.8} />
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
