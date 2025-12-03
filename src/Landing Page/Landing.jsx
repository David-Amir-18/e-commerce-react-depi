import goldParticles from './private assets/gold-particle.1920x1080.mp4'
import { faGem } from "@fortawesome/free-regular-svg-icons/faGem"
import { faBellConcierge } from "@fortawesome/free-solid-svg-icons/faBellConcierge"
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons/faShieldHalved"
import { faGlobe } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./landing.css";
import SearchBar from '@/Searchbars/SearchBar';
import DealsSection from '@/Deals/DealsSection';


function Landing() {
    return (
        <div id='hero' className="video-background min-h-screen overflow-y-auto bg-black py-20">
            <video className="fixed rotate-90 md:absolute md:rotate-0 top-0 w-[100vw] h-[100vh]  object-cover blur-[50px]" autoPlay muted loop playsInline>
                <source src={goldParticles} />
            </video>
            <section className="relative z-10 flex items-center justify-center min-h-screen">
                <div className=" max-md:px-0  px-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] w-full gap-10">
                    <div className="flex items-center">
                        <div className="card gap-5 h-full w-full justify-between">
                            <h1 className="text-5xl lg:text-7xl xl:text-8xl text-amber-300 leading-[1.3]">Experience Flight Beyond First Class</h1>
                            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                <div className="card card-util1 p-6">
                                    <div className="flex">
                                        <p className="text-amber-400 mr-2"><FontAwesomeIcon icon={faBellConcierge} /></p>
                                        <h3 className="text-amber-400">24/7 Concierge</h3>
                                    </div>
                                    <p>Personalized flight planning and on-demand scheduling.</p>
                                </div>
                                <div className="card card-util1 p-6">
                                    <div className="flex">
                                        <p className="text-amber-400 mr-2"><FontAwesomeIcon icon={faShieldHalved} /></p>
                                        <h3 className="text-amber-400">Executive Privacy</h3>
                                    </div>
                                    <p>Discreet, secure, and seamless travel for elite clients.</p>
                                </div>
                                <div className="card card-util1 p-6">
                                    <div className="flex">
                                        <p className="text-amber-400 mr-2"><FontAwesomeIcon icon={faGlobe} /></p>
                                        <h3 className="text-amber-400">Global Reach</h3>
                                    </div>
                                    <p>Private access to 1,200+ airports worldwide.</p>
                                </div>
                                <div className="card card-util1 p-6">
                                    <div className="flex">
                                        <p className="text-amber-400 mr-2"><FontAwesomeIcon icon={faGem} /></p>
                                        <h3 className="text-amber-400">Sky Luxury</h3>
                                    </div>
                                    <p>Fine dining, private lounges, and bespoke in-flight comfort.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <SearchBar />
                </div>
            </section>
            <section>
                <DealsSection />
            </section>
        </div>
    );
}

export default Landing;