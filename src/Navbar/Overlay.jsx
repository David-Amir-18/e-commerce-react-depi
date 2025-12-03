import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SignInBtn from "@/components/ui/SignInBtn";
import AccDropDown from "@/components/ui/AccDropDown";
import AccInlineMenu from "@/components/ui/AccInlineMenu";
import Logo from "./../../public/Elysium Wings.png";

function Sidebar({ isMenuOpen, setIsMenuOpen }) {
  const { isAuthenticated, user } = useAuth();
  const closeMenu = () => setIsMenuOpen(false)
  return (
    <>
      <div
        className={`fixed inset-0 z-40 backdrop-blur-sm bg-black/30 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => closeMenu()}
      />

      <div
        className={`fixed top-0 right-full z-50 h-full w-75 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-full' : 'translate-x-0'
          }`}
        onClick={() => closeMenu()}
      >
        <div className="h-full px-8 py-12 bg-black/70 backdrop-blur-md">

          <nav className="flex flex-col space-y-4">
            <div className="flex justify-center mb-12">
              <img src={Logo} width={100} alt="Elysium Wings" />
            </div>

            {isAuthenticated ? (
              <>
                <div className="hidden md:block">
                  <AccDropDown />
                </div>
                <div className="block md:hidden">
                  <AccInlineMenu />
                </div>
              </>
            ) : (
              <SignInBtn />
            )}

            <Link
              onClick={() => closeMenu()}
              to="/"
              className="bg-white/20 rounded-lg w-full py-3 text-center backdrop-blur-3xl text-white text-[16px] transition-all hover:bg-amber-400 hover:text-black"
            >
              Home
            </Link>
            <Link
              onClick={() => closeMenu()}
              to="/about"
              className="bg-white/20 rounded-lg w-full py-3 text-center backdrop-blur-3xl text-white text-[16px] transition-all hover:bg-amber-400 hover:text-black"
            >
              About
            </Link>
            <Link
              onClick={() => closeMenu()}
              to="/contact"
              className="bg-white/20 rounded-lg w-full py-3 text-center backdrop-blur-3xl text-white text-[16px] transition-all hover:bg-amber-400 hover:text-black"
            >
              Contact
            </Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                onClick={() => closeMenu()}
                to="/admin/dashboard"
                className="bg-white/20 font-bold text-amber-300 rounded-lg w-full py-3 text-center backdrop-blur-3xl transition-all hover:bg-amber-400 hover:text-black"
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;