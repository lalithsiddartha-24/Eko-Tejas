import { ArrowRight, Leaf, MapPin, Play, Zap } from "lucide-react";

function Hero({ onNavigate }) {
return (
    <section
    id="home"
    className="relative min-h-[calc(100vh-76px)] overflow-hidden bg-[#F4F7F3]"
    >
    
      {/* Background decorative circles */}
    <div className="absolute right-[5%] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full border border-[#0B4B40]/10" />

    <div className="absolute right-[-8%] top-1/2 h-[700px] w-[700px] -translate-y-1/2 rounded-full border border-[#0B4B40]/10" />

      {/* Main Content */}
    <div className="relative z-10 mx-auto flex min-h-[calc(100vh-76px)] max-w-7xl items-center px-6 py-16 md:px-10 lg:px-16">

        {/* LEFT SIDE */}
        <div className="w-full lg:w-1/2">

          {/* Small Label */}
        <p className="mb-5 text-xs font-bold tracking-[0.3em] text-[#31705F]">
            INDIA'S HOMEGROWN EV BRAND
        </p>

          {/* Main Heading */}
        <h1 className="text-6xl font-bold leading-[0.95] tracking-tight text-[#10251F] md:text-7xl lg:text-8xl">
            The future is
            <span className="block bg-gradient-to-r from-[#0B4B40] to-[#73C96B] bg-clip-text text-transparent">
            Electric
            </span>
        </h1>

          {/* Subtitle */}
        <p className="mt-6 text-xl font-semibold text-[#263A34]">
            Clean. Powerful. Made for a better tomorrow.
        </p>

          {/* Description */}
        <p className="mt-4 max-w-xl leading-7 text-gray-600">
            Ekotejas is building a greener India with high-performance
            electric vehicles designed for people, businesses, and the planet.
        </p>
          {/* Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">

            <button type="button" onClick={() => onNavigate("vehicles")} className="flex items-center gap-2 rounded-full bg-[#073D34] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-[#0E5A4D]">
            Explore Our Vehicles
            <ArrowRight size={18} />
            </button>
            <button className="flex items-center gap-3 rounded-full border border-[#0B4B40]/20 bg-white px-5 py-3.5 text-sm font-semibold text-[#173C34] transition hover:bg-[#EAF1EC]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0B4B40] text-white">
                <Play size={13} fill="currentColor" />
            </span>
            Play Video
            </button>

        </div>

          {/* Stats */}
        <div className="mt-14 flex flex-wrap gap-8">

            <Stat
                icon={<Leaf size={24} />}
            value="10,000+"
            label="Happy Customers"
            />

            <Stat
            icon={<Zap size={24} />}
            value="0+"
            label="Tons CO₂ Saved"
            />

            <Stat
            icon={<MapPin size={24} />}
            value="10+"
            label="Cities Reached"
            />

        </div>

        </div>


        {/* RIGHT SIDE - Temporary placeholder */}
        <div className="relative hidden h-[500px] w-1/2 items-center justify-center lg:flex">

          <div className="flex h-[380px] w-[380px] flex-col items-center justify-center rounded-full border border-[#0B4B40]/10 bg-[#DCE9DF] shadow-2xl">
            <Zap
              size={100}
              strokeWidth={1}
              className="text-[#31705F]"
            />

            <p className="mt-4 text-xs font-bold tracking-[0.3em] text-[#31705F]">
              ELECTRIC MOBILITY
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}


/* Reusable Stat Component */

function Stat({ icon, value, label }) {
  return (
    <div className="flex items-center gap-3">

    <div className="text-[#28614F]">
        {icon}
    </div>

      <div>
        <h3 className="text-2xl font-bold text-[#173C34]">
          {value}
        </h3>

        <p className="text-xs text-gray-500">
          {label}
        </p>
      </div>

    </div>
  );
}

export default Hero;