import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroImage from "../assets/hero-family-scooter.webp";
import Button from "./ui/Button";

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
            className="mt-5 font-display text-[2.9rem] font-semibold leading-[0.98] tracking-[-0.055em] text-forest-950 sm:text-6xl lg:text-[clamp(3rem,4.6vw,5.25rem)]"
          >
            A brighter way
            <span className="block text-muted/70">to move.</span>
          </motion.h1>

          <motion.p {...enter(0.16)} className="mt-6 max-w-sm text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Electric scooters and three-wheelers made for Indian families and businesses.
            Quiet, clean and simple to own.
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
                <dd className="font-display text-xl font-semibold tracking-tight text-forest-950 sm:text-2xl">{value}</dd>
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

export default Hero;
