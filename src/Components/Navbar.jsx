import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/Group-1941.webp";
function Navbar()
{
    const [menuOpen,setMenuOpen] = useState(false);
    return (
        <nav className = "relative z-50 flex h-[76px] items-center justify-between border-b border-black/5 bh-white lg:px-16">
        <div className="flex items-center">
            <img
        src={logo}
        alt="Eko Tejas"
        className="h-12 w-auto object-contain"
        />
        </div>
        <div className = "hidden items-center gap-7 lg:flex">
            <a href = "#home"  className = "relative font-medium text-[#0B4B40] after:absolute after:-bottom-[27] after:left-0 after:h-[2px] after:w-full after:bg-[#73C96B]">
                Home
            </a>
            <a href = "#about" className  ="font-medium text-gray-700 transition hover:text-[#0B4B40]"></a>
            <button className = "flex items-center gap-1 font-medium text-gray-700 transition hover:text-[#0B4B40]">
                2-Wheelers
                <ChevronDown size={15} />
            </button>
        <button className="flex items-center gap-1 font-medium text-gray-700 transition hover:text-[#0B4B40]">
        3-Wheelers
        <ChevronDown size={15} />
        </button>
        <a href = "#media" className = "font-medium text-gray-700 transition hover:text-[#0B4B40]"></a>
        <a
        href="#dealer"
        className="font-medium text-gray-700 transition hover:text-[#0B4B40]"
        >
        Become a Dealer
        </a>
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
        <a href="#home" onClick={() => setMenuOpen(false)}>
            Home
        </a>

        <a href="#about" onClick={() => setMenuOpen(false)}>
            About
        </a>

        <a href="#vehicles" onClick={() => setMenuOpen(false)}>
            2-Wheelers
        </a>

        <a href="#vehicles" onClick={() => setMenuOpen(false)}>
            3-Wheelers
        </a>

        <a href="#media" onClick={() => setMenuOpen(false)}>
            Media
        </a>

        <a href="#dealer" onClick={() => setMenuOpen(false)}>
            Become a Dealer
        </a>

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
