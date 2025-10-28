import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import Overlay from "./Overlay";
import { useAuth } from "../contexts/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

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

    function handleProfileClick() {
        navigate('/profile');
    }

    function handleLogout() {
        logout();
        navigate('/');
    }

    function getInitial() {
        if (user?.name) {
            return user.name.charAt(0).toUpperCase();
        }
        return 'U';
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

            <nav className="absolute top-0 z-20 w-full py-8 flex items-center justify-center">
                <div className="container px-8 flex items-center justify-between">
                    <Link className="text-white mr-auto md:mr-0 hover:cursor-pointer transition-colors hover:text-amber-400" to="/">TailWing</Link>
                    {!isMobile && (
                        <div className="text-white w-[70%] flex items-center justify-between">
                            <div className="flex sm:w-[200px] lg:w-[300px] justify-between">
                                <Link className="hover:cursor-pointer transition-colors hover:text-amber-400" to="/deals">Deals</Link>
                                <Link className="hover:cursor-pointer transition-colors hover:text-amber-400" to="/contact">Contact</Link>
                                <Link className="hover:cursor-pointer transition-colors hover:text-amber-400" to="/about">About</Link>
                            </div>

                            <div className="flex items-center gap-4">
                                {!isAuthenticated ? (
                                    <Link
                                        className="text-white hover:bg-amber-500 hover:scale-110 transition-all px-4 py-2 bg-amber-400 rounded-full border border-white"
                                        to="/signin"
                                    >
                                        Sign In
                                    </Link>
                                ) : (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button
                                                className="w-10 h-10 rounded-full bg-amber-400 text-white font-semibold flex items-center justify-center hover:bg-amber-500 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                                                aria-label="User profile menu"
                                            >
                                                {getInitial()}
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="end"
                                            className="w-56 bg-slate-800 border-amber-400/20 text-white"
                                        >
                                            <div className="px-2 py-1.5 text-sm">
                                                <p className="font-semibold text-amber-400">{user?.name}</p>
                                                <p className="text-xs text-gray-400">{user?.email}</p>
                                            </div>
                                            <DropdownMenuSeparator className="bg-amber-400/20" />
                                            <DropdownMenuItem
                                                onClick={handleProfileClick}
                                                className="cursor-pointer focus:bg-amber-400/10 focus:text-amber-400"
                                            >
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Profile</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-amber-400/20" />
                                            <DropdownMenuItem
                                                onClick={handleLogout}
                                                className="cursor-pointer focus:bg-red-500/10 focus:text-red-400"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Log out</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                                <Link
                                    className="bg-[#ffffff1e] px-4 py-2 border rounded-full transition-all hover:bg-amber-400 hover:border-amber-400"
                                    to="/booking"
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