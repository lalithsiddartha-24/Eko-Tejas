import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/Group-1941.webp";
import Button from "./ui/Button";

/*
 * WHY <NavLink> instead of buttons with onClick + navigate():
 * links are real <a> tags, so people can right-click "open in new tab",
 * search engines can follow them, and NavLink tells us which one is active.
 */
const links = [
  { label: "Home", to: "/", end: true },
  { label: "2-Wheelers", to: "/twowheelers" },
  { label: "3-Wheelers", to: "/vehicles" },
  { label: "Service", to: "/#service" },
  { label: "Contact", to: "/#contact" },
];

function Navbar() {
  const [openPath, setOpenPath] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();
  const reduceMotion = useReducedMotion();

  // The mobile menu is "open" only for the page it was opened on, so moving
  // to a new page closes it automatically (no extra effect needed).
  const menuOpen = openPath === pathname + hash;
  const toggleMenu = () => setOpenPath(menuOpen ? null : pathname + hash);
  const closeMenu = () => setOpenPath(null);

  // Add a stronger shadow once the page is scrolled, so the bar "lifts".
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hash links ("/#contact") shouldn't look "active" like a page link.
  const isActive = (link, active) => (link.to.includes("#") ? `/${hash}` === link.to && pathname === "/" : active);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <nav
        aria-label="Main"
        className={`relative mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border bg-white/90 pl-3 pr-2 backdrop-blur-xl transition-shadow duration-300 sm:h-[4.25rem] sm:pl-4 ${
          scrolled ? "border-forest-900/10 shadow-lift" : "border-white/60 shadow-soft"
        }`}
      >
        <Link
          to="/"
          aria-label="Eko Tejas home"
          className="flex items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest-600"
        >
          <img src={logo} alt="" className="h-10 w-auto object-contain sm:h-11" />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive: active }) =>
                  `relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive(link, active)
                      ? "bg-forest-900 text-white"
                      : "text-muted hover:bg-mint-100 hover:text-forest-900"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button
            to="/#contact"
            state={{ enquiryType: "dealership" }}
            variant="dark"
            className="hidden sm:inline-flex"
          >
            Become a dealer
            <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Button>

          <button
            type="button"
            onClick={toggleMenu}
            className="grid h-11 w-11 place-items-center rounded-xl bg-mint-100 text-forest-900 transition-colors hover:bg-mint-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-600 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute inset-x-0 top-[calc(100%+0.5rem)] origin-top rounded-2xl border border-forest-900/10 bg-white p-2 shadow-lift lg:hidden"
            >
              <ul className="flex flex-col">
                {links.map((link) => (
                  <li key={link.label}>
                    <NavLink
                      to={link.to}
                      end={link.end}
                      onClick={closeMenu}
                      className={({ isActive: active }) =>
                        `flex items-center justify-between rounded-xl px-4 py-3.5 font-semibold transition-colors ${
                          isActive(link, active) ? "bg-mint-100 text-forest-900" : "text-muted hover:bg-mint-50 hover:text-forest-900"
                        }`
                      }
                    >
                      {link.label}
                      <ArrowUpRight size={16} className="opacity-40" />
                    </NavLink>
                  </li>
                ))}
              </ul>
              <Button
                to="/#contact"
                state={{ enquiryType: "dealership" }}
                onClick={closeMenu}
                variant="dark"
                className="mt-2 w-full sm:hidden"
              >
                Become a dealer <ArrowUpRight size={16} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

export default Navbar;
