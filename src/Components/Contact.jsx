import { Mail, MapPin } from "lucide-react";
import { useLocation } from "react-router-dom";
import EnquiryForm from "./EnquiryForm";
import Container from "./ui/Container";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

const offices = [
  {
    title: "Head office",
    city: "Gooty, Andhra Pradesh",
    address: "1/137, Sreenilayam, KPS Complex, Gooty – 515402, Anantapur Dist",
    emails: ["info@ekotejas.in", "admin@tejasevehicles.com"],
  },
  {
    title: "Corporate office",
    city: "Pune, Maharashtra",
    address: "#2, Tejashree Park Soc, S. No 69, CTS No. 122/A, Erandawane, Pune – 411004",
    emails: ["sales@ekotejas.in", "sales.manager@ekotejas.in", "director.sales@ekotejas.in"],
  },
];

/**
 * Contact section: ONE card split into two panels.
 *   - Left, dark: how to reach us (offices + emails). Dark like the vehicle
 *     page headers, with the same emerald accent.
 *   - Right, white: the message form.
 *
 * WHY one split card instead of separate boxes: before, the left column
 * (two tall office boxes) was much longer than the form, so the two sides
 * never lined up. In one card both panels are always the same height, and
 * the page reads as one calm block instead of three floating boxes.
 * On phones the dark panel sits above the form.
 */
function Contact() {
  // Buttons like "Become a dealer" link here with { enquiryType: "dealership" }
  // in the router state, so the form opens with the right topic selected.
  const { state } = useLocation();
  const presetType = state?.enquiryType || "general";

  return (
    <section id="contact" className="bg-mint-50 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Contact"
          title="Let's get you"
          accent="moving."
          description="Questions about a vehicle, pricing, finance or a dealership? Send us a message and our team will get back to you."
        />

        <Reveal className="mt-12 overflow-clip rounded-[2rem] bg-white shadow-lift ring-1 ring-forest-900/8 lg:grid lg:grid-cols-[0.85fr_1.15fr]">
          {/* ---------- Left: dark contact panel ---------- */}
          {/* overflow-clip (not -hidden): it trims the decorations the same way, but the
              panel can never be scrolled by code, so its content can't shift. */}
          <aside className="relative isolate flex flex-col overflow-clip bg-forest-950 p-7 text-white sm:p-10">
            {/* Just a soft green glow in the corner: quiet decoration, hidden from screen readers. */}
            <div aria-hidden="true" className="absolute -bottom-24 -right-24 -z-10 h-72 w-72 rounded-full bg-ev-green/20 blur-[90px]" />

            <h3 className="font-display text-2xl font-semibold tracking-tight">Talk to us</h3>
            <p className="mt-2 max-w-xs text-sm leading-6 text-white/60">
              Prefer email? Write to the team directly. Or send the form and we&apos;ll get back to you.
            </p>

            <div className="mt-8 space-y-7">
              {offices.map((office) => (
                <div key={office.title} className="border-t border-white/10 pt-6 first:border-t-0 first:pt-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ev-green">{office.title}</p>
                  {/* <address> is the right HTML tag for contact details. */}
                  <address className="mt-3 not-italic">
                    <p className="flex items-start gap-2.5 font-medium">
                      <MapPin size={16} className="mt-1 shrink-0 text-white/50" aria-hidden="true" />
                      <span>
                        {office.city}
                        <span className="mt-0.5 block text-sm font-normal leading-6 text-white/50">{office.address}</span>
                      </span>
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {office.emails.map((email) => (
                        <li key={email}>
                          <a
                            href={`mailto:${email}`}
                            className="group inline-flex items-center gap-2.5 break-all text-sm text-white/80 transition-colors hover:text-white"
                          >
                            <Mail size={15} className="shrink-0 text-white/40 transition-colors group-hover:text-ev-green" aria-hidden="true" />
                            {email}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </address>
                </div>
              ))}
            </div>
          </aside>

          {/* ---------- Right: the form ---------- */}
          <div className="p-6 sm:p-10">
            <h3 className="font-display text-2xl font-semibold tracking-tight text-forest-950">Send us a message</h3>
            <p className="mb-7 mt-1.5 text-sm text-muted">Pick a topic and tell us a little about what you need.</p>
            {/* `key` makes React start a fresh form when the preset topic changes. */}
            <EnquiryForm key={presetType} defaultType={presetType} />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export default Contact;
