import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowRight, Leaf, MapPin, Zap } from "lucide-react";
import scooter from "../assets/scooter_transparent.png";

function Hero({ onNavigate }) {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <section
      id="home"
      className="relative -mt-[82px] min-h-[760px] overflow-hidden bg-[#073D34] pt-[82px] text-white lg:min-h-[min(900px,100svh)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-36 -top-40 h-[38rem] w-[38rem] rounded-full bg-[#1D725A]/30 blur-[100px]" />
        <div className="absolute -bottom-64 left-[28%] h-[34rem] w-[34rem] rounded-full bg-[#1C604D]/40 blur-[110px]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(3,36,31,0.45)_0%,transparent_62%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
      </div>

      <div className="relative mx-auto grid min-h-[678px] max-w-[1440px] items-center gap-0 px-6 pb-12 pt-12 sm:px-10 lg:min-h-[calc(min(900px,100svh)-82px)] lg:grid-cols-[0.88fr_1.12fr] lg:px-16 lg:pb-16 lg:pt-10 xl:px-24">
        <motion.div
          {...reveal}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 mx-auto w-full max-w-2xl text-center lg:mx-0 lg:text-left"
        >
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2.5 text-[10px] font-semibold tracking-[0.19em] text-[#C6E3D0] sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#9BE375] opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#9BE375]" />
            </span>
            INDIA&apos;S HOMEGROWN EV BRAND
          </div>

          <h1 className="text-[3.45rem] font-semibold leading-[0.98] tracking-[-0.065em] sm:text-7xl lg:text-[5.6rem] xl:text-[6.3rem]">
            A brighter way
            <span className="mt-2 block text-[#9BE375]">to move.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-[#D2E3DB]/80 sm:text-lg sm:leading-8 lg:mx-0">
            Meet the next generation of electric mobility. Made for India, and
            made for everything ahead.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <motion.button
              type="button"
              onClick={() => onNavigate("vehicles")}
              whileHover={reduceMotion ? undefined : { y: -3 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className="group flex items-center gap-3 rounded-full bg-[#A7E884] px-6 py-3.5 text-sm font-bold text-[#073D34] shadow-[0_12px_35px_rgba(0,0,0,0.15)] transition-colors hover:bg-[#B9F09B] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A7E884]"
            >
              Explore our vehicles
              <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
            </motion.button>
            <button
              type="button"
              onClick={() => onNavigate("twowheelers")}
              className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Discover 2-wheelers
              <ArrowDownRight size={16} />
            </button>
          </div>

          <div className="mx-auto mt-12 flex max-w-xl flex-wrap justify-center gap-x-7 gap-y-5 border-t border-white/15 pt-6 sm:gap-x-10 lg:mx-0 lg:justify-start">
            <Stat icon={<Leaf size={17} />} value="10,000+" label="Happy riders" />
            <Stat icon={<Zap size={17} />} value="100%" label="Electric" />
            <Stat icon={<MapPin size={17} />} value="10+" label="Cities reached" />
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.95, x: 24 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={reduceMotion ? { duration: 0.4 } : { duration: 0.85, ease: "easeOut", delay: 0.12 }}
          className="relative mx-auto mt-4 flex w-full max-w-3xl items-center justify-center lg:mt-0 lg:min-h-[600px]"
        >
          <div className="relative flex aspect-[1.16/1] w-full items-center justify-center sm:aspect-[1.28/1] lg:aspect-square">
            <div className="absolute h-[74%] w-[74%] rounded-full bg-[#BFE4C4] shadow-[0_0_100px_rgba(155,227,117,0.16)]" />
            <div className="absolute h-[84%] w-[84%] rounded-full border border-white/10" />
            <div className="absolute h-[64%] w-[64%] rounded-full border border-[#073D34]/10" />
            <div className="absolute bottom-[14%] left-[12%] right-[12%] h-[14%] rounded-[50%] bg-[#062E28]/20 blur-2xl" />
            <motion.img
              src={scooter}
              alt="White electric scooter with green accents"
              initial={reduceMotion ? false : { opacity: 0, x: 70, y: 8, rotate: 3 }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
              transition={reduceMotion ? { duration: 0.4 } : { type: "spring", stiffness: 55, damping: 17, delay: 0.15 }}
              className="relative z-10 w-[116%] max-w-none drop-shadow-[0_30px_30px_rgba(2,26,22,0.35)]"
            />

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.7 }}
              className="absolute right-0 top-[13%] z-20 flex items-center gap-2.5 rounded-2xl border border-white/60 bg-white px-3 py-2.5 text-[#123C32] shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:right-[2%] sm:px-4 sm:py-3"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F5E8] text-[#18745D]">
                <Zap size={17} fill="currentColor" />
              </span>
              <span>
                <span className="block text-xs font-bold">100% electric</span>
                <span className="mt-0.5 block text-[10px] text-[#687A72]">Ready for the everyday</span>
              </span>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.85 }}
              className="absolute bottom-[10%] left-0 z-20 rounded-2xl border border-white/15 bg-[#0D5144]/90 px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-md sm:bottom-[12%] sm:left-[2%]"
            >
              <p className="text-[9px] font-semibold tracking-[0.18em] text-[#BBD8CC]">BUILT FOR WHAT&apos;S NEXT</p>
              <p className="mt-1 text-sm font-semibold text-white">Move better. Breathe better.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="flex items-center gap-2.5 text-left">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#A7E884]">
        {icon}
      </div>
      <div>
        <p className="text-base font-bold leading-tight text-white sm:text-lg">{value}</p>
        <p className="mt-0.5 whitespace-nowrap text-[10px] text-[#C6D9D0]/75 sm:text-xs">{label}</p>
      </div>
    </div>
  );
}

export default Hero;
