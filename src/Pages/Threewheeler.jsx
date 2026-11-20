import bananaMarketImage from "../assets/three-wheeler-banana-market.webp";
import VehicleListing from "../Components/VehicleListing";

/*
 * Same layout as the two-wheeler page; only the text, category and the
 * header photo (the black-and-white market shot with the green trolley) differ.
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
      image={bananaMarketImage}
      imageAlt="A smiling driver speeds an electric cargo three-wheeler loaded with bananas past a market"
    />
  );
}

export default Threewheeler;
