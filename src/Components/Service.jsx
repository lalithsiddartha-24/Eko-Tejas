import { MoveRight } from "lucide-react";

const plans = [
  {
    name: "FREE SERVICE",
    price: "₹0",
    description: "Essential maintenance support",
  },
  {
    name: "PREMIUM CARE",
    price: "₹999/year",
    description: "Priority ownership support",
  },
  {
    name: "ON-DEMAND SERVICE",
    price: "Pay as needed",
    description: "Service whenever you need it",
  },
];
function Service() {
  return (
    <section id="service" className="bg-[#11151D] px-6 py-24 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.3em] text-[#8FAE9E]">
            EKO-TEJAS CARE
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Service that keeps you
            <span className="mt-1 block text-[#79A88F]">moving forward.</span>
          </h2>
          <p className="mt-6 max-w-xl leading-7 text-gray-400">
            From essential maintenance to premium ownership support, choose the
            level of care that fits your journey.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {plans.map((plan) => {
            const isPremium = plan.name === "PREMIUM CARE";

            return (
              <article
                key={plan.name}
                className={`group relative flex min-h-72 flex-col overflow-hidden rounded-2xl border p-7 transition-[border-color,background-color,transform] duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                  isPremium
                    ? "premium-plan-card border-[#79A88F]/50 bg-gradient-to-br from-[#20372F] to-[#18251F] hover:border-[#A4C8B4]/70"
                    : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.055]"
                }`}
              >
                {isPremium && (
                  <span className="absolute right-6 top-6 z-10 rounded-full border border-[#79A88F]/30 bg-[#79A88F]/10 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-[#B8D4C5]">
                    MOST POPULAR
                  </span>
                )}

                <p className="text-xs font-semibold tracking-[0.18em] text-[#9BB7A8]">
                  {plan.name}
                </p>
                <h3 className="mt-8 text-3xl font-semibold tracking-tight text-white">
                  {plan.price}
                </h3>
                <p className="mt-3 max-w-[18rem] leading-7 text-gray-400">
                  {plan.description}
                </p>

                <button className="mt-auto flex items-center justify-between border-t border-white/10 pt-6 text-sm font-medium text-white/90 transition-colors duration-300 group-hover:text-[#B8D4C5]">
                Learn more
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition-colors duration-300 group-hover:border-[#79A88F]/60 group-hover:bg-[#79A88F]/10">
                    <MoveRight size={17} />
                </span>
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Service;