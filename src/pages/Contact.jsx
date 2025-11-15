import { useState } from "react";
import goldParticles from "./../Landing Page/private assets/gold-particle.1920x1080.mp4"

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Replace with real API call as needed
        try {
            // await fetch('/api/contact', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(form) });
            setStatus("success");
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            setStatus("error");
        }
    };

    return (
        <>
             <div id='hero' className="video-background min-h-screen overflow-y-auto bg-black pb-20">
                        <video className="fixed rotate-90 md:absolute md:rotate-0 top-0 w-[100vw] h-[100vh]  object-cover blur-[50px]" autoPlay muted loop playsInline>
                            <source src={goldParticles} />
                        </video>
                  <section className="relative z-10 flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-3xl font-bold text-amber-300 mb-2">Contact Us</h1>
                    <p className="text-gray-300 mb-6">Questions or feedback? Send us a message and we'll respond as soon as possible.</p>

                    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your name"
                                    className="w-full p-3 rounded-xl bg-transparent border border-white/20 outline-none text-white"
                                />
                                <input
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full p-3 rounded-xl bg-transparent border border-white/20 outline-none text-white"
                                />
                            </div>

                            <input
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                placeholder="Subject"
                                className="w-full p-3 rounded-xl bg-transparent border border-white/20 outline-none text-white"
                            />

                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows="6"
                                placeholder="Your message"
                                className="w-full p-3 rounded-xl bg-transparent border border-white/20 outline-none text-white"
                            />

                            <div className="flex items-center gap-4">
                                <button type="submit" className="bg-amber-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-amber-500 transition">
                                    Send message
                                </button>
                                {status === "success" && <span className="text-green-400">Message sent.</span>}
                                {status === "error" && <span className="text-red-400">Failed to send.</span>}
                            </div>
                        </form>
                    </div>

                    <p className="mt-6 text-gray-400 text-sm">
                        Or email directly: <a className="text-amber-300" href="mailto:yousf.1672004@gmail.com">yousf.1672004@gmail.com</a>
                    </p>
                </section>
            </div>
        </>
    );
}