import { Crown, Wrench } from "lucide-react";
const plans = [
{
    type: "FREE SERVICE",
    price: "₹0",
    period: "Included with your vehicle",
    description:
    "Essential maintenance to keep your EkoTejas vehicle running smoothly.",
    features: [
    "Basic vehicle inspection",
    "Battery health check",
    "Brake & tyre inspection",
    ],
    icon: Wrench,
    highlighted: false,
},
{
    type: "PREMIUM CARE",
    price: "₹999",
    period: "Per year",
    description:
    "complete ownership experience with priority support and extended care.",
    features: [
    "Everything in Free Service",
    "Priority service booking",
    "Dedicated support",
    "Regular performance checks",
    ],
    icon: Crown,
    highlighted: true,
},
{
    type: "ON-DEMAND SERVICE",
    price: "Flexible",
    period: "Pay only when needed",
    description:
"Professional EV service whenever you need additional maintenance.",
    features: [
    "Expert technician support",
    "Genuine spare parts",
    "Transparent pricing",
    ],
    icon: Wrench,
    highlighted: false,
},
];
function Service()
{
    return (
        <section  id = "service" className = "bg-[#11151D] px-6 py-24 md:px-10 lg:px-16">
            <div className  ="mx-auto  max-w-7xl">
                <div className = "max-w-2xl">
                    <p className = "text-xs  fontbold tracking[0.3em] text-[#8FAE9E]">
                        EKO-TEJAS CARE
                    </p>
                    <h2 className = "mt-2 text-4xl md:text-5xl lg:text-6xl tracking-tight font-bold text-white">Service Keeps You<span className = "block text-[#79A88F]">Move Forward</span></h2>
                    </div>

            </div>
            <div className = "mt-14 grid  lg:grid-cols-3 gap-6">
                {plans.map((plan)=>
                {
                    return (
                        <div className = {'relative border rounded-3xl p-8  p-8 md:p-10 ${plan.highlighted? "border-[#79A88F bg-[#173C34] shadow-2xl"? "border-white/10 bg-[#1B202A] hover:border-[#79A88F]/50"}'}>
                            {plan.highlighted && (
                <div className="absolute right-6 top-6 rounded-full bg-[#79A88F] px-4 py-1 text-xs font-bold text-[#173C34]">
                    MOST POPULAR
                </div>
                )}
            <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                    plan.highlighted
                    ? "bg-[#79A88F] text-[#173C34]"
                    : "bg-white/5 text-[#79A88F]"
                }`}
                >
                <Icon size={26} strokeWidth={1.7} />
            </div>
            <p className="mt-8 text-xs font-bold tracking-[0.25em] text-[#8FAE9E]">
                {plan.type}
                </p>


                {/* PRICE */}
                <h3 className="mt-4 text-4xl font-bold text-white">
                {plan.price}
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                {plan.period}
                </p>


                {/* DESCRIPTION */}
                <p className="mt-6 leading-7 text-gray-400">
                {plan.description}
                </p>
                <div className="mt-8 space-y-4 border-t border-white/10 pt-7">
                

                </div>



                        </div>
                    )
                })}
            </div>
        </section>
    )
}