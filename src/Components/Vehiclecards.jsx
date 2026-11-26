import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "./ui/Container";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";
import threeWheelerImage from "../assets/three-wheeler-banana-market.webp";
import twoWheelerImage from "../assets/two-wheeler-skyscrapers.webp";

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
          {/* Two-wheelers: the green scooter parked between glass towers (black-and-white + green, like the 3-wheeler photo) */}
          <Reveal>
            <Link
              to="/twowheelers"
              className="group relative isolate flex h-full min-h-[28rem] flex-col overflow-hidden rounded-[2rem] bg-forest-950 p-7 shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-lift sm:min-h-[32rem] sm:p-9 motion-reduce:hover:translate-y-0"
            >
              {/* Photo first in the code so it sits BEHIND the text (it's absolutely positioned). */}
              <CardPhoto src={twoWheelerImage} position="object-[50%_70%]" />
              <CardText
                label="2-Wheelers"
                title="Electric two-wheelers"
                text="Smart, efficient and powerful scooters designed for everyday journeys."
              />
              <ArrowBadge />
            </Link>
          </Reveal>

          {/* Three-wheelers: same soft card, with the real three-wheeler photo (same one as the 3-wheeler page header) */}
          <Reveal delay={0.08}>
            <Link
              to="/vehicles"
              className="group relative isolate flex h-full min-h-[28rem] flex-col overflow-hidden rounded-[2rem] bg-forest-950 p-7 shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-lift sm:min-h-[32rem] sm:p-9 motion-reduce:hover:translate-y-0"
            >
              <CardPhoto src={threeWheelerImage} position="object-[45%_70%]" />
              <CardText
                label="3-Wheelers"
                title="Electric three-wheelers"
                text="Reliable, cost-efficient vehicles built for businesses and urban mobility."
              />
              <ArrowBadge />
            </Link>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function CardText({ label, title, text }) {
  return (
    <div className="relative max-w-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ev-green">{label}</p>
      <h3 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">{title}</h3>
      <p className="mt-3 text-[0.95rem] leading-7 text-white/75">{text}</p>
    </div>
  );
}

/**
 * The photo that FILLS each category card. Both cards use this component,
 * so they always match.
 * - `absolute inset-0 -z-10`: the photo covers the whole card and sits
 *   behind the text (the card is `isolate`, so -z-10 stays inside the card).
 * - The dark fade is strongest at the TOP, where the white text sits, and
 *   clears toward the bottom so the vehicle stays bright. Same idea as the
 *   2-wheeler / 3-wheeler page headers.
 * - `position` aims the crop at the vehicle (lower part of each photo).
 * - `alt=""`: decorative, because the card's heading already says what it is.
 */
function CardPhoto({ src, position }) {
  return (
    <>
      <img
        src={src}
        alt=""
        loading="lazy"
        className={`absolute inset-0 -z-10 h-full w-full object-cover ${position} transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none`}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(6_8_7/0.86)_0%,rgb(6_8_7/0.68)_38%,rgb(6_8_7/0.15)_66%,rgb(6_8_7/0)_100%)]"
      />
    </>
  );
}

function ArrowBadge() {
  return (
    <span
      aria-hidden="true"
      className="absolute right-6 top-6 grid h-11 w-11 place-items-center rounded-full bg-white text-forest-950 shadow-soft transition-all duration-300 group-hover:rotate-45 group-hover:bg-forest-950 group-hover:text-white sm:right-8 sm:top-8"
    >
      <ArrowUpRight size={19} />
    </span>
  );
}

export default Vehiclecards;
