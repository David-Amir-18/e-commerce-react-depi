import { useState } from "react";
import goldParticles from "./../Landing Page/private assets/gold-particle.1920x1080.mp4"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (data.success) {
                setStatus("success");
                setForm({ name: "", email: "", subject: "", message: "" });
            } else {
                setStatus("error");
            }
        } catch (err) {
            setStatus("error");
        } finally {
            setLoading(false);
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-amber-400 text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send message'}
                            </button>

                            {status === "success" && (
                                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center">
                                    <p className="text-green-400 font-semibold">Message sent successfully!</p>
                                    <p className="text-green-300 text-sm mt-1">We'll get back to you as soon as possible.</p>
                                </div>
                            )}
                            {status === "error" && (
                                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-center">
                                    <p className="text-red-400 font-semibold">Failed to send message</p>
                                    <p className="text-red-300 text-sm mt-1">Please try again later.</p>
                                </div>
                            )}
                        </form>
                    </div>
                </section>
            </div>
        </>
    );
}