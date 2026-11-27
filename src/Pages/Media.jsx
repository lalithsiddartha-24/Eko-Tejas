import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Expand, Mail, X } from "lucide-react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import logo from "../assets/Group-1941.webp";
import familyImage from "../assets/hero-family-scooter.webp";
import bananaImage from "../assets/three-wheeler-banana-market.webp";
import eRickshawImage from "../assets/three-wheeler-e-rickshaw.webp";
import skyscrapersImage from "../assets/two-wheeler-skyscrapers.webp";
import trafficImage from "../assets/two-wheeler-traffic.webp";
import axelRearImage from "../assets/vehicle-gallery/axel-rear.webp";
import axelSideImage from "../assets/vehicle-gallery/axel-side.webp";
import PageMeta from "../Components/PageMeta";
import Container from "../Components/ui/Container";
import PageIntro from "../Components/ui/PageIntro";
import Reveal from "../Components/ui/Reveal";
import SectionHeading from "../Components/ui/SectionHeading";
import { mediaEmail } from "../data/company";

/*
 * MEDIA PAGE
 * A photo gallery (click a photo to see it large) and a press section with
 * the media email and downloadable brand assets.
 * To add a photo: put it in src/assets, import it above, and add a line to
 * `photos`. `wide: true` makes it span two columns on bigger screens.
 */
// ORDER MATTERS for the grid (3 columns on desktop, "wide" = 2 columns).
// This order fills it with no gaps: [wide, 1] / [1, 1, 1] / [wide, 1].
const photos = [
  { src: familyImage, alt: "A father and daughter with a white Eko Tejas electric scooter", caption: "Made for families", wide: true },
  { src: skyscrapersImage, alt: "A green Eko Tejas scooter parked between glass towers", caption: "City-ready scooters" },
  { src: eRickshawImage, alt: "A smiling driver in a green electric e-rickshaw in city traffic", caption: "Passenger e-rickshaw" },
  { src: trafficImage, alt: "A rider on a green electric scooter weaving through heavy traffic", caption: "Through the traffic" },
  { src: axelSideImage, alt: "Side view of the white Axel electric scooter", caption: "Axel, side view" },
  { src: bananaImage, alt: "An electric cargo three-wheeler loaded with bananas at a market", caption: "Built for business", wide: true },
  { src: axelRearImage, alt: "Rear view of the white Axel electric scooter", caption: "Axel, rear view" },
];

const assets = [
  { href: logo, file: "eko-tejas-logo.webp", title: "Logo", text: "The Eko Tejas shield logo (WEBP)" },
  { href: "/og-image.jpg", file: "eko-tejas-brand-photo.jpg", title: "Brand photo", text: "Family and scooter, 1200 × 630 (JPG)" },
];

