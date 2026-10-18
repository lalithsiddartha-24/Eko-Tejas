import { useEffect, useState } from "react";
import VehicleCard from "../Components/Vehiclecard";
import scooterImage from "../assets/Modern Mint-Accent Electric Scooter.png";

function Twowheeler() {
  const [twoWheelers, setTwoWheelers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/vehicles?category=two-wheeler")
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok || !payload.success || !Array.isArray(payload.data)) {
          throw new Error(payload.message || `HTTP ${response.status}`);
        }
        return payload.data;
      })
      .then((vehicles) => {
        setTwoWheelers(vehicles);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch two-wheelers:", error);
        setError("Failed to load vehicles. Please try again later.");
        setTwoWheelers([]);
        setLoading(false);
      });
  }, []);

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

        {loading ? (
          <div className="text-center text-[#173C34]">Loading vehicles...</div>
        ) : error ? (
          <div className="text-center text-[#FF0000]">{error}</div>
        ) : twoWheelers.length === 0 ? (
          <div className="text-center text-[#52635D]">No vehicles found.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {twoWheelers.map((vehicle) => ({
              ...vehicle,
              image: vehicle.image || scooterImage,
            })).map((vehicle, index) => (
              <VehicleCard
                key={vehicle.name}
                vehicle={vehicle}
                index={index}
                viewTo={`/vehicle-presentation/${encodeURIComponent(vehicle.name)}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Twowheeler;