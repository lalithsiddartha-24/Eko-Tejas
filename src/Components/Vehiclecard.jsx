import { Link } from "react-router-dom";

function VehicleCard({ vehicle, index, viewTo = "/vehicles" }) {
return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#0B4B40]/10 bg-white p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl md:p-8">

    <span className="text-6xl font-bold text-[#0B4B40]/10">
        {String(index + 1).padStart(2, "0")}
    </span>

    <div className="mt-6 flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-[#F4F7F3]">
        {vehicle.image ? (
        <img
            src={vehicle.image}
            alt={vehicle.name}
            className="h-full w-full object-contain"
        />
        ) : (
        <span className="text-sm font-medium text-[#79A88F]">
            Vehicle Image
        </span>
        )}
    </div>
    <div className="mt-8">
        <h3 className ="text-2xl font-bold text-[#173C34]">
            {vehicle.name}
        </h3>
    <p className="mt-1 text-sm text-[#52635D]">
    {vehicle.tagline}
        </p>
    </div>
    <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#0B4B40]/10 pt-5">
        <div>
            <p className="text-xs text-[#52635D]">Power</p>
            <p className="mt-1 font-semibold text-[#173C34]">
                {vehicle.power}
            </p>
        </div>
        <div>
            <p className="text-xs text-[#52635D]">Range</p>
            <p className="mt-1 font-semibold text-[#173C34]">
                {vehicle.range}
            </p>
        </div>
    </div>
    <div className="mt-auto grid grid-cols-1 gap-3 pt-6 sm:grid-cols-2">
        <Link to={viewTo} className="rounded-full bg-[#0B4B40] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#173C34]">
            View
        </Link>

        <button className="rounded-full border border-[#0B4B40]/20 px-4 py-3 text-sm font-semibold text-[#0B4B40] transition hover:bg-[#F4F7F3]">
        View Quotation
        </button>
</div>
</article>
);
}

export default VehicleCard;