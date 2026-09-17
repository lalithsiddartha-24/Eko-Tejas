import VehicleCard from "../Components/Vehiclecard";

const threeWheelers = [
  {
    name: "RUGD 100",
    tagline: "Smart Urban Mobility",
    image: "",
    range: "120 km",
    power: "8 kW",
  },
  {
    name: "RUGD 120",
    tagline: "Efficient & Reliable",
    image: "",
    range: "140 km",
    power: "10 kW",
  },
  {
    name: "RUGD 121",
    tagline: "Built for Business",
    image: "",
    range: "130 km",
    power: "9 kW",
  },
  {
    name: "RUGD 122",
    tagline: "Power Meets Efficiency",
    image: "",
    range: "150 km",
    power: "10 kW",
  },
  {
    name: "RUGD 123",
    tagline: "Everyday Commercial Mobility",
    image: "",
    range: "140 km",
    power: "11 kW",
  },
  {
    name: "RUGD 124",
    tagline: "Designed for Performance",
    image: "",
    range: "160 km",
    power: "12 kW",
  },
  {
    name: "RUGD 150",
    tagline: "Heavy Duty Mobility",
    image: "",
    range: "150 km",
    power: "12 kW",
  },
  {
    name: "RUGD 151",
    tagline: "Reliable Business Partner",
    image: "",
    range: "155 km",
    power: "13 kW",
  },
  {
    name: "RUGD 152",
    tagline: "Made for More",
    image: "",
    range: "165 km",
    power: "14 kW",
  },
  {
    name: "METRO",
    tagline: "Urban Passenger Mobility",
    image: "",
    range: "140 km",
    power: "10 kW",
  },
  {
    name: "ICE – 121",
    tagline: "Practical & Powerful",
    image: "",
    range: "130 km",
    power: "9 kW",
  },
  {
    name: "ICE – 122",
    tagline: "Built for Everyday Business",
    image: "",
    range: "145 km",
    power: "10 kW",
  },
  {
    name: "RUGD 153",
    tagline: "Next Generation Mobility",
    image: "",
    range: "170 km",
    power: "14 kW",
  },
  {
    name: "FOOD CART",
    tagline: "Mobile Business Solution",
    image: "",
    range: "120 km",
    power: "8 kW",
  },
];

function ThreeWheelerSection() {
  return (
    <section
      id="three-wheelers"
      className="bg-[#F4F7F3] px-6 py-24 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.3em] text-[#31705F]">
            THREE WHEELERS
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#173C34] md:text-5xl lg:text-6xl">
            Built for every
            <span className="block text-[#31705F]">
              business.
            </span>
          </h2>

          <p className="mt-6 max-w-xl leading-7 text-[#52635D]">
            Discover reliable and efficient three-wheeler solutions designed
            for passenger mobility, commercial transportation, and everyday
            business needs.
          </p>
        </div>

        {/* Vehicle Grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {threeWheelers.map((vehicle, index) => (
            <VehicleCard
              key={vehicle.name}
              vehicle={vehicle}
              index={index}
              viewTo="/vehicles"
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default ThreeWheelerSection;