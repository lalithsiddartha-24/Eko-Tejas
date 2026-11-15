import VehicleListing from "../Components/VehicleListing";

/*
 * Same layout as the two-wheeler page; only the text and category differ.
 * Data comes from GET /api/vehicles?category=three-wheeler.
 */
function Threewheeler() {
  return (
    <VehicleListing
      category="three-wheeler"
      eyebrow="Electric 3-wheelers"
      title="Built for every"
      accent="business."
      description="Reliable three-wheelers for passenger mobility, commercial transport and everyday business needs."
      detailPath={(vehicle) => `/vehicle-presentation/three-wheeler/${encodeURIComponent(vehicle.name)}`}
    />
  );
}

export default Threewheeler;
