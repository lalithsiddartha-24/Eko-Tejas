import { useEffect, useState } from "react";
import VehicleCard from "../Components/Vehiclecard";
import { readApiJson } from "../utils/api";

function ThreeWheelerSection() {
  const [threeWheelers, setThreeWheelers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/vehicles?category=three-wheeler")
      .then(async (response) => {
        const payload = await readApiJson(response);
        if (!payload.success || !Array.isArray(payload.data)) {
          throw new Error(payload.message || `HTTP ${response.status}`);
        }
        return payload.data;
      })
      .then((vehicles) => {
        setThreeWheelers(vehicles);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch three-wheelers:", error);
        setError("Failed to load vehicles. Please try again later.");
        setThreeWheelers([]);
        setLoading(false);
      });
  }, []);

  return (
    <section
      id="three-wheelers"
      className="bg-[#F4F7F3] px-6 py-24 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-bold tracking-[0.3em] text-[#31705F]">
            THREE WHEELERS
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[#173C34] md:text-5xl lg:text-6xl">
            Built for every
            <span className="block text-[#31705F]">business.</span>
          </h2>

          <p className="mt-6 max-w-xl leading-7 text-[#52635D]">
            Discover reliable and efficient three-wheeler solutions designed for
            passenger mobility, commercial transportation, and everyday business
            needs.
          </p>
        </div>

        {loading ? (
          <div className="mt-10 text-center text-[#173C34]">Loading vehicles...</div>
        ) : error ? (
          <div className="mt-10 text-center text-[#FF0000]">{error}</div>
        ) : threeWheelers.length === 0 ? (
          <div className="mt-10 text-center text-[#52635D]">No vehicles found.</div>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {threeWheelers.map((vehicle, index) => (
              <VehicleCard
                key={vehicle.name}
                vehicle={vehicle}
                index={index}
                viewTo={`/vehicle-presentation/three-wheeler/${encodeURIComponent(vehicle.name)}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ThreeWheelerSection;