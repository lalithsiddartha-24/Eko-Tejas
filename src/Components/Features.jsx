import {
    IndianRupee,
    MapPin,
    Settings,
    Wrench,
} from "lucide-react";

const features = [
  {
    icon: IndianRupee,
    title: "Cost Efficient",
    description: "Lower running costs for smarter mobility",
  },
  {
    icon: Wrench,
    title: "65 Professional Mechanics",
    description: "Skilled technicians ready to support your vehicle",
  },
  {
    icon: Settings,
    title: "941 Spare Parts",
    description: "A wide range of spare parts for reliable maintenance",
  },
  {
    icon: MapPin,
    title: "Easy Service Access",
    description: "Reliable support whenever you need it",
  },
];
function FeatureStrip() {
  return (
    <section className="border-y border-[#0B4B40]/10 bg-white">
    <div className="mx-auto grid max-w-8xl grid-cols-1 divide-y divide-[#0B4B40]/10 px-6 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4 lg:px-16">
        
        {features.map((feature) => {
        const Icon = feature.icon;

        return (
        <div
            key={feature.title}
            className="flex items-center gap-4 py-7 md:px-6"
            >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF3EE] text-[#0B4B40]">
                <Icon size={22} strokeWidth={1.8} />
            </div>

            <div>
                <h3 className="font-bold text-[#173C34]">
                {feature.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                {feature.description}
                </p>
            </div>
        </div>
        );
        })}
    </div>
    </section>
);
}

export default FeatureStrip;