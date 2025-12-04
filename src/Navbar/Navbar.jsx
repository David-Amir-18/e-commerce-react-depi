import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Overlay from "./Overlay";
import { useAuth } from "../contexts/AuthContext";
import ManageMyBooking from "@/components/ui/ManageMyBooking";
import SignInBtn from "@/components/ui/SignInBtn";
import AccDropDown from "@/components/ui/AccDropDown";
import BurgerMenu from "@/components/ui/BurgerMenu";
import logo from "../../public/Elysium Wings.svg"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  // const [configStyle, setConfigStyle] = useState();

  const [activeLinkIndex, setActiveLinkIndex] = useState(null);
  const [borderStyle, setBorderStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const linkRefs = useRef([]);
  const containerRef = useRef(null);

  const navbarRoutes = ['/contact', '/about', '/admin/dashboard'];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // useEffect(() => {
  //   let exclusionList = ['/flights', "/profile", '', '', '', '']
  //   setConfigStyle(exclusionList.indexOf(location.pathname) != -1
  //     ? "absolute "
  //     : "fixed bg-black/0");
  // }, [location.pathname]);

  // useEffect(() => {
  //   console.log('ConfigStyle changed to:', configStyle);
  // }, [configStyle]);

  useEffect(() => {
    const currentIndex = navbarRoutes.indexOf(location.pathname);

    if (currentIndex !== -1 && linkRefs.current[currentIndex] && containerRef.current) {
      setActiveLinkIndex(currentIndex);
      updateBorderPosition(currentIndex);
    } else {
      setBorderStyle(prev => ({ ...prev, opacity: 0 }));
      setActiveLinkIndex(null);
    }
  }, [location.pathname, isAuthenticated]);

  const updateBorderPosition = (index) => {
    if (linkRefs.current[index] && containerRef.current) {
      const link = linkRefs.current[index];
      const container = containerRef.current;

      const linkRect = link.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const left = linkRect.left - containerRect.left;
      const width = linkRect.width;

      setBorderStyle({
        left: left,
        width: width,
        opacity: 1
      });
    }
  };

  const handleLinkClick = (index) => {
    setActiveLinkIndex(index);
    updateBorderPosition(index);
  };

  useEffect(() => {
    if (activeLinkIndex !== null) {
      const handleResize = () => updateBorderPosition(activeLinkIndex);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [activeLinkIndex]);

  return (
    <>
      <nav className={`w-full absolute z-20`}>
        <div className="relative h-full top-0 z-20">
          {isMobile && (
            <>
              <BurgerMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              <Overlay isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            </>
          )}
          <div className="backdrop-blur-lg md:backdrop-blur-none w-full">

            <div className="container mx-auto px-8">
              <div className="py-4 flex items-center justify-between rounded-2xl ">
                <Link
                  to="/"
                  className="md:backdrop-blur-md md:py-4 md:px-8 md:border border-white/20 md:bg-white/5 rounded-xl max-md:rounded-full flex items-center justify-center text-2xl font-semibold tracking-wide text-amber-400 hover:text-amber-300 transition-all hover:backdrop-blur-3xl hover:bg-amber-500/60 hover:shadow-[0px_0px_35px] shadow-amber-500 max-md:p-2"
                >
                  <img src={logo} width={50} className="" />
                </Link>

                <div className="flex items-center gap-4">
                  {!isMobile && (
                    <div className="flex items-center justify-between text-sm text-white">
                      <div
                        ref={containerRef}
                        className="backdrop-blur-md bg-white/5 border border-white/15 rounded-xl px-8 py-5 flex sm:w-[300px] lg:w-[550px] justify-between items-center relative"
                      >
                        <div
                          className="absolute rounded-full bg-white/10 border border-white/20 transition-all duration-300 ease-out"
                          style={{
                            left: `${borderStyle.left - 15}px`,
                            width: `${borderStyle.width + 30}px`,
                            height: '36px',
                            top: '20px',
                            opacity: borderStyle.opacity,
                            pointerEvents: 'none'
                          }}
                        />

                        <Link
                          ref={el => linkRefs.current[0] = el}
                          to="/contact"
                          onClick={() => handleLinkClick(0)}
                          className={`hover:text-amber-400 transition-colors duration-200 relative z-10 ${activeLinkIndex === 0 ? 'text-amber-300' : ''
                            }`}
                          style={activeLinkIndex === 0 ? {
                            textShadow: '0 0 10px rgba(252, 211, 77, 0.8), 0 0 20px rgba(252, 211, 77, 0.4)'
                          } : {}}
                        >
                          Contact
                        </Link>
                        <Link
                          ref={el => linkRefs.current[1] = el}
                          to="/about"
                          onClick={() => handleLinkClick(1)}
                          className={`hover:text-amber-400 transition-colors duration-200 relative z-10 ${activeLinkIndex === 1 ? 'text-amber-300' : ''
                            }`}
                          style={activeLinkIndex === 1 ? {
                            textShadow: '0 0 10px rgba(252, 211, 77, 0.8), 0 0 20px rgba(252, 211, 77, 0.4)'
                          } : {}}
                        >
                          About
                        </Link>
                        {isAuthenticated && user?.role === 'admin' && (
                          <Link
                            ref={el => linkRefs.current[2] = el}
                            to="/admin/dashboard"
                            onClick={() => handleLinkClick(2)}
                            className={`hover:text-amber-400 transition-colors duration-200 font-semibold relative z-10 ${activeLinkIndex === 2 ? 'text-amber-300' : ''
                              }`}
                            style={activeLinkIndex === 2 ? {
                              textShadow: '0 0 10px rgba(252, 211, 77, 0.8), 0 0 20px rgba(252, 211, 77, 0.4)'
                            } : {}}
                          >
                            Admin
                          </Link>
                        )}
                        {!isAuthenticated ? (
                            <SignInBtn setIsMenuOpen={setIsMenuOpen}/>
                        ) : (
                          <AccDropDown />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;