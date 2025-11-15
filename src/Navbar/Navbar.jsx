import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Overlay from "./Overlay";
import { useAuth } from "../contexts/AuthContext";
import ManageMyBooking from "@/components/ui/ManageMyBooking";
import SignInBtn from "@/components/ui/SignInBtn";
import AccDropDown from "@/components/ui/AccDropDown";
import BurgerMenu from "@/components/ui/BurgerMenu";
import SearchBar from "@/Searchbars/SearchBar";
import logo from "../../public/Elysium Wings.svg"

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
        let exclusionList = ['/flights', "/profile", '', '', '', '']
        setConfigStyle(exclusionList.indexOf(location.pathname) != -1
            ? "absolute "
            : "fixed bg-black/0");
    }, [location.pathname]);

    useEffect(() => {
        console.log('ConfigStyle changed to:', configStyle);
    }, [configStyle]);


    return (
        <>
            <nav className={`w-full py-3 ${configStyle} z-20`}>
                <div className="relative h-full top-0 z-20 container mx-auto px-8">
                    {isMobile && (
                        <>
                            <BurgerMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
                            <Overlay isMenuOpen={isMenuOpen} />
                        </>
                    )}
                    <div className="px-6 py-4 flex items-center justify-between backdrop-blur-lg bg-white/10 rounded-2xl border border-white/10">
                        {/* Brand */}
                        <Link
                            to="/"
                            className="flex  items-center justify-center text-2xl font-semibold tracking-wide text-amber-400 hover:text-amber-300 transition-colors"
                        >
                            <img src={logo} width={50} className="mr-5" />
                            <h1 className="text-amber-300">Elysium</h1>
                        </Link>
                        {/* <SearchBar/> */}
                        {/* Desktop Menu */}
                        {/* Right Side */}
                        <div className="flex items-center gap-4">
                            {!isMobile && (
                                <div className="flex items-center justify-between text-sm text-white">
                                    {/* Nav Links */}
                                    <div className="flex sm:w-[300px] lg:w-[300px] justify-between items-center">
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
                                        {!isAuthenticated ? (
                                            <SignInBtn />
                                        ) : (
                                            <>
                                                <AccDropDown />
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;