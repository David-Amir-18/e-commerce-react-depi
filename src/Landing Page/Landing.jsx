// import Gevora from "./private assets/Gevora.jpg"
// import korea from "./private assets/korea.jpg"
import takeoff from "./private assets/takeoff-the-plane-svgrepo-com.svg"
import landing from "./private assets/plane-landing.svg"
import WideVideo from "./private assets/3042099-hd_1920_1080_30fps.mp4"
// import globe from "./private assets/globe-regular-full.svg"
import { faGem } from "@fortawesome/free-regular-svg-icons/faGem"
import { faBellConcierge } from "@fortawesome/free-solid-svg-icons/faBellConcierge"
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons/faShieldHalved"
import { faGlobe } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function getWeekDay(n = new Date().getDay()) {
    switch (n) {
        case 0:
            return "Sun"
        case 1:
            return "Mon"
        case 2:
            return "Tue"
        case 3:
            return "Wed"
        case 4:
            return "Thu"
        case 5:
            return "Fri"
        case 6:
            return "Sat"
        default:
            return "Invalid day"
    }
}

function getMonth(n = new Date().getMonth()) {
    switch (n) {
        case 0:
            return "Jan"
        case 1:
            return "Feb"
        case 2:
            return "Mar"
        case 3:
            return "Apr"
        case 4:
            return "May"
        case 5:
            return "Jun"
        case 6:
            return "Jul"
        case 7:
            return "Aug"
        case 8:
            return "Sep"
        case 9:
            return "Oct"
        case 10:
            return "Nov"
        case 11:
            return "Dec"
        default:
            return "Invalid month"
    }
}

function Landing() {
    let date = new Date()
    date = `${getWeekDay()}, ${date.getDate()} ${getMonth()} ${date.getFullYear()}`
    return (
        <div id='hero' className="video-background min-h-screen overflow-y-auto bg-white">
            <video className="fixed top-0 w-full mx-auto h-full object-cover" autoPlay muted loop playsInline>
                <source src={WideVideo} />
            </video>
            <section className="relative z-10 flex items-center justify-center min-h-screen">
                <div className="py-25 max-md:px-0 md: px-8 grid grid-cols-1 xl:grid-cols-[2fr_1fr] w-full gap-10">
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
                            <h1 className="text-5xl lg:text-6xl xl:text-8xl text-amber-300 leading-[1.3]">Experience Flight Beyond First Class</h1>
                            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                                <div className="card card-util2 p-6">
                                    <div className="flex">
                                        <p className="text-amber-400 mr-2"><FontAwesomeIcon icon={faBellConcierge} /></p>
                                        <h3 className="text-amber-400">24/7 Concierge</h3>
                                    </div>
                                    <p>Personalized flight planning and on-demand scheduling.</p>
                                </div>
                                <div className="card card-util2 p-6">
                                    <div className="flex">
                                        <p className="text-amber-400 mr-2"><FontAwesomeIcon icon={faShieldHalved} /></p>
                                        <h3 className="text-amber-400">Executive Privacy</h3>
                                    </div>
                                    <p>Discreet, secure, and seamless travel for elite clients.</p>
                                </div>
                                <div className="card card-util2 p-6">
                                    <div className="flex">
                                        <p className="text-amber-400 mr-2"><FontAwesomeIcon icon={faGlobe} /></p>
                                        <h3 className="text-amber-400">Global Reach</h3>
                                    </div>
                                    <p>Private access to 1,200+ airports worldwide.</p>
                                </div>
                                <div className="card card-util2 p-6">
                                    <div className="flex">
                                        <p className="text-amber-400 mr-2"><FontAwesomeIcon icon={faGem} /></p>
                                        <h3 className="text-amber-400">Sky Luxury</h3>
                                    </div>
                                    <p>Fine dining, private lounges, and bespoke in-flight comfort.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card card-util1 p-8">
                        <h2 className="text-4xl">Plan Your Journey</h2>
                        <p className="my-5 p1">Select your destinations and let us tailor every detail of your private flight.</p>
                        <div className="mb-5 flex flex-wrap gap-3">
                            <button className="">One way</button>
                            <button className="">Round way</button>
                            <button className="">Multi-city</button>
                        </div>
                        <div className="innercard flex items-center">
                            <div className="flex flex-col border-r w-12">
                                <img src={takeoff} width={25}></img>
                                <h2 className=" font-extrabold">DXB</h2>
                            </div>
                            <h3 className="text-lg ml-3">Dubai, UAE</h3>
                        </div>
                        <div className="innercard flex items-center">
                            <div className="flex flex-col border-r w-12">
                                <img src={landing} width={25}></img>
                                <h2 className=" font-extrabold">SEO</h2>
                            </div>
                            <h3 className="text-lg ml-3">Dubai, UAE</h3>
                        </div>
                        <div className="innercard">
                            <p>Departure</p>
                            <h3 className="text-xl">{date}</h3>
                        </div>
                        <div className="innercard grid grid-cols-2">
                            <div className="border-r">
                                <p>Passengers</p>
                                <h2 className="text-lg">2 Adults</h2>
                            </div>
                            <div className="ml-3">
                                <p>Class</p>
                                <h2 className="text-lg">Economy</h2>
                            </div>
                        </div>
                        <button className="mt-5 rounded-full transition-all bg-amber-400 hover:bg-amber-500 h-10">Search flights</button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Landing;