import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/Group-1941.webp";
import Container from "./ui/Container";

/*
 * WORDMARK FOOTER
 * ---------------
 * Minimal and typographic, like the 404 page: links on top, and the brand
 * name in huge, soft letters across the full width at the very bottom.
 * No pictures, so it stays sharp on every screen and costs nothing to load.
 */

const columns = [
  {
    title: "Vehicles",
    links: [
      // "‑" is a NON-BREAKING hyphen (looks like "-"), so "2-wheelers"
      // never splits across two lines on narrow phones.
      { label: "Electric 2‑wheelers", to: "/twowheelers" },
      { label: "Electric 3‑wheelers", to: "/vehicles" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", to: "/about" },
      { label: "Media", to: "/media" },
      { label: "Service & care", to: "/#service" },
      { label: "Contact us", to: "/#contact" },
      { label: "Become a dealer", to: "/#contact", state: { enquiryType: "dealership" } },
    ],
  },
  {
    title: "Get in touch",
    links: [
      { label: "info@ekotejas.in", href: "mailto:info@ekotejas.in" },
      { label: "sales@ekotejas.in", href: "mailto:sales@ekotejas.in" },
      { label: "Gooty, Anantapur Dist, Andhra Pradesh" },
    ],
  },
];

const linkClass =
  "group inline-flex items-center gap-1 text-[0.95rem] text-forest-800 transition-colors hover:text-forest-950";

function FooterLink({ link }) {
  const arrow = (
    <ArrowUpRight
      size={14}
      aria-hidden="true"
      className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
    />
  );
  if (link.to) {
    return (
      <Link to={link.to} state={link.state} className={linkClass}>
        {link.label}
        {arrow}
      </Link>
    );
  }
  if (link.href) {
    return (
      <a href={link.href} className={linkClass}>
        {link.label}
        {arrow}
      </a>
    );
  }
  return <span className="text-[0.95rem] leading-6 text-muted">{link.label}</span>;
}

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="overflow-hidden border-t border-forest-900/8 bg-white">
      <Container className="pt-16 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
          {/* Brand */}
          <div className="max-w-sm">
            <Link to="/" aria-label="Eko Tejas home" className="inline-flex">
              <img src={logo} alt="" className="h-12 w-auto" />
            </Link>
            <p className="mt-6 text-[0.95rem] leading-7 text-muted">
              India&apos;s homegrown electric vehicle brand. Clean, affordable mobility for people and businesses.
            </p>
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title} className={column.title === "Get in touch" ? "col-span-2 sm:col-span-1" : ""}>
                <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-forest-600">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ev-green" />
                  {column.title}
                </h2>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-forest-900/8 pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Eko Tejas. All rights reserved.</p>
          <p>
            Move better. <span className="text-ev-green">Breathe better.</span>
          </p>
        </div>

        {/*
          THE WORDMARK
          An SVG <text> with `textLength` makes the browser stretch the letters
          to EXACTLY the width we ask for (here the whole viewBox, 1000 units).
          The SVG then scales with the footer, so "EKO TEJAS" always spans the
          full width on any screen, with no font-size guessing per breakpoint.
          It's decorative (the logo above already names the brand), so it's
          hidden from screen readers.
          The viewBox is slightly shorter than the letters, and the footer clips
          them, so the bottom of the letters is cut off by the page edge, a
          common premium-footer look that says "this is the end of the page".
        */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 150"
          className="mt-8 block w-full select-none overflow-visible sm:mt-10"
        >
          <text
            x="0"
            y="168"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            className="fill-mint-200 font-display"
            style={{ fontSize: 212, fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            EKO TEJAS
          </text>
        </svg>
      </Container>
    </footer>
  );
}

export default Footer;
