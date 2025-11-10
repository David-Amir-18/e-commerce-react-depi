import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
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
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- STYLING CONSTANTS (Using the flex-col layout to fix spacing) ---
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
  // --- END STYLING CONSTANTS ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
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
        // Redirect to home page after successful registration
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
          {/* Form Inputs (Full Name, Email, Password...) */}
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
          {/* End Form Inputs */}

          {/* --- MODIFIED TERMS SECTION --- */}
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
              {/* --- TERMS OF SERVICE DIALOG (as provided) --- */}
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
                  {/* --- FIXED: Replaced div with ScrollArea --- */}
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
              and {/* --- PRIVACY POLICY DIALOG (as provided) --- */}
              <Dialog>
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
                  {/* --- FIXED: Replaced div with ScrollArea --- */}
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
          {/* --- END MODIFIED TERMS SECTION --- */}

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
          {/* ... Social Login ... */}
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

          <div className="grid grid-cols-1 gap-4">
            <button className="flex items-center justify-center px-4 py-2 bg-[#ffffff10] border border-[#ffffff30] rounded-lg text-white hover:bg-[#ffffff20] transition-all">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
