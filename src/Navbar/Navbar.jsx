import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Overlay from "./Overlay";
import { useAuth } from "../contexts/AuthContext";
import ManageMyBooking from "@/components/ui/ManageMyBooking";
import SignInBtn from "@/components/ui/SignInBtn";
import AccDropDown from "@/components/ui/AccDropDown";
import BurgerMenu from "@/components/ui/BurgerMenu";

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);



    return (
        <>
            {isMobile && (
                <>
                    <BurgerMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
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
                                {!isAuthenticated ? (
                                    <SignInBtn />
                                ) : (
                                <>
                                    <AccDropDown />
                                    <ManageMyBooking />
                                </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}

export default Navbar;