function BurgerMenu({isMenuOpen, setIsMenuOpen}) {
      function toggleMenu() {
            setIsMenuOpen(!isMenuOpen);
      }
      return (
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
      );
}

export default BurgerMenu;