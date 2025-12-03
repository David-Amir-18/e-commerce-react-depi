import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
function TOS({ linkStyle = false }) {
  const style = linkStyle ? "text-amber-400 hover:text-amber-300 underline" : "text-gray-300 hover:text-amber-400"
  return (<Dialog>
    <DialogTrigger asChild>
      <button
        type="button"
        className={`${style} transition-colors`}
      >
        Terms of Service
      </button>
    </DialogTrigger>
    <DialogContent className="bg-[#00000066] backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-[#ffffff20] text-white max-w-3xl max-h-[80vh] data-[state=closed]:animate-soft-scale-out data-[state=open]:animate-soft-scale-in">
      <DialogHeader>
        <DialogTitle className="text-2xl font-light text-white mb-2">
          Terms of Service
        </DialogTitle>
        <DialogDescription className="text-gray-300 text-sm">
          Last updated: October 24, 2025
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="max-h-[calc(80vh-150px)]">
        <div className="space-y-4 text-sm pr-6">
          <p className="leading-relaxed text-gray-200">
            Welcome to Our Service. These Terms of Service ("Terms")
            govern your access to and use of our website, products,
            and services (collectively, the "Service"). Please read
            these Terms carefully before using the Service.
          </p>

          <h3 className="text-lg font-semibold text-gray-100 mb-2">
            1. Acceptance of Terms
          </h3>
          <p className="leading-relaxed text-gray-200">
            By creating an account, making a purchase, or otherwise
            accessing or using the Service, you agree to be bound by
            these Terms and our Privacy Policy. If you do not agree to
            these Terms, you may not access or use the Service.
          </p>
          <h3 className="text-lg font-semibold text-gray-100 mb-2">2. User Accounts</h3>
          <p className="leading-relaxed text-gray-200">
            To use certain features of the Service, you may be
            required to create an account. You agree to:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-gray-200 mt-2">
            <li>
              Provide true, accurate, current, and complete
              information as prompted by the registration form.
            </li>
            <li>
              Maintain and promptly update your account information to
              keep it accurate and complete.
            </li>
            <li>
              Maintain the security of your password and accept all
              risks of unauthorized access to your account.
            </li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-100 mb-2">
            3. Prohibited Conduct
          </h3>
          <p className="leading-relaxed text-gray-200">
            You agree not to use the Service to:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-gray-200 mt-2">
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
          <h3 className="text-lg font-semibold text-gray-100 mb-2">4. Termination</h3>
          <p className="leading-relaxed text-gray-200">
            We may terminate or suspend your access to the Service at
            any time, without prior notice or liability, for any
            reason, including if you breach these Terms. Upon
            termination, your right to use the Service will
            immediately cease.
          </p>
          <h3 className="text-lg font-semibold text-gray-100 mb-2">
            5. Limitation of Liability
          </h3>
          <p className="leading-relaxed text-gray-200">
            To the fullest extent permitted by law, in no event shall
            our company, its officers, directors, employees, or agents
            be liable for any indirect, incidental, special,
            consequential, or punitive damages arising out of or in
            connection with your use of the Service.
          </p>
        </div>
        <ScrollBar />
      </ScrollArea>
    </DialogContent>
  </Dialog>
  );
}

export default TOS;