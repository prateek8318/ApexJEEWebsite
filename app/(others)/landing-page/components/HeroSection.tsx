import Link from "next/link";
import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";

import SmartImg from "@/assets/images/smart.png";
import PracticeImg from "@/assets/images/practice.png";
import RevisionImg from "@/assets/images/revision.png";
import MockImg from "@/assets/images/mock.png";
import VideoImg from "@/assets/images/video.png";
import PerformanceImg from "@/assets/images/perfomence.png";
import PlayImg from "@/assets/images/play.png";

const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ["400", "500", "600", "700"]
});

function HeroSection() {
    const features = [
        {
            icon: VideoImg,
            title: "Video Lectures",
            desc: "Chapter-wise videos mapped to the full JEE syllabus",
        },
        {
            icon: PracticeImg,
            title: "Practice Questions",
            desc: "Topic-wise questions with step-by-step solutions",
        },
        {
            icon: MockImg,
            title: "Mock Tests",
            desc: "JEE-Main & Advanced pattern — timed, realistic",
        },
        {
            icon: SmartImg,
            title: "Smart Timetable",
            desc: "Auto-adapts to your pace, off-days and exam date",
        },
        {
            icon: PerformanceImg,
            title: "Performance Analytics",
            desc: "Weak-topic detection and expected rank after every test",
        },
        {
            icon: RevisionImg,
            title: "Doubt Forum",
            desc: "Ask doubts anytime — answered by faculty & peers",
        },
    ];

    return (
        <div
            style={{
                background: "#060F22",
                position: "relative",
                overflow: "hidden"
            }}
            className="w-full"
        >
            {/* Background Eclipse */}
            <div
                style={{
                    position: "absolute",
                    top: "10%",
                    right: "-5%",
                    width: "800px",
                    height: "800px",
                    background: "#0D1F3F",
                    filter: "blur(120px)",
                    borderRadius: "50%",
                    zIndex: 0,
                    pointerEvents: "none"
                }}
            />

            {/* Hero */}
            <main className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-24 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-[1.1fr_1.2fr] gap-12 lg:gap-16 items-center relative z-10">
                <div className="w-full relative">
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: "20px", padding: "5px 14px", marginBottom: "20px" }}>
                        <span style={{ color: "#F5A623", fontSize: "8px" }}>●</span>
                        <span style={{ color: "#F5A623", fontSize: "11px", fontWeight: "600", letterSpacing: "0.8px", textTransform: "uppercase" as const }}>India&apos;s First Complete Self-Study System</span>
                    </div>
                    <h1 className={`text-5xl md:text-7xl font-bold tracking-tight text-white leading-none mb-1 ${cormorant.className}`}>Crack IIT JEE</h1>
                    <p className={`text-[44px] md:text-[52px] font-bold italic leading-[1.1] mb-4 text-[#F5A623] ${cormorant.className}`}>On Your Own Terms</p>
                    <p className="text-base md:text-lg text-white/60 leading-relaxed mb-8 max-w-lg font-medium">
                        The complete self-study system for IIT JEE — without the ₹1,50,000 coaching fee
                    </p>

                    <div className="relative mb-8 inline-block">
                        {/* Blur circle behind buttons */}
                        <div style={{ position: "absolute", top: "50%", left: "30%", transform: "translate(-50%, -50%)", width: "200px", height: "100px", background: "#C6A3461A", filter: "blur(30px)", borderRadius: "50%", zIndex: 0 }} />
                        <div className="flex flex-wrap gap-4 items-center relative z-10">
                            <Link href="/auth/login">
                                <button className="bg-[#F5A623] hover:bg-[#E09610] text-black border-none rounded-lg px-6 py-3 font-semibold text-sm cursor-pointer transition-colors duration-200 flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                    Start Free Trial
                                </button>
                            </Link>
                            <button className="bg-transparent hover:bg-white/5 text-white border border-white/20 rounded-lg px-6 py-3 font-medium text-sm cursor-pointer transition-colors duration-200 flex items-center gap-2">
                                Explore Features →
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 bg-[#0B1221] border border-[#F5A623]/30 rounded-2xl px-5 py-4 w-fit relative z-10 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#F5A623]/20 rounded-full flex items-center justify-center">
                                <Image src={PlayImg} alt="Play" width={16} height={16} className="object-contain opacity-80" />
                            </div>
                            <div>
                                <div className="font-bold text-lg text-white tracking-wide">1,00,000+</div>
                                <div className="text-[10px] text-white/50 tracking-[0.1em] uppercase font-bold mt-0.5">Subscribers on YouTube</div>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-white/10 mx-1"></div>
                        <div className={`text-white/50 text-[15px] leading-snug italic ${cormorant.className}`}>
                            Made by the channel<br />students trust
                        </div>
                    </div>
                </div>

                {/* Right Feature Grid */}
                <div style={{ background: "rgba(15,22,40,0.8)", border: "1px solid rgba(30,45,70,0.8)", borderRadius: "16px", padding: "28px", backdropFilter: "blur(10px)" }} className="w-full relative z-10 shadow-2xl">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                        <div style={{ width: "28px", height: "28px", background: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                        </div>
                        <span className="font-semibold text-lg md:text-xl text-white">Everything You Need to Crack JEE</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                        {features.slice(0, 6).map((f, i) => (
                            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "16px 18px" }}>
                                <div style={{ marginBottom: "10px" }}>
                                    <Image src={f.icon} alt={f.title} width={26} height={26} className="object-contain" />
                                </div>
                                <div style={{ fontWeight: "700", fontSize: "16px", color: "#fff", marginBottom: "6px" }}>{f.title}</div>
                                <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: "1.5" }}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: "rgba(245,166,35,0.05)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: "10px", padding: "16px 18px", marginTop: "2px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                        <Image src={RevisionImg} alt="Revision Notes" width={30} height={30} style={{ flexShrink: 0, marginTop: "2px", objectFit: "contain" }} />
                        <div>
                            <div style={{ fontWeight: "700", fontSize: "16px", color: "#F5A623", marginBottom: "6px" }}>Complete Revision Notes — You don't need to make them</div>
                            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", lineHeight: "1.55" }}>Chapter-wise, exam-ready revision notes and formula sheets for Physics & Maths. Professionally written, downloadable PDFs — nothing left for you to compile.</div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Marquee Banner */}
            <div className="w-full relative z-20 flex overflow-hidden border-y border-[#C5A059]/20" style={{ background: "#C5A059" }}>
                <style>{`
                    @keyframes marquee {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee {
                        display: flex;
                        width: fit-content;
                        min-width: 200%;
                        animation: marquee 40s linear infinite;
                    }
                    .animate-marquee:hover {
                        animation-play-state: paused;
                    }
                `}</style>
                <div className="animate-marquee py-3">
                    {[1, 2].map((set) => (
                        <div key={set} className="flex items-center whitespace-nowrap">
                            {[
                                "NO COACHING CLASS NEEDED",
                                "ADAPTIVE STUDY TIMETABLES",
                                "MOCK TESTS · PRACTICE QUESTIONS · VIDEO LECTURES",
                                "90% CHEAPER THAN COACHING",
                                "REAL-TIME ANALYTICS",
                                "AVAILABLE ON ANDROID"
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-6 px-3">
                                    <span className="text-[#060F22] font-bold text-xs tracking-wider uppercase">{text}</span>
                                    <div className="w-1 h-3 bg-[#060F22] opacity-60 rounded-[1px]" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default HeroSection;