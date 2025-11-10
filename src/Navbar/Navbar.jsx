import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Overlay from "./Overlay";
import { useAuth } from "../contexts/AuthContext";
import ManageMyBooking from "@/components/ui/ManageMyBooking";
import SignInBtn from "@/components/ui/SignInBtn";
import AccDropDown from "@/components/ui/AccDropDown";
import BurgerMenu from "@/components/ui/BurgerMenu";
import SearchBar from "@/Searchbars/SearchBar";

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { isAuthenticated, user } = useAuth();
    const location = useLocation()
    const [configStyle, setConfigStyle] = useState();
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        let exclusionList = ['/signin', "/profile", '/register', '/forgetpass', '/verify-otp', '/reset-password']
        setConfigStyle(exclusionList.indexOf(location.pathname) == -1
            ? "relative bg-black"
            : "absolute bg-black/0");
    }, [location.pathname]);

    useEffect(() => {
        console.log('ConfigStyle changed to:', configStyle);
    }, [configStyle]);


    return (
        <>
            {isMobile && (
                <>
                    <BurgerMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
                    <Overlay isMenuOpen={isMenuOpen} />
                </>
            )}

            <nav className={`w-full py-5 ${configStyle}`}>
                <div className="relative h-full top-0 z-20 container mx-auto px-6 py-4 flex items-center justify-between backdrop-blur-md bg-white/5 rounded-2xl border border-white/10">
                    {/* Brand */}
                    <Link
                        to="/"
                        className="text-2xl font-semibold tracking-wide text-amber-400 hover:text-amber-300 transition-colors"
                    >
                        ELYSIUM
                    </Link>
                    {/* <SearchBar/> */}
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
                                {isAuthenticated && user?.role === 'admin' && (
                                    <Link
                                        to="/admin/dashboard"
                                        className="hover:text-amber-400 transition-colors duration-200 font-semibold"
                                    >
                                        Admin
                                    </Link>
                                )}
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