import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/api";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.verifyOTP(email, otp);

      if (response.success) {
        // Navigate to reset password with the token
        navigate("/reset-password", {
          state: { resetToken: response.resetToken, email },
        });
      }
    } catch (err) {
      setError(err.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setLoading(true);

    try {
      await authAPI.forgotPassword(email, "otp");
      setError(""); // Clear any previous errors
      alert("A new OTP has been sent to your email.");
    } catch (err) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
        }}
      >
        <div className="w-full max-w-md bg-[#ffffff15] backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-[#ffffff20] text-center">
          <p className="text-gray-300 mb-4">No email provided for verification.</p>
          <Link
            to="/forgetpass"
            className="text-amber-400 hover:text-amber-300 transition-colors"
          >
            Go back to Forgot Password
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-20"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')",
      }}
    >
      <div className="w-full max-w-md bg-[#ffffff15] backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-[#ffffff20]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#fbbf2415] rounded-full mb-4">
            <svg
              className="w-8 h-8 text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-light text-white mb-2">Verify OTP</h1>
          <p className="text-gray-300 text-sm">
            Enter the 6-digit code sent to
          </p>
          <p className="text-amber-400 font-medium mt-1">{email}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              OTP Code
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full px-4 py-3 bg-[#ffffff10] border border-[#ffffff30] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all text-center text-2xl tracking-widest"
              placeholder="000000"
              maxLength={6}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-amber-400 text-gray-900 py-3 rounded-lg font-medium hover:bg-amber-500 transition-all duration-300 shadow-lg hover:shadow-amber-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <Link
            to="/forgetpass"
            className="w-full flex items-center justify-center text-gray-300 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Forgot Password
          </Link>
        </form>

        <div className="mt-8 pt-6 border-t border-[#ffffff20] text-center">
          <p className="text-gray-400 text-sm mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResendOTP}
            disabled={loading}
            className="text-amber-400 hover:text-amber-300 transition-colors font-medium text-sm disabled:opacity-50"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
