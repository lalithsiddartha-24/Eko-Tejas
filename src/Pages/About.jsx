import { ArrowRight, ArrowUpRight, ChevronDown, Factory, Mail, MapPin, Target, Telescope } from "lucide-react";
import { useId, useState } from "react";
import { Link } from "react-router-dom";
import familyImage from "../assets/hero-family-scooter.webp";
import threeWheelerImage from "../assets/three-wheeler-e-rickshaw.webp";
import twoWheelerImage from "../assets/two-wheeler-skyscrapers.webp";
import PageMeta from "../Components/PageMeta";
import Button from "../Components/ui/Button";
import Container from "../Components/ui/Container";
import CountUp from "../Components/ui/CountUp";
import PageIntro from "../Components/ui/PageIntro";
import Reveal from "../Components/ui/Reveal";
import SectionHeading from "../Components/ui/SectionHeading";
import { aboutStats, company, dealerNetwork, factory, mission, parentGroup, team, vision } from "../data/about";
import { offices } from "../data/company";

/*
 * ABOUT PAGE
 * The words live in src/data/about.js; this file only decides the layout.
 * Sections: intro -> who we are -> numbers -> vision & mission -> roots
 * (group + factory) -> dealer network -> team -> ranges -> offices -> CTA.
 */

const ranges = [
  { to: "/twowheelers", image: twoWheelerImage, label: "2-Wheelers", title: "Electric scooters", text: "For daily commutes and city errands." },
  { to: "/vehicles", image: threeWheelerImage, label: "3-Wheelers", title: "Electric three-wheelers", text: "For passengers, cargo and everyday business." },
];

