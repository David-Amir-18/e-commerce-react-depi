import { Link } from "react-router-dom";
function SignInBtn() {
      return (
            <Link
                  className="text-white hover:bg-amber-500 hover:scale-110 transition-all px-4 py-2 bg-amber-400 rounded-full border border-white"
                  to="/signin"
            >
                  Sign In
            </Link>);
}

export default SignInBtn;