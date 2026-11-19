import { IndianRupee, MapPin, Settings, Wrench } from "lucide-react";
import Container from "./ui/Container";
import Reveal from "./ui/Reveal";

const features = [
  { icon: IndianRupee, title: "Cost efficient", description: "Lower running costs for smarter mobility" },
  { icon: Wrench, title: "65 expert mechanics", description: "Skilled technicians ready to support your vehicle" },
  { icon: Settings, title: "941 spare parts", description: "A wide range of parts for reliable maintenance" },
  { icon: MapPin, title: "Easy service access", description: "Reliable support whenever you need it" },
];

/**
 * A quiet row of four reasons, separated only by thin lines.
 * WHY no card or shadow: in a minimal layout, whitespace and hairlines do
 * the job of boxes. Fewer boxes = calmer page.
 */
function FeatureStrip() {
  return (
    <section aria-label="Why Eko Tejas" className="border-y border-forest-900/8 bg-white">
      <Container>
        <Reveal className="grid grid-cols-1 divide-y divide-forest-900/8 sm:grid-cols-2 sm:divide-y-0 xl:grid-cols-4 xl:divide-x">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-4 py-7 sm:px-2 xl:px-8 xl:first:pl-0 xl:last:pr-0">
              <Icon size={20} strokeWidth={1.6} className="mt-0.5 shrink-0 text-forest-600" aria-hidden="true" />
              <div>
                <h3 className="font-display font-semibold text-forest-950">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

export default FeatureStrip;
