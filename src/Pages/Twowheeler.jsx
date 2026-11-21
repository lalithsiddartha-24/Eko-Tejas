import trafficImage from "../assets/two-wheeler-traffic.webp";
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
      image={trafficImage}
      imageAlt="A smiling rider on an emerald-green electric scooter weaving through heavy city traffic"
      // The scooter is in the centre of this photo, so anchor the photo to
      // the right on desktop to keep the scooter out from behind the title.
      imagePlacement="right"
    />
  );
}

export default Twowheeler;
