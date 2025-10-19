import { Link } from "react-router-dom";

function Overlay({ isMenuOpen }) {
  return (
    <div className={`inset-shadow-black fixed top-0 right-0 z-100 w-full h-full transform transition-all duration-600 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} backdrop-blur-md bg-[#ffffff12]`}>
      <div className="flex flex-col items-center justify-center h-[100vh] space-y-8 text-white text-[16px]">
        <Link to="/" className="bg-[#ffffff12] rounded-full w-25 py-2 text-center backdrop-blur-3xl shadow-[0px_0px_30px_transparent] transition-all hover:cursor-pointer hover:bg-amber-500">
          Home
        </Link>
        <Link to="/about" className="bg-[#ffffff12] rounded-full w-25 py-2 text-center backdrop-blur-3xl shadow-[0px_0px_30px_transparent] transition-all hover:cursor-pointer hover:bg-amber-500">
          Deals
        </Link>
        <Link to="/services" className="bg-[#ffffff12] rounded-full w-25 py-2 text-center backdrop-blur-3xl shadow-[0px_0px_30px_transparent] transition-all hover:cursor-pointer hover:bg-amber-500">
          Support
        </Link>
      </div>
    </div>
  );
}
export default Overlay;