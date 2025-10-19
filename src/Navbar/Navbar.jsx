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
                        className={`flex items-center rounded-full absolute top-2 right-8 z-150 text-white transition-all duration-300 hover:bg-white hover:text-amber-500 ${isMenuOpen ? "bg-white text-amber-500" : ""}`}
                        aria-label="Toggle menu"
                    >

                        <div className={`w-[40px] h-[40px] flex flex-col items-center justify-center space-y-1 rounded-full transition-all duration-300 ${isMenuOpen ? "pb-[11.5147px]" : ""}`}>
                            <span
                                className={`w-6 h-0.5 bg-amber-500 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-3' : ''
                                    }`}
                            ></span>
                            <span
                                className={`w-6 h-0.5 bg-amber-500 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''
                                    }`}
                            ></span>
                            <span
                                className={`w-6 h-0.5 bg-amber-500 transition-all duration-300 ${isMenuOpen ? '-rotate-45 ' : ''
                                    }`}
                            ></span>
                        </div>
                    </button>
                    <Overlay isMenuOpen={isMenuOpen} />
                </>
            )}

            <nav className="relative top-0 z-10 w-full py-8 flex items-center justify-center">
                <div className="container px-8 flex items-center justify-between">
                    <Link className="text-white mr-auto md:mr-0 hover:cursor-pointer transition-colors hover:text-amber-400" to="/">LADEN</Link>
                    {!isMobile && (
                        <div className="text-white w-[65.5%] flex items-center justify-between">
                            <div className="flex sm:w-[200px] lg:w-[300px] justify-between">
                                <Link className="hover:cursor-pointer transition-colors hover:text-amber-400" to="/">Home</Link>
                                <Link className="hover:cursor-pointer transition-colors hover:text-amber-400" to="/deals">Deals</Link>
                                <Link className="hover:cursor-pointer transition-colors hover:text-amber-400" to="/support">Support</Link>
                            </div>

                            <Link className="bg-[#ffffff1e] px-3 py-1 border rounded-full transition-all hover:bg-amber-400 hover:border-amber-400" to="/booking">Manage my booking</Link>
                        </div>
                    )}
                </div>

            </nav>
        </>
    );
}

export default Navbar;