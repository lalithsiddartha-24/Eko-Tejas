import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import scooterImage from "../assets/scooter_transparent.png";
import Container from "./ui/Container";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";
import { AutoIllustration } from "./ui/VehicleIllustrations";

/**
 * "Our vehicles": the two category cards on the home page.
 * (This used to be split across Vehicle.jsx for the heading and
 * Vehiclecards.jsx for the cards. Keeping them together means the heading
 * and cards always share the same width and spacing.)
 *
 * WHY the whole card is a <Link>: a big click target is easier on phones
 * than a small "Explore" link inside the card.
 */
function Vehiclecards() {
  return (
    <section id="vehicles" className="py-20 sm:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Our vehicles"
            title="Built for every"
            accent="journey."
            description="Electric mobility engineered for performance, efficiency and the changing needs of modern India."
          />
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          {/* Two-wheelers: light card with the scooter photo */}
          <Reveal>
            <Link
              to="/twowheelers"
              className="group relative flex h-full min-h-[26rem] flex-col overflow-hidden rounded-[2rem] border border-forest-900/8 bg-white p-7 shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-lift sm:p-9 motion-reduce:hover:translate-y-0"
            >
              <div aria-hidden="true" className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,var(--color-volt-soft),transparent_70%)] opacity-70" />
              <CardText
                label="2-Wheelers"
                title="Electric two-wheelers"
                text="Smart, efficient and powerful scooters designed for everyday journeys."
              />
              <img
                src={scooterImage}
                alt=""
                className="pointer-events-none relative -mb-6 ml-auto mt-4 w-[115%] max-w-none translate-x-[8%] transition-transform duration-700 group-hover:-translate-x-[1%] sm:-mt-10 sm:w-[88%] motion-reduce:transition-none"
              />
              <ArrowBadge />
            </Link>
          </Reveal>

          {/* Three-wheelers: dark card with a line drawing */}
          <Reveal delay={0.08}>
            <Link
              to="/vehicles"
              className="group relative flex h-full min-h-[26rem] flex-col overflow-hidden rounded-[2rem] bg-forest-900 p-7 text-white shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-lift sm:p-9 motion-reduce:hover:translate-y-0"
            >
              <div aria-hidden="true" className="bg-grid-dark absolute inset-0" />
              <CardText
                dark
                label="3-Wheelers"
                title="Electric three-wheelers"
                text="Reliable, cost-efficient vehicles built for businesses and urban mobility."
              />
              <AutoIllustration className="relative mx-auto mt-auto w-[78%] max-w-sm pt-8 text-sage-300/70 transition-transform duration-700 group-hover:translate-x-2 motion-reduce:transition-none" />
              <ArrowBadge dark />
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function CardText({ label, title, text, dark = false }) {
  return (
    <div className="relative max-w-sm">
      <p className={`text-xs font-bold uppercase tracking-[0.22em] ${dark ? "text-volt" : "text-forest-600"}`}>{label}</p>
      <h3 className={`mt-3 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl ${dark ? "text-white" : "text-forest-900"}`}>
        {title}
      </h3>
      <p className={`mt-3 text-[0.95rem] leading-7 ${dark ? "text-white/65" : "text-muted"}`}>{text}</p>
    </div>
  );
}

function ArrowBadge({ dark = false }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full transition-all duration-300 group-hover:rotate-45 sm:right-8 sm:top-8 ${
        dark ? "bg-volt text-forest-950" : "bg-forest-900 text-white group-hover:bg-volt group-hover:text-forest-950"
      }`}
    >
      <ArrowUpRight size={20} />
    </span>
  );
}

export default Vehiclecards;
