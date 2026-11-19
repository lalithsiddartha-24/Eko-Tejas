import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

  /*
   * "Hide on scroll down, show on scroll up" (also called a headroom navbar).
   * Scrolling DOWN means you're reading, so the bar slides away and the
   * content (like the hero photo) gets the full screen. Scrolling UP is a
   * hint you want to go somewhere, so the bar slides back.
   *
   * WHY useRef for lastY: we need to remember the previous scroll position
   * between scroll events, but changing it shouldn't re-render the navbar.
   * A ref is a box that keeps a value without causing a render.
   * WHY the 8px threshold: tiny trackpad wobbles shouldn't make it flicker.
   */
  const [hiddenOnScroll, setHiddenOnScroll] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      const delta = y - lastY.current;
      if (Math.abs(delta) < 8) return;
      // Always show it near the top of the page.
      setHiddenOnScroll(delta > 0 && y > 120);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Never hide the bar while its mobile menu is open.
  const navHidden = hiddenOnScroll && !menuOpen;

  // Tell the rest of the page (via <html data-nav-hidden>) so other sticky
  // bars, like the vehicle page's section tabs, can move up into the gap.
  useEffect(() => {
    const root = document.documentElement;
    if (navHidden) root.dataset.navHidden = "";
    else delete root.dataset.navHidden;
  }, [navHidden]);

  // NavLink only compares the PATH and ignores the "#hash" part, so on
  // "/#service" it thinks Home ("/") is active too. We decide ourselves:
  //   - section links ("/#service") are active when the URL has that hash
  //   - Home is active only on "/" with NO section hash
  //   - other pages ("/twowheelers") use NavLink's normal answer
  const isActive = (link, active) => {
    if (link.to.includes("#")) return pathname === "/" && `/${hash}` === link.to;
    if (link.to === "/") return pathname === "/" && !hash;
    return active;
  };

  return (
    <header
      // onFocus: if someone tabs into the navbar with the keyboard while it's
      // hidden, slide it back in so they can see what they're focusing.
      onFocus={() => setHiddenOnScroll(false)}
      className={`sticky top-0 z-50 px-3 pt-3 transition-transform duration-300 ease-out motion-reduce:transition-none sm:px-5 ${
        // 130% of its own height: far enough that the shadow is off-screen too.
        navHidden ? "-translate-y-[130%]" : "translate-y-0"
      }`}
    >
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
          {/* Wrapped in a div because the Button's own `inline-flex` class
              would otherwise win over `hidden`, showing it on phones. */}
          <div className="hidden sm:block">
            <Button to="/#contact" state={{ enquiryType: "dealership" }} variant="dark">
              Become a dealer
              <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Button>
          </div>

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
