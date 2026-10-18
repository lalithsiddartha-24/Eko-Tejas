import { Link } from "react-router-dom";
import scooterImage from "../assets/Modern Mint-Accent Electric Scooter.png";

function VehicleCard({ vehicle, index, viewTo = "/vehicles" }) {
  const imageSrc = vehicle.image || scooterImage;

  return (
    <article className="group flex h-full min-h-[520px] flex-col overflow-hidden rounded-[30px] border border-[#D9E5DE] bg-[#F5F8F6] p-4 shadow-[0_14px_35px_rgba(13,56,47,0.07)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(13,56,47,0.12)] md:p-5">
      <div className="flex items-center justify-between">
        <span className="text-4xl font-black tracking-[-0.08em] text-[#0B4B40]/10 md:text-5xl">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="rounded-full border border-[#0B4B40]/10 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#31705F]">
          EV
        </span>
      </div>

      <div className="mt-3 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#F4F8F5] via-[#EEF4F1] to-[#E7F0EB]">
        <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden">
          <img
            src={imageSrc}
            alt={vehicle.name}
            className="h-full w-full object-contain object-center transition duration-500 group-hover:scale-[1.04]"
            style={{ filter: "drop-shadow(0 18px 20px rgba(27, 45, 37, 0.12))" }}
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-[1.8rem] font-bold leading-none tracking-[-0.04em] text-[#173C34]">
          {vehicle.name}
        </h3>
        <p className="mt-2 text-sm text-[#52635D]">{vehicle.tagline}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#0B4B40]/10 pt-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#52635D]">Power</p>
          <p className="mt-2 text-base font-semibold text-[#173C34]">{vehicle.power}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#52635D]">Range</p>
          <p className="mt-2 text-base font-semibold text-[#173C34]">{vehicle.range}</p>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-1 gap-3 pt-6 sm:grid-cols-2">
        <Link
          to={viewTo}
          state={{ vehicle }}
          className="rounded-full bg-[#0B4B40] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#173C34]"
        >
          View
        </Link>

        <button className="rounded-full border border-[#0B4B40]/20 bg-white px-4 py-3 text-sm font-semibold text-[#0B4B40] transition hover:bg-[#F4F7F3]">
          View Quotation
        </button>
      </div>
    </article>
  );
}

export default VehicleCard;
