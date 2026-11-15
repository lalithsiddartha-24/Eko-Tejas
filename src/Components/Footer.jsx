import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/Group-1941.webp";
import Container from "./ui/Container";

const columns = [
  {
    title: "Vehicles",
    links: [
      { label: "Electric 2-wheelers", to: "/twowheelers" },
      { label: "Electric 3-wheelers", to: "/vehicles" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Service & care", to: "/#service" },
      { label: "Contact us", to: "/#contact" },
      { label: "Become a dealer", to: "/#contact", state: { enquiryType: "dealership" } },
    ],
  },
];

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-forest-950 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-forest-600/25 blur-[120px]" />

      <Container className="relative py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            {/* The logo has a white background, so it sits on a white tile. */}
            <Link to="/" aria-label="Eko Tejas home" className="inline-flex rounded-2xl bg-white p-2.5">
              <img src={logo} alt="" className="h-12 w-auto" />
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-6 text-white/60">
              India&apos;s homegrown electric vehicle brand. Clean, affordable mobility for people and businesses.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-volt">{column.title}</h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      state={link.state}
                      className="group inline-flex items-center gap-1 text-sm text-white/75 transition-colors hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-volt">Get in touch</h2>
            <ul className="mt-5 space-y-4 text-sm text-white/75">
              <li className="flex gap-3">
                <MapPin size={17} className="mt-0.5 shrink-0 text-sage-300" />
                Gooty, Anantapur Dist, Andhra Pradesh
              </li>
              <li className="flex gap-3">
                <Mail size={17} className="mt-0.5 shrink-0 text-sage-300" />
                <a href="mailto:info@ekotejas.in" className="hover:text-white">info@ekotejas.in</a>
              </li>
              <li className="flex gap-3">
                <Mail size={17} className="mt-0.5 shrink-0 text-sage-300" />
                <a href="mailto:sales@ekotejas.in" className="hover:text-white">sales@ekotejas.in</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Eko Tejas. All rights reserved.</p>
          <p>Move better. Breathe better.</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
