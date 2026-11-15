import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BatteryCharging, Leaf, MapPin, Zap } from "lucide-react";
import scooter from "../assets/scooter_transparent.png";
import Button from "./ui/Button";
import Container from "./ui/Container";

const stats = [
  { icon: Leaf, value: "10,000+", label: "Happy riders" },
  { icon: Zap, value: "100%", label: "Electric" },
  { icon: MapPin, value: "10+", label: "Cities reached" },
];

function Hero() {
  const reduceMotion = useReducedMotion();
  // One helper for the "fade up" entrance, with a delay per item so the
  // headline, text and buttons appear one after another (a "stagger").
  const enter = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
        };

  return (
    <section
      id="home"
      // The negative top margin pulls the dark hero UP behind the floating
      // navbar, and the padding pushes the content back down. Result: the
      // navbar floats over the dark background instead of over a pale strip.
      className="relative isolate -mt-19 overflow-hidden bg-forest-900 pt-19 text-white sm:-mt-20 sm:pt-20"
    >
      {/* Decorative background layers. aria-hidden = screen readers skip them. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid-dark absolute inset-0" />
        <div className="absolute -right-32 top-0 h-[36rem] w-[36rem] rounded-full bg-forest-600/40 blur-[120px]" />
        <div className="absolute -bottom-48 left-[10%] h-[28rem] w-[28rem] rounded-full bg-volt/10 blur-[120px]" />
      </div>

      <Container className="grid items-center gap-6 pb-14 pt-12 sm:pt-16 lg:min-h-[min(860px,calc(100svh-5rem))] lg:grid-cols-[1fr_1.05fr] lg:gap-4 lg:pb-20 lg:pt-10">
        <div className="relative z-10 text-center lg:text-left">
          <motion.p
            {...enter(0)}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-sage-300 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-volt opacity-50 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-volt" />
            </span>
            India&apos;s homegrown EV brand
          </motion.p>

          <motion.h1
            {...enter(0.08)}
            className="mt-7 font-display text-[3.1rem] font-extrabold leading-[0.95] tracking-[-0.055em] sm:text-7xl lg:text-[5.4rem] xl:text-[6rem]"
          >
            A brighter way
            <span className="block bg-gradient-to-r from-volt via-volt-soft to-sage-300 bg-clip-text pb-2 text-transparent">
              to move.
            </span>
          </motion.h1>

          <motion.p
            {...enter(0.16)}
            className="mx-auto mt-5 max-w-md text-base leading-7 text-white/65 sm:text-lg sm:leading-8 lg:mx-0"
          >
            Electric scooters and three-wheelers made for Indian roads. Lower running costs,
            zero tailpipe emissions, and service you can count on.
          </motion.p>

          <motion.div {...enter(0.24)} className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Button to="/twowheelers" size="lg">
              Explore 2-wheelers
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Button>
            <Button to="/vehicles" variant="ghost" size="lg">
              View 3-wheelers
            </Button>
          </motion.div>

          <motion.dl
            {...enter(0.32)}
            className="mx-auto mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-7 lg:mx-0"
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center lg:text-left">
                <dt className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-white/50 lg:justify-start">
                  <Icon size={13} className="text-volt" aria-hidden="true" />
                  {label}
                </dt>
                <dd className="mt-1.5 font-display text-2xl font-bold tracking-tight sm:text-3xl">{value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Right side: the scooter on a glowing disc with two floating cards. */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative mx-auto aspect-square w-full max-w-[34rem] lg:max-w-none"
        >
          <div aria-hidden="true" className="absolute inset-[9%] rounded-full bg-[radial-gradient(circle_at_50%_40%,var(--color-volt-soft),var(--color-sage-300)_55%,var(--color-forest-600)_100%)] opacity-90" />
          <div aria-hidden="true" className="absolute inset-[3%] rounded-full border border-white/10" />
          <div aria-hidden="true" className="absolute inset-[17%] rounded-full border border-forest-900/15" />
          <div aria-hidden="true" className="absolute bottom-[16%] left-[18%] right-[14%] h-[9%] rounded-[50%] bg-forest-950/40 blur-2xl" />

          {/* The source image has empty space on its left, so we shift it left to centre the scooter. */}
          <motion.img
            src={scooter}
            alt="White Eko Tejas electric scooter with green accents"
            initial={reduceMotion ? false : { opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 60, damping: 18, delay: 0.2 }}
            className="absolute left-[-24%] top-[2%] w-[128%] max-w-none drop-shadow-[0_30px_30px_rgb(8_32_27/0.45)]"
          />

          <FloatingCard
            delay={0.75}
            className="right-0 top-[10%] sm:right-[2%]"
            icon={<BatteryCharging size={18} />}
            title="100% electric"
            text="Ready for the everyday"
          />
          <FloatingCard
            delay={0.9}
            className="bottom-[8%] left-0 sm:left-[2%]"
            icon={<Zap size={18} fill="currentColor" />}
            title="Move better."
            text="Breathe better."
            dark
          />
        </motion.div>
      </Container>
    </section>
  );
}

function FloatingCard({ icon, title, text, className, delay, dark = false }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: reduceMotion ? 0 : delay }}
      className={`absolute z-10 flex items-center gap-3 rounded-2xl border px-3.5 py-3 shadow-lift backdrop-blur-md ${
        dark ? "border-white/15 bg-forest-900/80 text-white" : "border-white/70 bg-white/90 text-forest-900"
      } ${className}`}
    >
      <span
        className={`grid h-10 w-10 place-items-center rounded-xl ${
          dark ? "bg-volt text-forest-950" : "bg-mint-100 text-forest-600"
        }`}
      >
        {icon}
      </span>
      <span className="text-left">
        <span className="block text-sm font-bold leading-tight">{title}</span>
        <span className={`mt-0.5 block text-xs ${dark ? "text-white/60" : "text-muted"}`}>{text}</span>
      </span>
    </motion.div>
  );
}

export default Hero;
