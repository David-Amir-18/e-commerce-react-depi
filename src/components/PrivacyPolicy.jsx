import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function PrivacyPolicy({linkStyle = false}) {
    const style = linkStyle ? "text-amber-400 hover:text-amber-300 underline" : "text-gray-300 hover:text-amber-400"
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className={`${style} transition-colors`}
                >
                    Privacy Policy
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#00000066] backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-[#ffffff20] text-white max-w-3xl max-h-[80vh] data-[state=closed]:animate-soft-scale-out data-[state=open]:animate-soft-scale-in">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-light text-white mb-2">
                        Privacy Policy
                    </DialogTitle>
                    <DialogDescription className="text-gray-300 text-sm">
                        Last updated: October 24, 2025
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[calc(80vh-150px)]">
                    <div className="space-y-4 text-sm pr-6">
                        <p className="leading-relaxed text-gray-200">
                            Your privacy is important to us. This Privacy Policy
                            explains how we collect, use, disclose, and safeguard your
                            information when you use our Service.
                        </p>

                        <h3 className="text-lg font-semibold text-gray-100 mb-2">
                            1. Information We Collect
                        </h3>
                        <p className="leading-relaxed text-gray-200">
                            We may collect personal information you provide to us
                            directly, such as:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-200 mt-2">
                            <li>
                                Personal Data: Name, email address, phone number,
                                and payment information.
                            </li>
                            <li>
                                Usage Data: Information collected automatically when
                                you use the Service, such as IP address, browser type,
                                pages visited, and duration of visit.
                            </li>
                            <li>
                                Cookies: We use cookies to track activity and store
                                information.
                            </li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-100 mb-2">
                            2. How We Use Your Information
                        </h3>
                        <p className="leading-relaxed text-gray-200">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-200 mt-2">
                            <li>Provide, operate, and maintain our Service.</li>
                            <li>
                                Process your transactions and manage your account.
                            </li>
                            <li>
                                Communicate with you, including for customer service and
                                marketing purposes.
                            </li>
                            <li>Improve and personalize the Service.</li>
                            <li>Detect and prevent fraud and security issues.</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-100 mb-2">
                            3. How We Share Your Information
                        </h3>
                        <p className="leading-relaxed text-gray-200">
                            We do not sell your personal information. We may share
                            information with third-party vendors and service providers
                            who perform services for us (e.g., payment processing). We
                            may also disclose your information if required by law or
                            to protect our rights.
                        </p>

                        <h3 className="text-lg font-semibold text-gray-100 mb-2">4. Your Data Rights</h3>
                        <p className="leading-relaxed text-gray-200">
                            Depending on your location, you may have the right to:
                        </p>
                        <ul className="list-disc pl-6 space-y-1 text-gray-200 mt-2">
                            <li>Access the personal data we hold about you.</li>
                            <li>Request corrections to any inaccurate data.</li>
                            <li>Request deletion of your personal data.</li>
                            <li>Opt-out of certain data processing activities.</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-100 mb-2">5. Contact Us</h3>
                        <p className="leading-relaxed text-gray-200">
                            If you have any questions about this Privacy Policy,
                            please contact us through the contact page or directly at privacy@example.com.
                        </p>
                    </div>
                    <ScrollBar />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

export default PrivacyPolicy;