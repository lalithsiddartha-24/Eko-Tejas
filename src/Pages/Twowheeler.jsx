import VehicleListing from "../Components/VehicleListing";

/*
 * This page only supplies its own words and API category.
 * All layout and data loading live in <VehicleListing>, shared with the
 * three-wheeler page. Data still comes from GET /api/vehicles?category=two-wheeler.
 */
function Twowheeler() {
  return (
    <VehicleListing
      category="two-wheeler"
      eyebrow="Electric 2-wheelers"
      title="Ride smart."
      accent="Ride electric."
      description="Scooters built for daily commutes and city errands: quiet, low-cost to run and easy to own."
      detailPath={(vehicle) => `/vehicle-presentation/${encodeURIComponent(vehicle.name)}`}
    />
  );
}

export default Twowheeler;
