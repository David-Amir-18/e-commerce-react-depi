import { Link } from "react-router-dom";
function Footer() {
      return (
            <footer className="relative z-10 bg-[#000000ff] text-white py-20  border-t border-[#ffffff1e]">
                  <div className=" container mx-auto px-8 grid md:grid-cols-3 gap-10 items-start">
                        {/* Brand + Description */}
                        <div>
                              <h2 className="text-2xl font-semibold text-amber-400 tracking-wide mb-4">LADEN</h2>
                              <p className="text-sm text-gray-400 leading-relaxed">
                                    Experience flight beyond first class — luxury, privacy, and global reach for those who expect more from air travel.
                              </p>
                        </div>

                        {/* Links */}
                        <div className="flex flex-col md:flex-row md:justify-center gap-8">
                              <div>
                                    <h3 className="text-amber-400 font-semibold mb-3">Company</h3>
                                    <ul className="space-y-2 text-sm text-gray-300">
                                          <li><Link to="/about" className="hover:text-amber-400 transition-colors">About</Link></li>
                                          <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
                                          <li><Link to="/deals" className="hover:text-amber-400 transition-colors">Deals</Link></li>
                                    </ul>
                              </div>

                              <div>
                                    <h3 className="text-amber-400 font-semibold mb-3">Support</h3>
                                    <ul className="space-y-2 text-sm text-gray-300">
                                          <li><Link to="/faq" className="hover:text-amber-400 transition-colors">FAQ</Link></li>
                                          <li><Link to="/policy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
                                          <li><Link to="/terms" className="hover:text-amber-400 transition-colors">Terms & Conditions</Link></li>
                                    </ul>
                              </div>
                        </div>

                        {/* Newsletter / Social */}
                        <div className="flex flex-col items-start">
                              <h3 className="text-amber-400 font-semibold mb-3">Stay Connected</h3>
                              <p className="text-sm text-gray-400 mb-4">Get the latest offers and luxury flight insights.</p>
                              <form className="flex w-full max-w-xs">
                                    <input
                                          type="email"
                                          placeholder="Your email"
                                          className="bg-[#1a1a1a] text-sm text-gray-300 rounded-l-full px-4 py-2 focus:outline-none border border-[#333]"
                                    />
                                    <button
                                          type="submit"
                                          className="bg-amber-400 text-black px-4 py-2 rounded-r-full text-sm font-semibold hover:bg-amber-300 transition-colors"
                                    >
                                          Subscribe
                                    </button>
                              </form>
                        </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className="border-t border-[#ffffff1e] mt-12 pt-6 text-center text-xs text-gray-400">
                        &copy; {new Date().getFullYear()} LADEN. All rights reserved.
                  </div>
            </footer>

      );
}

export default Footer;