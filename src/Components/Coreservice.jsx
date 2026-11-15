import { Brush, Cog, Gauge, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import Container from "./ui/Container";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

const services = [
  {
    icon: ShieldCheck,
    title: "Full service",
    description: "Complete care for your EV: battery health, brakes, electricals and a full road test.",
  },
  {
    icon: Wrench,
    title: "Regular service",
    description: "Routine maintenance and repairs that keep your vehicle efficient and reliable.",
  },
  {
    icon: Cog,
    title: "Fork service",
    description: "Specialised fork servicing with genuine parts for a smooth and safe ride.",
  },
  {
    icon: Sparkles,
    title: "Major overhaul",
    description: "A deep refresh of worn components to bring an older vehicle back to its best.",
  },
  {
    icon: Gauge,
    title: "Tune-up",
    description: "Optimise efficiency and range with an expert check of motor and controller settings.",
  },
  {
    icon: Brush,
    title: "Painting",
    description: "Give your EV a fresh look with a professional paint job in the colour you love.",
  },
];

/**
 * Light "core services" grid.
 * WHY the grid classes changed: the old grid was always 3 columns
 * (`grid-cols-3`), so on a phone each card was squeezed to ~100px wide.
 * Now it is 1 column on phones, 2 on tablets and 3 on desktops.
 */
function Coreservice() {
  return (
    <section id="core-service" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Core services"
          title="Care for your"
          accent="future."
          description="Certified technicians, genuine parts and quick turnaround, whatever your vehicle needs."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={(index % 3) * 0.05}>
              <article className="group relative h-full overflow-hidden rounded-3xl border border-forest-900/8 bg-white p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-forest-600/30 hover:shadow-lift motion-reduce:hover:translate-y-0">
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mint-100 text-forest-700 transition-colors group-hover:bg-forest-900 group-hover:text-volt">
                    <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span aria-hidden="true" className="font-display text-4xl font-extrabold tracking-tighter text-forest-900/[0.07]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-8 font-display text-xl font-bold text-forest-900">{title}</h3>
                <p className="mt-2 text-[0.95rem] leading-7 text-muted">{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Coreservice;
