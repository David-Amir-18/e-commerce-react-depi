// import Gevora from "./private assets/Gevora.jpg"
// import korea from "./private assets/korea.jpg"
// import globe from "./private assets/globe-regular-full.svg"

// import { useNavigate } from 'react-router-dom';
import goldParticles from './private assets/gold-particle.1920x1080.mp4'
// import takeoff from "./private assets/takeoff-the-plane-svgrepo-com.svg"
// import landing from "./private assets/plane-landing.svg"
import WideVideo from "./private assets/3042099-hd_1920_1080_30fps.mp4"
import { faGem } from "@fortawesome/free-regular-svg-icons/faGem"
import { faBellConcierge } from "@fortawesome/free-solid-svg-icons/faBellConcierge"
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons/faShieldHalved"
import { faGlobe } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./landing.css";
import SearchBar from '@/Searchbars/SearchBar';
import DealsSection from '@/Deals/DealsSection';


// function getWeekDay(n = new Date().getDay()) {
//     switch (n) {
//         case 0:
//             return "Sun"
//         case 1:
//             return "Mon"
//         case 2:
//             return "Tue"
//         case 3:
//             return "Wed"
//         case 4:
//             return "Thu"
//         case 5:
//             return "Fri"
//         case 6:
//             return "Sat"
//         default:
//             return "Invalid day"
//     }
// }

// function getMonth(n = new Date().getMonth()) {
//     switch (n) {
//         case 0:
//             return "Jan"
//         case 1:
//             return "Feb"
//         case 2:
//             return "Mar"
//         case 3:
//             return "Apr"
//         case 4:
//             return "May"
//         case 5:
//             return "Jun"
//         case 6:
//             return "Jul"
//         case 7:
//             return "Aug"
//         case 8:
//             return "Sep"
//         case 9:
//             return "Oct"
//         case 10:
//             return "Nov"
//         case 11:
//             return "Dec"
//         default:
//             return "Invalid month"
//     }
// }

function Landing() {
    // const navigate = useNavigate();
    // let date = new Date()
    // date = `${getWeekDay()}, ${date.getDate()} ${getMonth()} ${date.getFullYear()}` 
    return (
        <div id='hero' className="video-background min-h-screen overflow-y-auto bg-black py-20">
            <video className="fixed rotate-90 md:absolute md:rotate-0 top-0 w-[100vw] h-[100vh]  object-cover blur-[50px]" autoPlay muted loop playsInline>
                <source src={goldParticles} />
            </video>
            <section className="relative z-10 flex items-center justify-center min-h-screen">
                <div className=" max-md:px-0  px-8 grid grid-cols-1 lg:grid-cols-[2fr_1fr] w-full gap-10">
                    {/*
                    Original Images 
                    <div className="flex flex-col items-center justify-end gap-5 mb-5 md:mb-0">
                        <p className="text-[#ffffff] text-3xl">Popular Locations</p>
                        <div className="flex">
                            <div className="aspect-square w-[180px] mr-4">
                                <img className="w-full h-full rounded-2xl" src={korea}></img>
                            </div>
                            <div className="aspect-square w-[180px]">
                                <img className="w-full h-full rounded-2xl" src={Gevora}></img>
                            </div>
                        </div>
                    </div> */
                    }
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

                    {/* <div className="card card-util1 p-8"> */}
                      <SearchBar/>
                    {/* </div> */}
                </div>
            </section>
            <DealsSection/>
        </div>
    );
}

export default Landing;