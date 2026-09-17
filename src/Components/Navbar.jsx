import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/Group-1941.webp";

function Navbar({ onNavigate })
{
    const [menuOpen,setMenuOpen] = useState(false);

    const handleNavigate = (page) => {
        setMenuOpen(false);
        onNavigate(page);
    };

    return (
        <nav className = "sticky top-0 z-50 flex h-[76px] w-full items-center justify-between border-b border-black/5 bg-white/90 backdrop-blur-xs lg:px-16">
        <div className="flex items-center">
            <img
        src={logo}
        alt="Eko Tejas"
        className="h-12 w-auto object-contain"
        />
        </div>  
        <div className = "hidden items-center gap-7 lg:flex">
            <button type="button" onClick={() => handleNavigate("home")} className = "relative font-medium text-[#0B4B40] after:absolute after:-bottom-[27] after:left-0 after:h-[2px] after:w-full after:bg-[#73C96B]">
                Home
            </button>
            <button type="button" onClick={() => handleNavigate("twowheelers")} className = "flex items-center gap-1 font-medium text-gray-700 transition hover:text-[#0B4B40]">
                2-Wheelers
                <ChevronDown size={15} />
            </button>
        <button type="button" onClick={() => handleNavigate("vehicles")} className="flex items-center gap-1 font-medium text-gray-700 transition hover:text-[#0B4B40]">
        3-Wheelers
        <ChevronDown size={15} />
        </button>
        <button type="button" onClick={() => handleNavigate("home")} className = "font-medium text-gray-700 transition hover:text-[#0B4B40]">
            Become a Dealer
        </button>
        </div>
        <div className="flex items-center gap-4">

        <button className="hidden items-center gap-2 rounded-full bg-[#073D34] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-[#0E5A4D] hover:shadow-lg sm:flex">
        Book a Test Ride
        <ArrowUpRight size={17} />
        </button>

        {/* Mobile menu button */}
        <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex lg:hidden"
        aria-label="Toggle menu"
        >
        {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
    </div>
      {/* MOBILE MENU */}
        {menuOpen && (
        <div className="absolute left-0 top-[76px] flex w-full flex-col gap-5 border-t border-gray-100 bg-white px-6 py-8 shadow-xl lg:hidden">
        <button type="button" onClick={() => handleNavigate("home")} className="text-left">
            Home
        </button>

        <button type="button" onClick={() => handleNavigate("twowheelers")} className="text-left">
            2-Wheelers
        </button>

        <button type="button" onClick={() => handleNavigate("vehicles")} className="text-left">
            3-Wheelers
        </button>

        <button type="button" onClick={() => handleNavigate("home")} className="text-left">
            Become a Dealer
        </button>

        <button className="flex w-fit items-center gap-2 rounded-full bg-[#073D34] px-5 py-3 text-sm font-semibold text-white">
            Book a Test Ride
            <ArrowUpRight size={17} />
        </button>

        </div>
    )}
        </nav>
    )
}
export default Navbar;
