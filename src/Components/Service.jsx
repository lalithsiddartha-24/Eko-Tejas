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
function Service()
{
    return (
        <section  id = "service" className = "bg-[#11151D] px-6 py-24 md:px-10 lg:px-16 ">
            <div className = "mx-auto max-w-7xl ">
                <p className = "text-xs font-bold tracking-[0.3em] text-[#8FAE9E]">
                    EKO-TEJAS Care
                </p>
                <h2 className = "mt-4 tracking-tight text-4xl md:text-5xl lg:text-6xl font-bold text-white">Service that keeps you
                    <span className = "block text-[#79A88F]">Move forward ...</span>
                </h2>
                <p className="mt-6 max-w-xl leading-7 text-gray-400">
                From essential maintenance to premium ownership support, choose the level
                of care that fits your journey.
                </p>
                <div className = "mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key = {plan.name}
                            className = {`group rounded-3xl border p-6 ${
                                plan.name === "PREMIUM CARE"
                                    ? "border-[#79A88F] bg-[#79A88F]/10 hover:bg-[#79A88F]/15 transition-transform duration-600 hover:scale-105"
                                    : "border-white/10 bg-white/5 hover:bg-white/10 transition-transform duration-600 hover:scale-105"
                            }`}
                        >
                            <p className = "text-sm font-semibold text-[#8FAE9E]">
                                {plan.name}
                            </p>
                            <h3 className = "mt-4 text-3xl font-bold text-white">
                                {plan.price}
                            </h3>
                            <p className = "mt-4 leading-7 text-gray-400">
                                {plan.description}
                            </p>
                            <button className = "mt-8 flex items-center justify-center gap-3 font-semibold text-white">
                                Learn More
                                <span className = "flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition duration-500 group-hover:border-[#79A88F] group-hover:bg-[#79A88F] group-hover:text-[#11151D]">
                                    <MoveRight className = "transition duration-300 group-hover:translate-x-1" size = {18} />
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
export default Service;