function About() {
  // Which team bio is open (by name), or null when all are closed. Kept here
  // in the page, not inside each card, because the GRID needs to know:
  // - all closed -> cards stretch to the same height (they line up)
  // - one open   -> cards keep their own height, so only the open one grows
  const [openBio, setOpenBio] = useState(null);

  return (
    <main>
      <PageMeta title="About us" />
      <PageIntro eyebrow="About us" title="It's all about" accent="Eko Tejas." description={company.intro} />

      {/* ---------- Who we are ---------- */}
      <section className="bg-mint-50 pb-20 sm:pb-28">
        <Container className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <img
              src={familyImage}
              alt="A smiling father and daughter with a white Eko Tejas electric scooter"
              className="aspect-[16/10] w-full rounded-[2rem] bg-white object-cover object-right shadow-soft"
            />
          </Reveal>
          <SectionHeading eyebrow="Who we are" title="Economical and" accent="environment friendly." description={company.story} />
        </Container>
      </section>

      {/* ---------- Numbers ---------- */}
      <section aria-label="Eko Tejas in numbers" className="border-y border-forest-900/8 bg-white">
        <Container>
          <dl className="grid grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-forest-900/8">
            {aboutStats.map(({ value, label, count = true }) => (
              // dt (label) comes first in the code; flex-col-reverse shows the number on top.
              <div key={label} className="flex flex-col-reverse px-2 py-9 text-center lg:px-6">
                <dt className="mt-1 text-sm text-muted">{label}</dt>
                <dd className="font-display text-4xl font-semibold tracking-tight text-forest-950 sm:text-5xl">
                  {count ? <CountUp value={value} /> : value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ---------- Vision & mission ----------
          Two IDENTICAL cards (same <PurposeCard>), so vision and mission
          read as a matched pair: label, title, one-line summary, 4 points. */}
      <section className="bg-mint-50 py-20 sm:py-28">
        <Container>
          <div className="grid gap-5 lg:grid-cols-2">
            <Reveal className="h-full">
              <PurposeCard label="Our vision" icon={Telescope} {...vision} />
            </Reveal>
            <Reveal className="h-full" delay={0.08}>
              <PurposeCard label="Our mission" icon={Target} {...mission} />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------- Our roots: parent group + factory ---------- */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Our roots" title="Backed by 30 years" accent="of industry." description={parentGroup.text} />

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <Reveal className="h-full">
              <article className="h-full rounded-3xl border border-forest-900/8 bg-white p-7 sm:p-9">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-forest-600">{parentGroup.name}: industries</h3>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {parentGroup.industries.map((industry) => (
                    <li key={industry} className="rounded-full border border-forest-900/10 bg-mint-50 px-4 py-2 text-sm text-forest-800">
                      {industry}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>

            <Reveal className="h-full" delay={0.06}>
              <article className="h-full rounded-3xl bg-mint-50 p-7 sm:p-9">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-forest-600">
                  <Factory size={15} aria-hidden="true" /> Our factory
                </h3>
                <p className="mt-4 leading-7 text-muted">{factory.text}</p>
                <dl className="mt-6 grid grid-cols-2 gap-3">
                  {factory.facts.map(({ value, label }) => (
                    <div key={label} className="flex flex-col-reverse rounded-2xl bg-white p-4">
                      <dt className="mt-1 text-xs text-muted">{label}</dt>
                      <dd className="font-display text-lg font-semibold text-forest-950 sm:text-xl">{value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------- Dealer network ---------- */}
      <section className="bg-mint-50 py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <SectionHeading eyebrow="Dealer network" title="Nearly 100 dealers," accent="across India." description={dealerNetwork.text} />
          <ul className="flex flex-wrap gap-2.5" aria-label="States with Eko Tejas dealers">
            {dealerNetwork.states.map((state) => (
              <li key={state} className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-forest-900 shadow-soft">
                <MapPin size={14} className="text-forest-600" aria-hidden="true" />
                {state}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------- Management team ---------- */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Management team" title="The people" accent="behind Eko Tejas." />
          <div className={`mt-12 grid gap-6 lg:grid-cols-2 ${openBio ? "items-start" : "items-stretch"}`}>
            {team.map((person, index) => (
              <Reveal key={person.name} delay={index * 0.06} className={openBio ? "" : "h-full"}>
                <TeamMember
                  person={person}
                  expanded={openBio === person.name}
                  // Opening one bio closes the other (like an accordion).
                  onToggle={() => setOpenBio((current) => (current === person.name ? null : person.name))}
                  fillHeight={!openBio}
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- What we make ---------- */}
      <section className="bg-mint-50 py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="What we make" title="Two ranges," accent="one promise." />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {ranges.map((range) => (
              <Reveal key={range.to}>
                <Link
                  to={range.to}
                  className="group relative isolate flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-[2rem] bg-forest-950 p-7 shadow-soft transition duration-500 hover:-translate-y-1 hover:shadow-lift sm:p-9 motion-reduce:hover:translate-y-0"
                >
                  <img
                    src={range.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transition-none"
                  />
                  {/* Dark fade at the BOTTOM here, because the text sits at the bottom of these cards. */}
                  <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgb(6_8_7/0.85)_0%,rgb(6_8_7/0.35)_45%,transparent_75%)]" />
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ev-green">{range.label}</p>
                  <h3 className="mt-2 flex items-center gap-2 font-display text-3xl font-semibold tracking-tight text-white">
                    {range.title}
                    <ArrowUpRight size={22} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </h3>
                  <p className="mt-1 text-white/75">{range.text}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- Where we are ---------- */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Where we are" title="Two offices," accent="one team." />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {offices.map((office) => (
              <article key={office.title} className="rounded-3xl border border-forest-900/8 bg-white p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest-600">{office.title}</p>
                <address className="mt-4 not-italic">
                  <p className="flex items-start gap-2.5 font-display text-lg font-semibold text-forest-950">
                    <MapPin size={18} className="mt-1 shrink-0 text-forest-600" aria-hidden="true" />
                    <span>
                      {office.city}
                      <span className="mt-1 block font-sans text-sm font-normal leading-6 text-muted">{office.address}</span>
                    </span>
                  </p>
                  <ul className="mt-4 space-y-1.5 border-t border-forest-900/8 pt-4">
                    {office.emails.map((email) => (
                      <li key={email}>
                        <a href={`mailto:${email}`} className="inline-flex items-center gap-2.5 break-all text-sm text-forest-800 hover:text-forest-950 hover:underline">
                          <Mail size={15} className="shrink-0 text-sage-500" aria-hidden="true" />
                          {email}
                        </a>
                      </li>
                    ))}
                  </ul>
                </address>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------- Call to action ---------- */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="relative isolate flex flex-col items-start gap-6 overflow-hidden rounded-[2rem] bg-forest-950 p-8 text-white sm:p-12 md:flex-row md:items-center md:justify-between">
            <div aria-hidden="true" className="absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-ev-green/20 blur-[90px]" />
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight">Ride with us, or sell with us.</h2>
              <p className="mt-2 max-w-md text-white/65">Book a test drive, ask a question, or become an Eko Tejas dealer in your town.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button to="/#contact" state={{ enquiryType: "dealership" }} variant="light">
                Become a dealer <ArrowRight size={16} />
              </Button>
              <Button to="/#contact" variant="ghost">
                Contact us
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

/**
 * One "purpose" card (used for both vision and mission, so they always match).
 * The points are numbered 01-04 in green, separated by thin lines: easier to
 * scan than one long paragraph, and both cards have the same rhythm.
 */
function PurposeCard({ label, icon: Icon, title, summary, points }) {
  return (
    <article className="flex h-full flex-col rounded-[2rem] border border-forest-900/8 bg-white p-7 shadow-soft sm:p-10">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-forest-600">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />
          {label}
        </h2>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint-100 text-forest-700">
          <Icon size={20} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-6 font-display text-3xl font-semibold tracking-tight text-forest-950 sm:text-4xl">{title}</p>
      <p className="mt-2 text-muted">{summary}</p>
      <ol className="mt-8 divide-y divide-forest-900/8 border-t border-forest-900/8">
        {points.map((point, index) => (
          <li key={point} className="flex gap-5 py-5">
            <span className="w-7 shrink-0 font-display text-sm font-semibold text-forest-600">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="leading-7 text-forest-800">{point}</span>
          </li>
        ))}
      </ol>
    </article>
  );
}

/**
 * One team member: photo, name, role, the first paragraph of the bio, and a
 * "Read full bio" button that shows the rest.
 * WHY collapsed by default: the bios are long. Showing one paragraph keeps
 * the page easy to scan; people who want the detail can open it.
 * `aria-expanded` + `aria-controls` tell screen readers the button
 * opens and closes the extra text.
 * `expanded` / `onToggle` come from the page (see `openBio` in About), and
 * `fillHeight` makes the card fill its grid row while all bios are closed.
 */
function TeamMember({ person, expanded, onToggle, fillHeight }) {
  const moreId = useId();
  const [first, ...rest] = person.bio;

  return (
    <article className={`flex flex-col gap-6 rounded-3xl border border-forest-900/8 bg-white p-6 sm:flex-row sm:p-8 ${fillHeight ? "h-full" : ""}`}>
      {/*
        self-start: in a flex row, items STRETCH to the row's height by
        default. Without it, opening a long bio made the card taller, the
        photo stretched with it, and object-cover zoomed far in. self-start
        keeps the photo at its own 4:5 shape, pinned to the top.
      */}
      <img
        src={person.photo}
        alt={`Portrait of ${person.name}`}
        loading="lazy"
        className="aspect-[4/5] h-auto w-36 shrink-0 self-start rounded-2xl bg-mint-100 object-cover object-top sm:w-40"
      />
      <div className="flex-1">
        <h3 className="font-display text-2xl font-semibold tracking-tight text-forest-950">{person.name}</h3>
        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-forest-600">{person.role}</p>
        <p className="mt-4 leading-7 text-muted">{first}</p>

        {expanded && (
          <div id={moreId} className="mt-4 space-y-4">
            {rest.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="leading-7 text-muted">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {rest.length > 0 && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={moreId}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-950 underline-offset-4 hover:underline"
          >
            {expanded ? "Show less" : "Read full bio"}
            <ChevronDown size={16} aria-hidden="true" className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>
    </article>
  );
}

export default About;
