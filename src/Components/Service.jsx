import { Check, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "./ui/Container";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";

const plans = [
  {
    name: "Free service",
    price: "₹0",
    description: "Essential maintenance support",
    perks: ["Periodic check-ups", "Genuine spare parts", "Expert technicians"],
  },
  {
    name: "Premium care",
    price: "₹999",
    period: "/year",
    description: "Priority ownership support",
    perks: ["Priority service slots", "Everything in Free", "Dedicated support line"],
    featured: true,
  },
  {
    name: "On-demand",
    price: "Pay as needed",
    description: "Service whenever you need it",
    perks: ["No yearly commitment", "Transparent pricing", "Book any time"],
  },
];

/**
 * Dark "care plans" section.
 * WHY dark here: alternating dark and light sections gives the page a
 * rhythm, and tells the eye "new topic" without needing extra dividers.
 * (The old version used a navy colour, #11151D, that didn't belong to the
 * brand. Now it uses the same forest green as the hero and footer.)
 */
function Service() {
  return (
    <section id="service" className="relative isolate overflow-hidden bg-forest-900 py-20 text-white sm:py-28">
      <div aria-hidden="true" className="bg-grid-dark absolute inset-0 -z-10" />
      <div aria-hidden="true" className="absolute -left-40 top-1/3 -z-10 h-96 w-96 rounded-full bg-forest-600/40 blur-[120px]" />

      <Container>
        <SectionHeading
          tone="dark"
          eyebrow="Eko Tejas care"
          title="Service that keeps you"
          accent="moving forward."
          description="From essential maintenance to premium ownership support, choose the level of care that fits your journey."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 0.06}>
              <article
                className={`relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition-[border-color,transform] duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0 sm:p-8 ${
                  plan.featured
                    ? "premium-plan-card border-volt/40 bg-gradient-to-b from-forest-700 to-forest-800"
                    : "border-white/10 bg-white/[0.04] hover:border-white/25"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-sage-300">{plan.name}</h3>
                  {plan.featured && (
                    <span className="rounded-full bg-volt px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-forest-950">
                      Most popular
                    </span>
                  )}
                </div>
                <p className="mt-7 font-display text-4xl font-bold tracking-tight">
                  {plan.price}
                  {plan.period && <span className="text-base font-medium text-white/50">{plan.period}</span>}
                </p>
                <p className="mt-2 text-white/60">{plan.description}</p>

                <ul className="mt-7 space-y-3 border-t border-white/10 pt-6 text-sm text-white/80">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-3">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-volt/15 text-volt">
                        <Check size={12} strokeWidth={3} aria-hidden="true" />
                      </span>
                      {perk}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/#contact"
                  state={{ enquiryType: "service" }}
                  className="group mt-auto flex items-center justify-between pt-8 text-sm font-semibold text-white/90 hover:text-volt"
                >
                  Ask about {plan.name.toLowerCase()}
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-colors group-hover:border-volt/60 group-hover:bg-volt/10">
                    <MoveRight size={17} aria-hidden="true" />
                  </span>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Service;
