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
 * "Care plans": a light section with three plan cards.
 * Only the featured plan is black. In a minimal design, ONE dark element
 * on a light page pulls the eye far more than many dark blocks would.
 */
function Service() {
  return (
    <section id="service" className="bg-mint-50 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Eko Tejas care"
          title="Service that keeps you"
          accent="moving forward."
          description="From essential maintenance to premium ownership support, choose the level of care that fits your journey."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {plans.map((plan, index) => {
            const featured = plan.featured;
            return (
              <Reveal key={plan.name} delay={index * 0.06}>
                <article
                  className={`relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0 sm:p-8 ${
                    featured ? "premium-plan-card bg-forest-950 text-white" : "border border-forest-900/8 bg-white text-forest-950"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className={`text-sm font-semibold uppercase tracking-[0.16em] ${featured ? "text-sage-300" : "text-forest-600"}`}>
                      {plan.name}
                    </h3>
                    {featured && (
                      <span className="rounded-full bg-volt px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-forest-950">
                        Most popular
                      </span>
                    )}
                  </div>
                  <p className="mt-7 font-display text-4xl font-semibold tracking-tight">
                    {plan.price}
                    {plan.period && <span className={`text-base font-medium ${featured ? "text-white/50" : "text-muted"}`}>{plan.period}</span>}
                  </p>
                  <p className={`mt-2 ${featured ? "text-white/60" : "text-muted"}`}>{plan.description}</p>

                  <ul className={`mt-7 space-y-3 border-t pt-6 text-sm ${featured ? "border-white/10 text-white/80" : "border-forest-900/8 text-forest-800"}`}>
                    {plan.perks.map((perk) => (
                      <li key={perk} className="flex items-center gap-3">
                        <Check size={15} strokeWidth={2.5} className={featured ? "text-volt" : "text-forest-600"} aria-hidden="true" />
                        {perk}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/#contact"
                    state={{ enquiryType: "service" }}
                    className={`group mt-auto flex items-center justify-between pt-8 text-sm font-semibold ${featured ? "text-white" : "text-forest-950"}`}
                  >
                    Ask about {plan.name.toLowerCase()}
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${
                        featured
                          ? "border-white/15 group-hover:bg-white group-hover:text-forest-950"
                          : "border-forest-900/12 group-hover:bg-forest-950 group-hover:text-white"
                      }`}
                    >
                      <MoveRight size={17} aria-hidden="true" />
                    </span>
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default Service;
