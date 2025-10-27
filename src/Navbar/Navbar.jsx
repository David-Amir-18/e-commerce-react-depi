import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Overlay from "./Overlay";

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function toggleMenu() {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <>
            {isMobile && (
                <>
                    <button
                        onClick={toggleMenu}
                        className={`flex items-center rounded-full top-6 right-8 z-150 text-white transition-all duration-300 hover:bg-white hover:text-amber-400 ${isMenuOpen ? "bg-white text-amber-400 fixed" : "absolute"}`}
                        aria-label="Toggle menu"
                    >
                        <div className={`w-[40px] h-[40px] flex flex-col items-center justify-center space-y-1 rounded-full transition-all duration-300 ${isMenuOpen ? "pb-[11.5147px]" : ""}`}>
                            <span
                                className={`w-6 h-0.5 bg-amber-500 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-3' : ''}`}
                            ></span>
                            <span
                                className={`w-6 h-0.5 bg-amber-500 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}
                            ></span>
                            <span
                                className={`w-6 h-0.5 bg-amber-500 transition-all duration-300 ${isMenuOpen ? '-rotate-45 ' : ''}`}
                            ></span>
                        </div>
                    </button>
                    <Overlay isMenuOpen={isMenuOpen} />
                </>
            )}

            <nav className="absolute top-0 z-20 w-full py-6 md:py-8 backdrop-blur-md bg-black/30">
                <div className="container mx-auto px-8 flex items-center justify-between">
                    {/* Brand */}
                    <Link
                        to="/"
                        className="text-2xl font-semibold tracking-wide text-amber-400 hover:text-amber-300 transition-colors"
                    >
                        LADEN
                    </Link>

                    {/* Desktop Menu */}
                    {!isMobile && (
                        <div className="flex items-center justify-between w-[70%] text-sm text-white">
                            {/* Nav Links */}
                            <div className="flex sm:w-[220px] lg:w-[300px] justify-between">
                                <Link
                                    to="/deals"
                                    className="hover:text-amber-400 transition-colors duration-200"
                                >
                                    Deals
                                </Link>
                                <Link
                                    to="/contact"
                                    className="hover:text-amber-400 transition-colors duration-200"
                                >
                                    Contact
                                </Link>
                                <Link
                                    to="/about"
                                    className="hover:text-amber-400 transition-colors duration-200"
                                >
                                    About
                                </Link>
                            </div>

                            {/* Right Side */}
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/signin"
                                    className="px-4 py-2 hover:text-amber-400 transition-colors duration-200"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/booking"
                                    className="px-5 py-2 rounded-full border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-300"
                                >
                                    Manage my booking
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}

export default Navbar;