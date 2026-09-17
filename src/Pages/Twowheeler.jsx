import VehicleCard from "../Components/Vehiclecard";
const twoWheelers = [
  {
    name: "Axel",
    tagline: "Everyday Freedom",
    range: "95 km",
    power: "2.3 kW",
  },
  {
    name: "Axel Pro",
    tagline: "More Power",
    range: "120 km",
    power: "2.8 kW",
  },
  {
    name: "Era",
    tagline: "Urban Companion",
    range: "110 km",
    power: "2.5 kW",
  },
  {
    name: "Era Pro",
    tagline: "Next Level Rides",
    range: "135 km",
    power: "3.1 kW",
  },
  {
    name: "Reco",
    tagline: "Reliable & Efficient",
    range: "100 km",
    power: "2.4 kW",
  },
  {
    name: "Prive",
    tagline: "Premium Comfort",
    range: "125 km",
    power: "2.9 kW",
  },
  {
    name: "EVXTRO",
    tagline: "Built for Performance",
    range: "140 km",
    power: "3.5 kW",
  },
  {
    name: "Dyroth",
    tagline: "Bold by Design",
    range: "130 km",
    power: "3.0 kW",
  },
  {
    name: "RUGD 12",
    tagline: "Made for More",
    range: "150 km",
    power: "3.7 kW",
  },
];

function Twowheeler() {
  return (
    <section id="two-wheelers" className="bg-[#F4F7F3] px-6 py-24 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center md:text-left">
          <p className="text-xs font-bold tracking-[0.25em] text-[#31705F] uppercase">
            2-Wheelers
          </p>
          <h2 className="mt-4 text-3xl font-bold text-[#173C34] md:text-5xl">
            Ride Smart. Ride Electric.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {twoWheelers.map((vehicle, index) => (
            <VehicleCard
              key={vehicle.name}
              vehicle={vehicle}
              index={index}
              viewTo="/twowheelers"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Twowheeler;