function Media() {
  // Which photo is open in the large viewer (null = closed).
  const [openIndex, setOpenIndex] = useState(null);
  // Remember which thumbnail opened the viewer, to put keyboard focus back on it after closing.
  const lastTrigger = useRef(null);

  const open = (index, event) => {
    lastTrigger.current = event.currentTarget;
    setOpenIndex(index);
  };
  const close = () => {
    setOpenIndex(null);
    lastTrigger.current?.focus();
  };

  return (
    <main>
      <PageMeta title="Media" />
      <PageIntro
        eyebrow="Media"
        title="Eko Tejas"
        accent="in pictures."
        description="Our scooters and three-wheelers out on Indian roads. Tap any photo to see it larger. For press and partnership enquiries, see the details below."
      />

      {/* ---------- Gallery ---------- */}
      <section aria-label="Photo gallery" className="bg-mint-50 pb-20 sm:pb-28">
        <Container>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo, index) => (
              <li key={photo.src} className={photo.wide ? "sm:col-span-2" : ""}>
                <Reveal className="h-full">
                  <button
                    type="button"
                    onClick={(event) => open(index, event)}
                    aria-label={`View larger: ${photo.caption}`}
                    className="group relative block h-full w-full overflow-hidden rounded-3xl bg-white text-left shadow-soft focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest-600"
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none sm:aspect-auto sm:min-h-64"
                    />
                    <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[linear-gradient(0deg,rgb(6_8_7/0.7),transparent)] px-5 pb-4 pt-10 text-sm font-semibold text-white">
                      {photo.caption}
                      <Expand size={16} aria-hidden="true" className="opacity-70 transition-opacity group-hover:opacity-100" />
                    </span>
                  </button>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------- Press & brand assets ---------- */}
      <section className="py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Press"
              title="Writing about"
              accent="Eko Tejas?"
              description="For interviews, photos, or a story about electric mobility in your town, write to us and our team will get back to you."
            />
            <a
              href={`mailto:${mediaEmail}`}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-forest-950 px-6 py-3.5 font-semibold text-white transition-colors hover:bg-forest-700"
            >
              <Mail size={18} aria-hidden="true" /> {mediaEmail}
            </a>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-600">Brand assets</h2>
            <ul className="mt-5 space-y-3">
              {assets.map((asset) => (
                <li key={asset.title}>
                  {/* `download` tells the browser to save the file instead of opening it. */}
                  <a
                    href={asset.href}
                    download={asset.file}
                    className="group flex items-center gap-4 rounded-2xl border border-forest-900/8 bg-white p-5 transition hover:border-forest-900/20 hover:shadow-soft"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-mint-100 text-forest-700 transition-colors group-hover:bg-forest-950 group-hover:text-white">
                      <Download size={19} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block font-display font-semibold text-forest-950">{asset.title}</span>
                      <span className="block text-sm text-muted">{asset.text}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox photos={photos} index={openIndex} onChange={setOpenIndex} onClose={close} />
        )}
      </AnimatePresence>
    </main>
  );
}

/**
 * The large photo viewer ("lightbox").
 * - Esc closes it; Left / Right arrow keys move between photos.
 * - While it's open, the page behind it can't scroll.
 * - role="dialog" + aria-modal tell screen readers this is a pop-up window,
 *   and the close button gets focus first so keyboard users can leave easily.
 */
function Lightbox({ photos, index, onChange, onClose }) {
  const reduceMotion = useReducedMotion();
  const photo = photos[index];
  const step = (offset) => onChange((index + offset + photos.length) % photos.length);

  // useEffectEvent (React 19.2): a function the effect below can call that
  // always sees the LATEST onClose / onChange, without listing them as effect
  // dependencies. So the keyboard listener is added once when the viewer
  // opens and removed once when it closes, not on every re-render.
  const onKey = useEffectEvent((event) => {
    if (event.key === "Escape") onClose();
    if (event.key === "ArrowRight") onChange((current) => (current + 1) % photos.length);
    if (event.key === "ArrowLeft") onChange((current) => (current - 1 + photos.length) % photos.length);
  });

  useEffect(() => {
    const handleKey = (event) => onKey(event);
    window.addEventListener("keydown", handleKey);
    // Stop the page behind from scrolling; put it back when the viewer closes.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}: ${photo.caption}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
      // Clicking the dark background (not the photo or buttons) closes it.
      onClick={(event) => event.target === event.currentTarget && onClose()}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-10"
    >
      <button
        type="button"
        autoFocus
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <X size={22} />
      </button>

      <img
        key={photo.src}
        src={photo.src}
        alt={photo.alt}
        className="max-h-[78vh] w-auto max-w-full rounded-2xl object-contain"
      />
      <p className="mt-4 text-sm text-white/80" aria-live="polite">
        {photo.caption} <span className="text-white/45">· {index + 1} / {photos.length}</span>
      </p>

      <button
        type="button"
        onClick={() => step(-1)}
        aria-label="Previous photo"
        className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        type="button"
        onClick={() => step(1)}
        aria-label="Next photo"
        className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
      >
        <ChevronRight size={24} />
      </button>
    </motion.div>
  );
}

export default Media;
