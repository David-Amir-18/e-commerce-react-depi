import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";
import TOS from "@/components/TOS";
import PrivacyPolicy from "@/components/PrivacyPolicy";

function Register() {
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  const validateEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters and contain uppercase, lowercase, number, and special character (@$!%*?&)");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!agreeToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name: fullName,
        email,
        password,
      });

      if (result.success) {
        navigate("/", { replace: true });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);

    try {
      const result = await googleLogin(credentialResponse.credential);

      if (result.success) {
        navigate("/", { replace: true });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Google registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google registration failed. Please try again.");
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-20"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
      }}
    >
      <div className="mt-10 w-full max-w-md bg-[#ffffff15] backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-[#ffffff20]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-white mb-2">
            Create Account
          </h1>
          <p className="text-gray-300 text-sm">
            Join us for an exclusive private flight experience
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff30] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff30] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff30] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              placeholder="Create a password"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff30] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="flex items-start text-sm">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 mr-3 h-4 w-4 rounded bg-[#ffffff10] border-[#ffffff30] text-amber-400 focus:ring-amber-400"
              required
            />
            <div className="text-gray-300 -mt-px">
              I agree to the{" "}
              <TOS linkStyle={true} /> and {" "}
              <PrivacyPolicy linkStyle={true} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 text-gray-900 py-3 rounded-lg font-medium hover:bg-amber-500 transition-all duration-300 shadow-lg hover:shadow-amber-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-300 text-sm">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-[#ffffff20]">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-[#ffffff20]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-gray-400">
                Or register with
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme=""
              size="large"
              text="signup_with"
              shape="circle"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
