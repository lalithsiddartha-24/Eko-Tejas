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
 * A white card that overlaps the bottom of the dark hero.
 * WHY overlap (`-mt-8`): it visually "stitches" the dark hero to the light
 * page below, which feels more crafted than a hard edge between two blocks.
 */
function FeatureStrip() {
  return (
    <section aria-label="Why Eko Tejas" className="relative z-10 -mt-8">
      <Container>
        {/* gap-px + an OPAQUE background = 1px divider lines between the cells.
            (A see-through colour here would let the dark hero show through.) */}
        <Reveal className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-mint-200 bg-mint-200 shadow-lift sm:grid-cols-2 xl:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="group flex items-start gap-4 bg-white p-6 transition-colors hover:bg-mint-50 lg:p-7">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mint-100 text-forest-700 transition-colors group-hover:bg-forest-900 group-hover:text-volt">
                <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-[1.05rem] font-bold text-forest-900">{title}</h3>
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
