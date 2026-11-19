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
    <footer className="border-t border-forest-900/8 bg-white text-forest-950">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <Link to="/" aria-label="Eko Tejas home" className="inline-flex">
              <img src={logo} alt="" className="h-12 w-auto" />
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-6 text-muted">
              India&apos;s homegrown electric vehicle brand. Clean, affordable mobility for people and businesses.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-600">{column.title}</h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      state={link.state}
                      className="group inline-flex items-center gap-1 text-sm text-forest-800 transition-colors hover:text-forest-600"
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
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-600">Get in touch</h2>
            <ul className="mt-5 space-y-4 text-sm text-forest-800">
              <li className="flex gap-3">
                <MapPin size={17} className="mt-0.5 shrink-0 text-sage-500" />
                Gooty, Anantapur Dist, Andhra Pradesh
              </li>
              <li className="flex gap-3">
                <Mail size={17} className="mt-0.5 shrink-0 text-sage-500" />
                <a href="mailto:info@ekotejas.in" className="hover:text-forest-600">info@ekotejas.in</a>
              </li>
              <li className="flex gap-3">
                <Mail size={17} className="mt-0.5 shrink-0 text-sage-500" />
                <a href="mailto:sales@ekotejas.in" className="hover:text-forest-600">sales@ekotejas.in</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-forest-900/8 pt-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Eko Tejas. All rights reserved.</p>
          <p>Move better. Breathe better.</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
