import { Building2, Mail, MapPin } from "lucide-react";
import { useLocation } from "react-router-dom";
import EnquiryForm from "./EnquiryForm";
import Container from "./ui/Container";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

const offices = [
  {
    title: "Head office",
    address: ["1/137, Sreenilayam, KPS Complex", "Gooty – 515402", "Anantapur Dist, Andhra Pradesh"],
    emails: ["info@ekotejas.in", "admin@tejasevehicles.com"],
  },
  {
    title: "Corporate office",
    address: ["#2, Tejashree Park Soc, S. No 69, CTS No. 122/A", "Erandawane, Pune – 411004", "Maharashtra"],
    emails: ["sales@ekotejas.in", "sales.manager@ekotejas.in", "director.sales@ekotejas.in"],
  },
];

function Contact() {
  // Buttons like "Become a dealer" link here with { enquiryType: "dealership" }
  // in the router state, so the form opens with the right topic selected.
  const { state } = useLocation();
  const presetType = state?.enquiryType || "general";

  return (
    <section id="contact" className="bg-white py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Let's get you"
            accent="moving."
            description="Questions about a vehicle, pricing, finance or dealership? Send us a message and our team will get back to you."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {offices.map((office) => (
              <Reveal key={office.title}>
                <article className="h-full rounded-3xl border border-forest-900/8 bg-mint-50 p-6">
                  <h3 className="flex items-center gap-2.5 font-display text-lg font-bold text-forest-900">
                    <Building2 size={18} className="text-forest-600" aria-hidden="true" />
                    {office.title}
                  </h3>
                  <div className="mt-4 flex gap-2.5 text-sm leading-6 text-muted">
                    <MapPin size={16} className="mt-1 shrink-0 text-sage-500" aria-hidden="true" />
                    {/* <address> is the right HTML tag for contact details. */}
                    <address className="not-italic">
                      {office.address.map((line) => (
                        <span key={line} className="block">{line}</span>
                      ))}
                    </address>
                  </div>
                  <ul className="mt-4 space-y-1.5 border-t border-forest-900/8 pt-4 text-sm">
                    {office.emails.map((email) => (
                      <li key={email} className="flex items-center gap-2.5">
                        <Mail size={15} className="shrink-0 text-sage-500" aria-hidden="true" />
                        <a href={`mailto:${email}`} className="break-all font-medium text-forest-800 hover:text-forest-600 hover:underline">
                          {email}
                        </a>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="relative self-start rounded-[2rem] border border-forest-900/8 bg-mint-50 p-6 shadow-soft sm:p-9">
          <h3 className="font-display text-2xl font-bold text-forest-900">Send us a message</h3>
          <p className="mb-7 mt-1.5 text-sm text-muted">Fields marked optional can be left empty.</p>
          {/* `key` makes React start a fresh form when the preset topic changes. */}
          <EnquiryForm key={presetType} defaultType={presetType} />
        </Reveal>
      </Container>
    </section>
  );
}

export default Contact;
