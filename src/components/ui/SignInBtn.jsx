import { Link } from "react-router-dom";
function SignInBtn() {
      return (
            <Link
                  className="text-white hover:bg-amber-500 transition-all px-4 py-2 bg-amber-400 rounded-full"
                  to="/signin"
            >
                  Sign In
            </Link>);
}

export default SignInBtn;