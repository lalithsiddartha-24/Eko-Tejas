import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Contact from "./Components/Contact";
import Coreservice from "./Components/Coreservice";
import Features from "./Components/Features";
import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar";
import Service from "./Components/Service";
import Vehicle from "./Components/Vehicle";
import Vehiclecards from "./Components/Vehiclecards";
import Threewheeler from "./Pages/Threewheeler";
import Twowheeler from "./Pages/Twowheeler";

function App() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar onNavigate={(page) => navigate(`/${page === "home" ? "" : page}`)} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero onNavigate={(page) => navigate(`/${page}`)} />
              <Features />
              <Vehicle />
              <Vehiclecards />
              <Service />
              <Coreservice />
              <Contact />
            </>
          }
        />
        <Route path="/twowheelers" element={<Twowheeler />} />
        <Route path="/vehicles" element={<Threewheeler />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;