function Coreservice() {
    const services = [
  {
    title: "FULL SERVICE",
    description:
      "Driving the Electric Future. Innovative EV models, sustainable technology, global charging solutions, and exceptional customer support.",
  },
  {
    title: "REGULAR SERVICE",
    description:
      "Premium EV servicing, maintenance, repairs, and expert support. Ensuring your electric vehicle stays efficient and reliable on the road.",
  },
  {
    title: "FORK SERVICE",
    description:
      "Specialized EV fork servicing for optimum performance. Certified technicians, genuine parts, and quick turnaround for a smooth and safe ride.",
  },
  {
    title: "MAJOR OVERHAUL",
    description:
      "New look, streamlined navigation, interactive tools, enhanced specs, eco-friendly features, and seamless user interface. Explore now!",
  },
  {
    title: "TUNE-UP",
    description:
      "Enhance your EV’s performance with our expert tune-up service. Optimize efficiency, extend range, and ensure a smooth, eco-friendly ride.",
  },
  {
    title: "PAINTING",
    description:
    "Transform your EV with a stunning new paint job. Choose from a range of vibrant colors and showcase your style on the road.",
},
];
return (
    <section id = "core-service" className=" bg-[#F4F7F3] px-6 py-24 md:px-10 lg:px-16">
        <div className = "mx-auto  max-w-7xl">
            <p className = "text-xs tracking-[0.3em] font-bold text-[#79A88F]">
                Core-Service
            </p>
            <h2 className = " mt-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Care for your
                <span className = "block text-[#79A88F]">
                    Future
                </span>
            </h2>
            <div className  = "mt-16 grid grid-rows-2 grid-cols-3 gap-6 ">
            {services.map((service, index) => (
            <div key={service.title}   className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 md:p-8 p-6 transition-all duration-500 hover:-translate-y-2 hover:border-[#79A88F]/50 hover:bg-white/10 hover:shadow-2xl min-h-[300px] flex flex-col mt-auto flex items-center justify-between"
>               <span className="text-6xl font-bold text-[#0B4B40]/10 transition-colors duration-500 group-hover:text-[#79A88F]/30">
                {String(index + 1).padStart(2, "0")}
                </span>
              <h3 className="mt-8 text-2xl font-bold text-[#173C34] transition-colors duration-300 group-hover:text-[#31705F]">
            {service.title}
              </h3>
                <p className = "mt-4 leading-7  text-gray-700">
                    {service.description}
                </p>
            </div>
))}
            </div>
        </div>
    </section>
  );
}

export default Coreservice;