import PrivacyPolicy from "@/components/PrivacyPolicy";
import TOS from "@/components/TOS";
import { Link } from "react-router-dom";
function Footer() {
    return (
        <footer className="relative z-10 w-full text-white py-20 border-t border-white/20 bg-slate-800">
            <div className=" container mx-auto px-8 grid md:grid-cols-2 gap-10 items-start">
                <div>
                    <Link to="/" className="text-2xl font-semibold text-amber-300 tracking-wide mb-4">ELYSIUM</Link>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Experience flight beyond first class — luxury, privacy,<br /> and global reach for those who expect more from air travel.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row md:justify-center gap-8">
                    <div>
                        <h3 className="text-amber-300 font-semibold mb-3">Company</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><Link to="/about" className="hover:text-amber-400 transition-colors">About</Link></li>
                            <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-amber-300 font-semibold mb-3">Support</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li><TOS /></li>
                            <li><PrivacyPolicy /></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/20 mt-12 pt-6 text-center text-xs text-gray-400">
                &copy; {new Date().getFullYear()} ELYSIUM. All rights reserved.
            </div>
        </footer>

    );
}

export default Footer;