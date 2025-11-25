import { Link } from "react-router-dom";
function SignInBtn({setIsMenuOpen}) {
      const closeMenu = () => setIsMenuOpen(false)
      return (
            <Link
                  className="text-white hover:bg-amber-500 transition-all px-4 py-2 bg-amber-400 rounded-full"
                  to="/signin"
                  onClick={closeMenu}
            >
                  Sign In
            </Link>);
}

export default SignInBtn;