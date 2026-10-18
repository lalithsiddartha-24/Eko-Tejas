import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import logo from "../assets/Group-1941.webp";

function Navbar({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const handleNavigate = (page) => {
    setMenuOpen(false);
    onNavigate(page);
  };

  const desktopLinks = [
    { label: "Home", page: "home" },
    { label: "2-Wheelers", page: "twowheelers", hasChevron: true },
    { label: "3-Wheelers", page: "vehicles", hasChevron: true },
    { label: "Media", page: "home" },
  ];

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full px-4 pt-3 md:px-8"
    >
      <div className="relative mx-auto flex h-[70px] max-w-7xl items-center justify-between rounded-2xl border border-[#0B4B40]/10 bg-white/95 px-4 shadow-[0_8px_30px_rgba(11,75,64,0.08)] backdrop-blur-md md:px-7">
        <button
          type="button"
          onClick={() => handleNavigate("home")}
          aria-label="Eko Tejas home"
          className="flex shrink-0 items-center rounded-xl transition hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#31705F]"
        >
          <img src={logo} alt="Eko Tejas" className="h-11 w-auto object-contain" />
        </button>

        <div className="hidden items-center rounded-full bg-[#F3F7F4] p-1 lg:flex">
          {desktopLinks.map((link) => {
            const isActive =
              (link.page === "home" && pathname === "/" && link.label === "Home") ||
              (link.page !== "home" &&
                pathname === `/${link.page}`);

            return (
              <motion.button
                key={link.label}
                type="button"
                onClick={() => handleNavigate(link.page)}
                whileTap={{ scale: 0.97 }}
                className={[
                  "relative flex items-center gap-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#31705F]",
                  isActive
                    ? "bg-white text-[#0B4B40] shadow-sm"
                    : "text-[#52635D] hover:text-[#0B4B40]",
                ].join(" ")}
              >
                {link.label}
                {link.hasChevron && <ChevronDown size={14} />}
                {!isActive && (
                  <motion.span
                    className="absolute inset-0 -z-10 rounded-full bg-white"
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.18 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="hidden items-center gap-2 rounded-full bg-[#073D34] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0E5A4D] hover:shadow-md sm:flex"
          >
            Become a Dealer
            <ArrowUpRight size={17} />
          </motion.button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F3F7F4] text-[#0B4B40] transition-colors hover:bg-[#E7F0E9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#31705F] lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                transition={{ duration: 0.16 }}
                className="flex"
              >
                {menuOpen ? <X size={23} /> : <Menu size={23} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -8 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: "easeInOut" }}
              className="absolute left-0 right-0 top-[calc(100%+0.5rem)] overflow-hidden rounded-2xl border border-[#0B4B40]/10 bg-white shadow-[0_12px_32px_rgba(11,75,64,0.12)] lg:hidden"
            >
              <div className="flex flex-col gap-1 p-3">
                {[
                  { label: "Home", page: "home" },
                  { label: "2-Wheelers", page: "twowheelers" },
                  { label: "3-Wheelers", page: "vehicles" },
                ].map((link, index) => (
                  <motion.button
                    key={link.label}
                    type="button"
                    initial={{ x: -12, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNavigate(link.page)}
                    className="rounded-xl px-4 py-3 text-left font-medium text-[#52635D] transition-colors hover:bg-[#F3F7F4] hover:text-[#0B4B40]"
                  >
                    {link.label}
                  </motion.button>
                ))}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#073D34] px-5 py-3 text-sm font-semibold text-white"
                >
                  Become a Dealer
                  <ArrowUpRight size={17} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

export default Navbar;
