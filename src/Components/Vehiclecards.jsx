import { ArrowUpRight, Bike, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import scooterImage from "../assets/scooter_transparent.png";

const vehicles = [
  {
    category: "2-WHEELERS",
    title: "Electric Two Wheelers",
    description:
      "Smart, efficient and powerful electric mobility designed for everyday journeys.",
    icon: Bike,
    image: scooterImage,
    imagePosition: "left",
  },
  {
    category: "3-WHEELERS",
    title: "Electric Three Wheelers",
    description:
      "Reliable and cost-efficient electric vehicles built for businesses and urban mobility.",
    icon: Truck,
    imagePosition: "left",
  },
];

function Vehiclecards() {
  return (
    <section id="vehicles" className="bg-[#F4F7F3] px-6 py-24 md:px-10 lg:px-16">
      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {vehicles.map((vehicle) => {
          const Icon = vehicle.icon;
          const isScooterCard = vehicle.category === "2-WHEELERS";

          return (
            <div
              key={vehicle.category}
              className={[
                "group relative overflow-hidden rounded-[32px] border border-[#DDEAE2] p-7 transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(13,56,47,0.1)] md:p-8",
                "bg-white",
              ].join(" ")}
            >
              {isScooterCard ? (
                <div className="relative z-10 grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.25em] text-[#31705F]">
                      {vehicle.category}
                    </p>

                    <h3 className="mt-3 text-3xl font-bold leading-tight text-[#173C34] md:text-4xl">
                      {vehicle.title}
                    </h3>

                    <p className="mt-4 max-w-xs text-sm leading-6 text-gray-700">
                      {vehicle.description}
                    </p>

                    <Link
                      to="/twowheelers"
                      className="mt-8 inline-flex items-center gap-2 font-semibold text-[#0B4B40]"
                    >
                      Explore Vehicles
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0B4B40]/20 bg-white transition duration-300 group-hover:bg-[#0B4B40] group-hover:text-white">
                        <ArrowUpRight size={17} />
                      </span>
                    </Link>
                  </div>

                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white md:aspect-auto md:min-h-[380px]">
                    <img
                      src={vehicle.image}
                      alt="Electric scooter"
                      className="absolute inset-0 h-full w-full -translate-x-[32%] scale-[1.65] object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EAF3EE] text-[#0B4B40] transition duration-500 group-hover:scale-110">
                    <Icon size={38} strokeWidth={1.4} />
                  </div>

                  <div>
                    <p className="text-xs font-bold tracking-[0.25em] text-[#31705F]">
                      {vehicle.category}
                    </p>

                    <h3 className="mt-3 text-3xl font-bold text-[#173C34]">
                      {vehicle.title}
                    </h3>

                    <p className="mt-4 max-w-md leading-7 text-gray-600">
                      {vehicle.description}
                    </p>

                    <Link
                      to="/vehicles"
                      className="mt-8 inline-flex items-center gap-2 font-semibold text-[#0B4B40]"
                    >
                      Explore Vehicles
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#0B4B40]/20 transition duration-300 group-hover:bg-[#0B4B40] group-hover:text-white">
                        <ArrowUpRight size={17} />
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Vehiclecards;