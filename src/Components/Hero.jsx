import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import heroImage from "../assets/hero-family-scooter.webp";
import Button from "./ui/Button";
import CountUp from "./ui/CountUp";

// The words that flip in "It's ___." Order matters: the first one shows on page load.
const attributes = ["available", "reliable", "affordable", "silent", "clean"];

const stats = [
  { value: "10,000+", label: "Happy riders" },
  { value: "100%", label: "Electric" },
  { value: "10+", label: "Cities" },
];

/**
 * Full-bleed photo hero.
 *
 * HOW the layout works:
 *   - Desktop (lg and up): the section is the SAME shape as the photo
 *     (height = 56.28% of the width, i.e. 941 ÷ 1672, never less than 600px), so the
 *     whole photo fits and nobody's head or the scooter gets cut off.
 *     The photo's left ~38% is empty
 *     white, so the text column is limited to about a third of the width
 *     (`lg:max-w-[33vw]`) and can never run into the scooter.
 *   - Phones/tablets: there isn't room for text beside the people, so the
 *     text comes first and the photo sits underneath, cropped from the
 *     right (`object-right`) so the scooter and family stay in view.
 * The photo's background is white fading to pale mint, so the section uses
 * the same gradient and the edges blend in with no visible seam.
 */
function Hero() {
  const reduceMotion = useReducedMotion();
  const enter = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
        };

  return (
    <section
      id="home"
      // The hero starts BELOW the navbar (no negative margin), so the bar
      // never covers the photo. The photo's top edge is pure white, like the
      // page, so there is no visible line where the navbar area ends.
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_55%,#eef6f1_100%)] lg:flex lg:h-[max(600px,56.28vw)] lg:items-center"
    >
      <div className="relative z-10 px-5 pt-8 sm:px-8 sm:pt-12 lg:px-[5vw] lg:pt-0">
        <div className="max-w-xl lg:max-w-[33vw] xl:max-w-[30rem]">
          <motion.p
            {...enter(0)}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted"
          >
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />
            India&apos;s homegrown EV brand
          </motion.p>

          <motion.h1
            {...enter(0.08)}
            className="mt-5 font-display text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.055em] text-forest-950 sm:text-6xl lg:text-[clamp(2.75rem,4.1vw,4.75rem)]"
          >
            {/* Screen readers get the whole sentence once, instead of hearing a word change every 2 seconds. */}
            <span className="sr-only">Electric is the future, and it&apos;s {attributes.join(", ")}.</span>
            <span aria-hidden="true">
              Electric is the future.
              <span className="mt-1 block text-muted/70">
                It&apos;s <FlipWord words={attributes} />
              </span>
            </span>
          </motion.h1>

          <motion.p {...enter(0.16)} className="mt-6 max-w-sm text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Electric scooters and three-wheelers made for Indian families and businesses,
            with service close to home.
          </motion.p>

          <motion.div {...enter(0.24)} className="mt-8 flex flex-wrap items-center gap-3">
            <Button to="/twowheelers" size="lg">
              Explore scooters
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Button>
            <Button to="/vehicles" variant="outline" size="lg">
              3-wheelers
            </Button>
          </motion.div>

          <motion.dl {...enter(0.32)} className="mt-10 flex gap-8 sm:gap-10">
            {stats.map(({ value, label }) => (
              // In a <dl> the label (dt) must come first; flex-col-reverse shows the number on top.
              <div key={label} className="flex flex-col-reverse">
                <dt className="mt-0.5 text-xs text-muted">{label}</dt>
                <dd className="font-display text-xl font-semibold tracking-tight text-forest-950 sm:text-2xl">
                  <CountUp value={value} duration={2} />
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>

      <motion.img
        src={heroImage}
        alt="A smiling father and daughter with a white Eko Tejas electric scooter"
        width={1672}
        height={941}
        // fetchPriority="high": this is the first big image people see, so
        // the browser should download it before anything else.
        fetchPriority="high"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative -z-10 mt-4 aspect-[4/3] w-full object-cover object-right sm:aspect-[16/10] lg:absolute lg:inset-0 lg:mt-0 lg:aspect-auto lg:h-full lg:object-cover lg:object-right"
      />
    </section>
  );
}

/**
 * A word that flips like a split-flap departure board every 2.4 seconds.
 *
 * HOW the flip works:
 *   - `AnimatePresence` lets the OLD word play an exit animation before
 *     React removes it. Changing the `key` tells React "this is a new word".
 *   - The new word starts rotated 90° on the X axis (lying flat, edge-on,
 *     so it's invisible) and rotates to 0° (facing you). The old word
 *     rotates the other way to -90°. `perspective` on the parent gives the
 *     rotation real 3D depth instead of looking like a squash.
 *   - Both words sit in the SAME grid cell (`col-start-1 row-start-1`), so
 *     they overlap during the flip instead of pushing each other around.
 * Reduce motion: the words just cross-fade, with no rotation.
 */
function FlipWord({ words }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % words.length), 2400);
    return () => window.clearInterval(timer);
  }, [words.length]);

  const flip = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { rotateX: 90, opacity: 0 },
        animate: { rotateX: 0, opacity: 1 },
        exit: { rotateX: -90, opacity: 0 },
      };

  return (
    <span className="inline-grid align-bottom [perspective:700px]">
      <AnimatePresence initial={false}>
        <motion.span
          key={words[index]}
          {...flip}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          // The mint "marker" background flips together with the word, like a card.
          className="col-start-1 row-start-1 justify-self-start whitespace-nowrap rounded-xl bg-volt px-2 text-forest-950 [backface-visibility:hidden] [transform-origin:50%_50%_-0.4em]"
        >
          {words[index]}.
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default Hero;
