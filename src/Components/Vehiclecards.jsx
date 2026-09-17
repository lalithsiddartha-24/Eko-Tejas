import { ArrowUpRight, Bike, Truck } from "lucide-react";
import { Link } from "react-router-dom";
const vehicles = [
{
    category: "2-WHEELERS",
    title: "Electric Two Wheelers",
    description:
    "Smart, efficient and powerful electric mobility designed for everyday journeys.",
    icon: Bike,
    number: "01",
},
{
    category: "3-WHEELERS",
    title: "Electric Three Wheelers",
    description:
    "Reliable and cost-efficient electric vehicles built for businesses and urban mobility.",
    icon: Truck,
    number: "02",
},
];
function Vehiclecards()
{
    return (
        <section  id = "vehicles" className="bg-[#F4F7F3] px-6 py-24 md:px-10 lg:px-16">
    <div className="mt-14 grid gap-6 lg:grid-cols-2">
    {vehicles.map((vehicle) => {
            const Icon = vehicle.icon;

            return (
            <div
                key={vehicle.category}
                className="group relative overflow-hidden rounded-3xl border border-[#0B4B40]/10 bg-white p-8 transition duration-500 hover:-translate-y-2 hover:shadow-2xl md:p-10"
            >

                {/* BACKGROUND NUMBER */}
                <span className="absolute right-8 top-5 text-8xl font-bold text-[#0B4B40]/5">
                {vehicle.number}
                </span>


                {/* VEHICLE ICON */}
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EAF3EE] text-[#0B4B40] transition duration-500 group-hover:scale-110">
                <Icon size={38} strokeWidth={1.4} />
                </div>


                {/* VEHICLE CONTENT */}
                <p className="mt-10 text-xs font-bold tracking-[0.25em] text-[#31705F]">
                {vehicle.category}
                </p>

                <h3 className="mt-3 text-3xl font-bold text-[#173C34]">
                {vehicle.title}
                </h3>

                <p className="mt-4 max-w-md leading-7 text-gray-600">
                {vehicle.description}
                </p>


                {/* EXPLORE BUTTON */}
                <Link
                to={vehicle.category === "2-WHEELERS" ? "/twowheelers" : "/vehicles"}
                className="mt-8 inline-flex items-center gap-2 font-semibold text-[#0B4B40]"
                >
                Explore Vehicles

                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0B4B40]/20 transition duration-300 group-hover:bg-[#0B4B40] group-hover:text-white">
                    <ArrowUpRight size={17} />
                </span>
                </Link>

            </div>
            );
            })}
            </div>
        </section>
    );
}
export default Vehiclecards;