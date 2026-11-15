import { Navigate, Route, Routes } from "react-router-dom";
import Contact from "./Components/Contact";
import Coreservice from "./Components/Coreservice";
import Features from "./Components/Features";
import Footer from "./Components/Footer";
import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar";
import ScrollManager from "./Components/ScrollManager";
import Service from "./Components/Service";
import Vehiclecards from "./Components/Vehiclecards";
import Threewheeler from "./Pages/Threewheeler";
import Twowheeler from "./Pages/Twowheeler";
import VehiclePresentation from "./Pages/VehiclePresentation";

function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
      <Vehiclecards />
      <Service />
      <Coreservice />
      <Contact />
    </main>
  );
}

function App() {
  return (
    // `flex min-h-svh flex-col` + `flex-1` on the content keeps the footer at
    // the bottom of the screen even on short pages (like an error page).
    <div className="flex min-h-svh flex-col">
      <ScrollManager />
      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/twowheelers" element={<Twowheeler />} />
          <Route path="/vehicles" element={<Threewheeler />} />
          <Route path="/vehicle-presentation/:vehicleCategory/:vehicleName" element={<VehiclePresentation />} />
          <Route path="/vehicle-presentation/:vehicleName" element={<VehiclePresentation />} />
          <Route path="/vehicle-presentation" element={<VehiclePresentation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
