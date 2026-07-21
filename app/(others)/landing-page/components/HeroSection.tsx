import Link from "next/link";

function HeroSection() {
    const features = [
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
            ),
            title: "Video Lectures",
            desc: "Chapter-wise videos mapped to the full JEE syllabus",
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
                    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
            ),
            title: "Practice Questions",
            desc: "Topic-wise questions with step-by-step solutions",
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
                    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
            ),
            title: "Mock Tests",
            desc: "JEE-Main & Advanced pattern — timed, realistic",
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            ),
            title: "Smart Timetable",
            desc: "Auto-adapts to your pace, off-days and exam date",
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
            ),
            title: "Performance Analytics",
            desc: "Weak-topic detection and expected rank after every test",
        },
        {
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            ),
            title: "Doubt Forum",
            desc: "Ask doubts anytime — answered by faculty & peers",
        },
    ];

    return (
        <div
            style={{
                background: "linear-gradient(135deg, #0A0F1E 0%, #0D1525 40%, #0F1A2E 100%)",
            }}
            className="w-full"
        >
            {/* Hero */}
            <main className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-24 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-[1.1fr_1.2fr] gap-12 lg:gap-16 items-center">
                <div className="w-full">
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: "20px", padding: "5px 14px", marginBottom: "28px" }}>
                        <span style={{ color: "#F5A623", fontSize: "8px" }}>●</span>
                        <span style={{ color: "#F5A623", fontSize: "11px", fontWeight: "600", letterSpacing: "0.8px", textTransform: "uppercase" as const }}>India&apos;s First Complete Self-Study System</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-2 leading-none">Crack IIT JEE</h1>
                    <p style={{ fontSize: "44px", fontWeight: "700", fontStyle: "italic", color: "#F5A623", lineHeight: "1.2", marginBottom: "20px", fontFamily: "Georgia, serif" }}>On Your Own Terms</p>
                    <p className="text-base md:text-lg text-white/60 leading-relaxed mb-8 max-w-lg">
                        The complete self-study system for IIT JEE — without the ₹1,50,000 coaching fee
                    </p>
                    <div className="flex flex-wrap gap-4 items-center mb-8">
                        <Link href="/auth/login">
                            <button className="bg-[#F5A623] hover:bg-[#E09610] text-black border-none rounded-lg px-6 py-3 font-semibold text-sm cursor-pointer transition-colors duration-200 flex items-center gap-2">
                                Start Free Trial
                            </button>
                        </Link>
                        <button className="bg-transparent hover:bg-white/5 text-white border border-white/20 rounded-lg px-6 py-3 font-medium text-sm cursor-pointer transition-colors duration-200 flex items-center gap-2">
                            Explore Features →
                        </button>
                    </div>
                    <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.08] rounded-xl p-3.5 w-fit">
                        <div className="w-9 h-9 bg-white/[0.08] rounded-full flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                        </div>
                        <div>
                            <div className="font-bold text-lg text-white">1,00,000+</div>
                            <div className="text-[10px] text-white/45 tracking-wider uppercase font-semibold">Subscribers on YouTube</div>
                        </div>
                    </div>
                </div>

                {/* Right Feature Grid */}
                <div style={{ background: "rgba(15,22,40,0.8)", border: "1px solid rgba(30,45,70,0.8)", borderRadius: "16px", padding: "28px", backdropFilter: "blur(10px)" }} className="w-full">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                        <div style={{ width: "28px", height: "28px", background: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                        </div>
                        <span className="font-semibold text-lg md:text-xl text-white">Everything You Need to Crack JEE</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
                        {features.slice(0, 6).map((f, i) => (
                            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "14px 16px" }}>
                                <div style={{ marginBottom: "8px" }}>{f.icon}</div>
                                <div style={{ fontWeight: "600", fontSize: "13px", color: "#fff", marginBottom: "4px" }}>{f.title}</div>
                                <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.45)", lineHeight: "1.5" }}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: "rgba(245,166,35,0.05)", border: "1px solid rgba(245,166,35,0.2)", borderRadius: "10px", padding: "14px 16px", marginTop: "2px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                        </svg>
                        <div>
                            <div style={{ fontWeight: "600", fontSize: "13px", color: "#F5A623", marginBottom: "5px" }}>Complete Revision Notes — You don&apos;t need to make them</div>
                            <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.45)", lineHeight: "1.55" }}>Chapter-wise, exam-ready revision notes and formula sheets for Physics &amp; Maths. Professionally written, downloadable PDFs.</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default HeroSection;