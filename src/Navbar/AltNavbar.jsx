import { useState } from "react";
import Overlay from "./Overlay";

import BurgerMenu from "@/components/ui/BurgerMenu";
import AccDropDown from "@/components/ui/AccDropDown";


function AltNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className={`z-20 fixed w-full `}>
            <div className="container p-8 flex items-center justify-end mx-auto">

              <BurgerMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              <Overlay isMenuOpen={isMenuOpen} />
            </div>
      </nav>
    </>
  );
}

export default AltNavbar;