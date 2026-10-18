import { AnimatePresence, motion } from "framer-motion";
import {
  Battery,
  Bike,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Gauge,
  Image as ImageIcon,
  Truck,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

function normalizedKey(key) {
  return key.toLocaleLowerCase().replace(/[^a-z0-9]/g, "");
}

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

export function VehicleColorSelector({
  colors,
  selectedColor,
  onSelect,
}) {
  if (!colors.length) return null;
  const selected = colors.find((color) => color.key === selectedColor);

  return (
    <section aria-label="Available colors">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold text-[#173c34]">Available colors</h2>
        {selected && (
          <p className="text-sm text-[#52635d]" aria-live="polite">
            {selected.name}
          </p>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
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
              className={`grid h-9 w-9 place-items-center rounded-full border bg-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#31705f] ${
                isSelected ? "border-[#173c34] ring-2 ring-[#173c34] ring-offset-2" : "border-[#d8ded9] hover:scale-105"
              }`}
            >
              <span
                aria-hidden="true"
                className="h-7 w-7 rounded-full border border-black/10"
                style={{ backgroundColor: swatchColor(color) }}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function VehicleGallery({ images, vehicleName, colorName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageStatus, setImageStatus] = useState({
    src: "",
    loaded: false,
    failed: false,
  });
  const [isPaused, setIsPaused] = useState(false);
  const activeImage = images[activeIndex];
  const loaded = activeImage?.src === imageStatus.src && imageStatus.loaded;
  const failed = activeImage?.src === imageStatus.src && imageStatus.failed;

  useEffect(() => {
    if (images.length < 2 || isPaused) return undefined;
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, 4500);
    return () => window.clearInterval(interval);
  }, [images.length, isPaused]);

  const move = (offset) => {
    setActiveIndex((index) => (index + offset + images.length) % images.length);
  };
  const [touchStart, setTouchStart] = useState(null);

  return (
    <div className="min-w-0">
      <div
        className="group relative flex aspect-[4/3] min-h-[280px] items-center justify-center overflow-hidden rounded-[28px] border border-[#e1e7e2] bg-[#eef2ee] sm:aspect-[5/4] sm:min-h-[380px] lg:min-h-[500px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsPaused(false);
          }
        }}
        onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
        onTouchEnd={(event) => {
          if (touchStart === null) return;
          const delta = event.changedTouches[0].clientX - touchStart;
          if (Math.abs(delta) > 45 && images.length > 1) move(delta < 0 ? 1 : -1);
          setTouchStart(null);
        }}
      >
        {activeImage && !failed ? (
          <>
            {!loaded && (
              <div
                aria-hidden="true"
                className="absolute inset-0 animate-pulse bg-[#e7ece8]"
              />
            )}
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage.src}
                src={activeImage.src}
                alt={
                  activeImage.alt ||
                  `${vehicleName}${colorName ? ` in ${colorName}` : ""}`
                }
                onLoad={() =>
                  setImageStatus({
                    src: activeImage.src,
                    loaded: true,
                    failed: false,
                  })
                }
                onError={() =>
                  setImageStatus({
                    src: activeImage.src,
                    loaded: false,
                    failed: true,
                  })
                }
                initial={{ opacity: 0.5, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.5 }}
                transition={{ duration: 0.22 }}
                className="relative h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.015] sm:p-8"
              />
            </AnimatePresence>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 text-center text-[#7b857f]">
            <ImageIcon aria-hidden="true" size={32} strokeWidth={1.4} />
            <p className="text-sm">
              {failed ? "This vehicle image is unavailable." : "No vehicle image available"}
            </p>
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous vehicle image"
              onClick={() => move(-1)}
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/90 text-[#173c34] shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#31705f] sm:left-5 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Next vehicle image"
              onClick={() => move(1)}
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/90 text-[#173c34] shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#31705f] sm:right-5 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {activeImage && images.length > 0 && (
          <span
            aria-live="polite"
            aria-atomic="true"
            className="absolute bottom-4 right-4 rounded-full bg-[#173c34]/90 px-3 py-1.5 text-xs font-medium text-white"
          >
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div
          aria-label="Choose a vehicle image"
          className="mt-4 flex gap-3 overflow-x-auto pb-2"
        >
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
              className={`h-[74px] w-[96px] shrink-0 overflow-hidden rounded-xl border bg-[#eef2ee] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#31705f] ${
                index === activeIndex
                  ? "border-[#173c34] ring-1 ring-[#173c34]"
                  : "border-[#e1e7e2] opacity-75 hover:opacity-100"
              }`}
            >
              <img
                src={image.src}
                alt=""
                loading="lazy"
                className="h-full w-full object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const specificationIcons = [
  { fields: ["range", "driving range", "range per charge"], icon: Gauge },
  { fields: ["power", "rated power", "motor power"], icon: Zap },
  { fields: ["battery capacity", "battery"], icon: Battery },
  { fields: ["maximum speed", "max speed", "top speed"], icon: Gauge },
  { fields: ["charging time", "charge time"], icon: Clock3 },
];

export function VehicleSpecifications({ items, compact = false }) {
  return (
    <div className={compact ? "grid grid-cols-2 gap-3" : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"}>
      {items.map((item) => {
        const Icon =
          specificationIcons.find(({ fields }) =>
            fields.some((field) => normalizedKey(field) === normalizedKey(item.label)),
          )?.icon || (item.label.toLocaleLowerCase().includes("payload") ? Truck : Bike);
        return (
          <article
            key={item.label}
            className={`rounded-2xl border border-[#e1e7e2] bg-white ${
              compact ? "p-4" : "p-5 sm:p-6"
            }`}
          >
            <div className="flex items-center gap-2 text-[#547064]">
              <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                {item.label}
              </p>
            </div>
            <p className={`mt-3 font-semibold tracking-tight text-[#173c34] ${compact ? "text-base" : "text-xl"}`}>
              {item.value}
            </p>
          </article>
        );
      })}
    </div>
  );
}
