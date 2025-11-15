import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ManageMyBooking from "@/components/ui/ManageMyBooking";
import SignInBtn from "@/components/ui/SignInBtn";
import AccDropDown from "@/components/ui/AccDropDown";
import AccInlineMenu from "@/components/ui/AccInlineMenu";
import Logo from "./../../public/Elysium Wings.png"
function Overlay({ isMenuOpen }) {
  const { isAuthenticated, user } = useAuth();
  return (
    <div className={`inset-shadow-black fixed top-0 right-0 z-50 w-full h-full transform transition-all duration-600 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} backdrop-blur-md bg-[#ffffff12]`}>
      <div className="flex flex-col items-center justify-center h-[100vh] gap-12 text-white text-[16px]">
        <img src={Logo} width={100}></img>
        <div className="flex flex-col items-center justify-center space-y-8 text-white text-[16px] m-0">
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
        </div>
        <div className="flex flex-col items-center justify-center space-y-8 text-white text-[16px] m-0">
          <Link to="/" className="bg-[#ffffff12] rounded-full w-25 py-2 text-center backdrop-blur-3xl shadow-[0px_0px_30px_transparent] transition-all hover:cursor-pointer hover:bg-amber-300 hover:text-black">
            Home
          </Link>
          <Link to="/about" className="bg-[#ffffff12] rounded-full w-25 py-2 text-center backdrop-blur-3xl shadow-[0px_0px_30px_transparent] transition-all hover:cursor-pointer hover:bg-amber-300 hover:text-black">
            Deals
          </Link>
          <Link to="/services" className="bg-[#ffffff12] rounded-full w-25 py-2 text-center backdrop-blur-3xl shadow-[0px_0px_30px_transparent] transition-all hover:cursor-pointer hover:bg-amber-300 hover:text-black">
            Support
          </Link>
          {isAuthenticated && user?.role === 'admin' && (
            <Link
              to="/admin/dashboard"
              className="bg-[#ffffff12] font-bold text-amber-300 rounded-full w-25 py-2 text-center backdrop-blur-3xl shadow-[0px_0px_30px_transparent] transition-all hover:cursor-pointer hover:bg-amber-300 hover:text-black"
            >
              Admin
            </Link>
            )}
        </div>
      </div>
    </div>
  );
}
export default Overlay;