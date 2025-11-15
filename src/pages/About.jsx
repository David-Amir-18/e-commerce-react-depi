import goldParticles from "./../Landing Page/private assets/gold-particle.1920x1080.mp4"

export default function About() {
      return (
            <>
                  <div id='hero' className="video-background  overflow-y-auto bg-black pb-20">
                        <video className="fixed rotate-90 md:absolute md:rotate-0 top-0 w-[100vw] h-[100vh] object-cover blur-[50px]" autoPlay muted loop playsInline>
                              <source src={goldParticles} />
                        </video>
                        <section className="relative z-10 flex flex-col items-center justify-center container">
                              <header className="mb-8 text-center">
                                    <h1 className="text-4xl font-bold text-amber-400">About Elysium</h1>
                                    <p className="text-gray-300 mt-2">We build flight tools that make planning simple and fast.</p>
                              </header>

                              <div className="grid gap-6 md:grid-cols-2 md:px-8 container">
                                    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                                          <h2 className="text-xl font-semibold text-amber-300 mb-2">Our mission</h2>
                                          <p className="text-gray-300">Make travel search fast, accessible and accurate. We combine clean UX and curated data to help users find the right flights.</p>
                                    </div>

                                    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                                          <h2 className="text-xl font-semibold text-amber-300 mb-2">What we do</h2>
                                          <ul className="text-gray-300 list-disc pl-5 space-y-2">
                                                <li>Fast flight search and filters</li>
                                                <li>Accurate airport & city suggestions</li>
                                                <li>Simple booking workflows</li>
                                          </ul>
                                    </div>
                              </div>

                              <div className="mt-8 md:px-8 container">
                                    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                                          <h3 className="text-lg font-semibold text-amber-300 mb-3">Team & values</h3>
                                          <p className="text-gray-300">We value clarity, speed and trust. If you'd like to collaborate or join the team, contact us via the contact page.</p>
                                    </div>
                              </div>
                  </section>
            </div>
        </>
    );
}