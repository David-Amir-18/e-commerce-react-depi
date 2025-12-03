import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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

  const dialogContentClasses = `
    bg-[#00000066] backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-[#ffffff20]
    text-white
    max-w-3xl max-h-[80vh]
    data-[state=closed]:animate-soft-scale-out
    data-[state=open]:animate-soft-scale-in
  `;
  const dialogHeaderTitleClasses = "text-2xl font-light text-white mb-2";
  const dialogHeaderDescriptionClasses = "text-gray-300 text-sm";
  const sectionTitleClasses = "text-lg font-semibold text-gray-100 mb-2";
  const textClasses = "leading-relaxed text-gray-200";
  const listClasses = "list-disc pl-6 space-y-1 text-gray-200";

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
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-amber-400 hover:text-amber-300 transition-colors underline"
                  >
                    Terms of Service
                  </button>
                </DialogTrigger>
                <DialogContent className={dialogContentClasses}>
                  <DialogHeader>
                    <DialogTitle className={dialogHeaderTitleClasses}>
                      Terms of Service
                    </DialogTitle>
                    <DialogDescription
                      className={dialogHeaderDescriptionClasses}
                    >
                      Last updated: October 24, 2025
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="max-h-[calc(80vh-150px)]">
                    <div className="space-y-4 text-sm pr-6">
                      <p className={textClasses}>
                        Welcome to Our Service. These Terms of Service ("Terms")
                        govern your access to and use of our website, products,
                        and services (collectively, the "Service"). Please read
                        these Terms carefully before using the Service.
                      </p>

                      <h3 className={sectionTitleClasses}>
                        1. Acceptance of Terms
                      </h3>
                      <p className={textClasses}>
                        By creating an account, making a purchase, or otherwise
                        accessing or using the Service, you agree to be bound by
                        these Terms and our Privacy Policy. If you do not agree
                        to these Terms, you may not access or use the Service.
                      </p>
                      <h3 className={sectionTitleClasses}>2. User Accounts</h3>
                      <p className={textClasses}>
                        To use certain features of the Service, you may be
                        required to create an account. You agree to:
                      </p>
                      <ul className={`${listClasses} mt-2`}>
                        <li>
                          Provide true, accurate, current, and complete
                          information as prompted by the registration form.
                        </li>
                        <li>
                          Maintain and promptly update your account information
                          to keep it accurate and complete.
                        </li>
                        <li>
                          Maintain the security of your password and accept all
                          risks of unauthorized access to your account.
                        </li>
                      </ul>
                      <h3 className={sectionTitleClasses}>
                        3. Prohibited Conduct
                      </h3>
                      <p className={textClasses}>
                        You agree not to use the Service to:
                      </p>
                      <ul className={`${listClasses} mt-2`}>
                        <li>
                          Violate any local, state, national, or international
                          law.
                        </li>
                        <li>
                          Infringe upon or violate our intellectual property
                          rights or the intellectual property rights of others.
                        </li>
                        <li>
                          Engage in any harassing, abusive, or fraudulent
                          activity.
                        </li>
                        <li>
                          Transmit any viruses, worms, or other malicious code.
                        </li>
                      </ul>
                      <h3 className={sectionTitleClasses}>4. Termination</h3>
                      <p className={textClasses}>
                        We may terminate or suspend your access to the Service
                        at any time, without prior notice or liability, for any
                        reason, including if you breach these Terms. Upon
                        termination, your right to use the Service will
                        immediately cease.
                      </p>
                      <h3 className={sectionTitleClasses}>
                        5. Limitation of Liability
                      </h3>
                      <p className={textClasses}>
                        To the fullest extent permitted by law, in no event
                        shall our company, its officers, directors, employees,
                        or agents be liable for any indirect, incidental,
                        special, consequential, or punitive damages arising out
                        of or in connection with your use of the Service.
                      </p>
                    </div>
                    <ScrollBar />
                  </ScrollArea>
                </DialogContent>
              </Dialog>{" "}
              and <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-amber-400 hover:text-amber-300 transition-colors underline"
                  >
                    Privacy Policy
                  </button>
                </DialogTrigger>
                <DialogContent className={dialogContentClasses}>
                  <DialogHeader>
                    <DialogTitle className={dialogHeaderTitleClasses}>
                      Privacy Policy
                    </DialogTitle>
                    <DialogDescription
                      className={dialogHeaderDescriptionClasses}
                    >
                      Last updated: October 24, 2025
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="max-h-[calc(80vh-150px)]">
                    <div className="space-y-4 text-sm pr-6">
                      <p className={textClasses}>
                        Your privacy is important to us. This Privacy Policy
                        explains how we collect, use, disclose, and safeguard
                        your information when you use our Service.
                      </p>

                      <h3 className={sectionTitleClasses}>
                        1. Information We Collect
                      </h3>
                      <p className={textClasses}>
                        We may collect personal information you provide to us
                        directly, such as:
                      </p>
                      <ul className={`${listClasses} mt-2`}>
                        <li>
                          **Personal Data:** Name, email address, phone number,
                          and payment information.
                        </li>
                        <li>
                          **Usage Data:** Information collected automatically
                          when you use the Service, such as IP address, browser
                          type, pages visited, and duration of visit.
                        </li>
                        <li>
                          **Cookies:** We use cookies to track activity and
                          store information.
                        </li>
                      </ul>

                      <h3 className={sectionTitleClasses}>
                        2. How We Use Your Information
                      </h3>
                      <p className={textClasses}>
                        We use the information we collect to:
                      </p>
                      <ul className={`${listClasses} mt-2`}>
                        <li>Provide, operate, and maintain our Service.</li>
                        <li>
                          Process your transactions and manage your account.
                        </li>
                        <li>
                          Communicate with you, including for customer service
                          and marketing purposes.
                        </li>
                        <li>Improve and personalize the Service.</li>
                        <li>Detect and prevent fraud and security issues.</li>
                      </ul>

                      <h3 className={sectionTitleClasses}>
                        3. How We Share Your Information
                      </h3>
                      <p className={textClasses}>
                        We do not sell your personal information. We may share
                        information with third-party vendors and service
                        providers who perform services for us (e.g., payment
                        processing). We may also disclose your information if
                        required by law or to protect our rights.
                      </p>

                      <h3 className={sectionTitleClasses}>
                        4. Your Data Rights
                      </h3>
                      <p className={textClasses}>
                        Depending on your location, you may have the right to:
                      </p>
                      <ul className={`${listClasses} mt-2`}>
                        <li>Access the personal data we hold about you.</li>
                        <li>Request corrections to any inaccurate data.</li>
                        <li>Request deletion of your personal data.</li>
                        <li>Opt-out of certain data processing activities.</li>
                      </ul>

                      <h3 className={sectionTitleClasses}>5. Contact Us</h3>
                      <p className={textClasses}>
                        If you have any questions about this Privacy Policy,
                        please contact us at privacy@example.com.
                      </p>
                    </div>
                    <ScrollBar />
                  </ScrollArea>
                </DialogContent>
              </Dialog>
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
