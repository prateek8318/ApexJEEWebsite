// "use client";

// export default function FounderSection() {
//     return (
//         <section
//             className="py-20 relative overflow-hidden"
//             style={{
//                 background: "linear-gradient(135deg, #0A0F1E 0%, #0D1525 50%, #0F1A2E 100%)",
//             }}
//         >
//             <div
//                 className="absolute inset-0 opacity-[0.04]"
//                 style={{
//                     backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
//                     backgroundSize: "40px 40px",
//                 }}
//             />

//             <div className="max-w-[1100px] mx-auto px-[80px] relative z-10">
//                 <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-20 items-start">
//                     <div className="flex flex-col w-full gap-10">
//                         <div className="relative">
//                             <div
//                                 className="w-44 h-44 rounded-full flex items-center justify-center text-5xl font-bold text-[#F5A623]"
//                                 style={{
//                                     background: "radial-gradient(circle, #1a2a4a 0%, #0d1830 100%)",
//                                     border: "2px solid rgba(245,166,35,0.3)",
//                                     boxShadow: "0 0 40px rgba(245,166,35,0.08)",
//                                     fontFamily: "Georgia, serif",
//                                     letterSpacing: "2px",
//                                 }}
//                             >
//                                 US
//                             </div>
//                         </div>
//                         <div className="flex flex-col gap-4 w-full">
//                             <div
//                                 className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white"
//                                 style={{
//                                     background: "rgba(255,255,255,0.05)",
//                                     border: "1px solid rgba(255,255,255,0.08)",
//                                 }}
//                             >
//                                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
//                                     <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
//                                     <path d="M6 12v5c3 3 9 3 12 0v-5" />
//                                 </svg>
//                                 <span className="text-[rgba(255,255,255,0.8)] text-xs">IIT Roorkee — Computer Science</span>
//                             </div>
//                             <div
//                                 className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white"
//                                 style={{
//                                     background: "rgba(255,255,255,0.05)",
//                                     border: "1px solid rgba(255,255,255,0.08)",
//                                 }}
//                             >
//                                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
//                                     <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
//                                     <polyline points="9 22 9 12 15 12 15 22" />
//                                 </svg>
//                                 <span className="text-[rgba(255,255,255,0.8)] text-xs">Princeton University, USA — Masters</span>
//                             </div>
//                         </div>
//                     </div>
//                     <div>
//                         <p className="text-[#F5A623] text-xs font-bold tracking-widest uppercase mb-3">
//                             The Mind Behind ApexJEE
//                         </p>
//                         <h2
//                             className="text-5xl font-bold text-white mb-5"
//                             style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.5px" }}
//                         >
//                             Udai Singh
//                         </h2>
//                         <p className="text-[rgba(255,255,255,0.45)] italic text-sm mb-1">
//                             The theory was always free.
//                         </p>
//                         <p className="text-[#F5A623] italic text-sm mb-8">
//                             Now, get the system that converts it into a rank.
//                         </p>
//                         <div
//                             className="rounded-2xl p-6 relative"
//                             style={{
//                                 background: "rgba(255,255,255,0.04)",
//                                 border: "1px solid rgba(255,255,255,0.08)",
//                             }}
//                         >
//                             <span
//                                 className="absolute top-4 left-5 text-5xl text-[#F5A623] opacity-30 font-serif leading-none"
//                                 aria-hidden
//                             >
//                                 &ldquo;
//                             </span>
//                             <p className="text-[rgba(255,255,255,0.75)] text-sm leading-relaxed pl-4">
//                                 I built ApexJEE with one clear principle:{" "}
//                                 <strong className="text-white font-semibold">
//                                     a serious student should never have to step outside this platform for anything
//                                 </strong>{" "}
//                                 during their JEE preparation. Everything you need — the theory, the practice questions, the mock tests that feel like the real exam, the timetable that actually adapts to your life, the doubt resolution, the analytics that show exactly where you&apos;re losing marks — all of it is here, fully integrated, and designed to work as one coherent system. Not a collection of links and PDFs, but a complete, structured path from Day 1 to Rank 1.
//                             </p>
//                         </div>

//                         {/* Stats row */}
//                         <div className="grid grid-cols-3 gap-6 mt-10">
//                             {[
//                                 { value: "1,00,000+", label: "YouTube Students" },
//                                 { value: "IIT Roorkee", label: "Alma Mater" },
//                                 { value: "Princeton", label: "Masters, USA" },
//                             ].map((s, i) => (
//                                 <div key={i}>
//                                     <p
//                                         className="text-2xl font-bold text-[#F5A623]"
//                                         style={{ fontFamily: "Georgia, serif" }}
//                                     >
//                                         {s.value}
//                                     </p>
//                                     <p className="text-[rgba(255,255,255,0.35)] text-xs uppercase tracking-widest mt-1">
//                                         {s.label}
//                                     </p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }




"use client";

export default function FounderSection() {
    return (
        <section
            className="py-20 relative overflow-hidden"
            style={{
                background: "linear-gradient(135deg, #0A0F1E 0%, #0D1525 50%, #0F1A2E 100%)",
            }}
        >
            {/* Subtle grid background */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-16 md:gap-24 items-start">

                    {/* Left — Avatar + credentials */}
                    <div className="flex flex-col w-full gap-10">
                        {/* Avatar ring */}
                        <div className="relative">
                            <div
                                className="w-44 h-44 rounded-full flex items-center justify-center text-5xl font-bold text-[#F5A623]"
                                style={{
                                    background: "radial-gradient(circle, #1a2a4a 0%, #0d1830 100%)",
                                    border: "2px solid rgba(245,166,35,0.3)",
                                    boxShadow: "0 0 40px rgba(245,166,35,0.08)",
                                    fontFamily: "Georgia, serif",
                                    letterSpacing: "2px",
                                }}
                            >
                                US
                            </div>
                        </div>

                        {/* Credential cards */}
                        <div className="flex flex-col gap-3 w-full">
                            <div
                                className="flex items-center gap-3 px-4 py-4 rounded-xl text-sm text-white"
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" style={{ flexShrink: 0 }}>
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                </svg>
                                <div>
                                    <p className="text-[rgba(255,255,255,0.4)] text-[10px] uppercase tracking-widest mb-0.5">Undergraduate</p>
                                    <p className="text-[rgba(255,255,255,0.85)] text-xs font-medium">IIT Roorkee — Computer Science</p>
                                </div>
                            </div>
                            <div
                                className="flex items-center gap-3 px-4 py-4 rounded-xl text-sm text-white"
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" style={{ flexShrink: 0 }}>
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                    <polyline points="9 22 9 12 15 12 15 22" />
                                </svg>
                                <div>
                                    <p className="text-[rgba(255,255,255,0.4)] text-[10px] uppercase tracking-widest mb-0.5">Postgraduate</p>
                                    <p className="text-[rgba(255,255,255,0.85)] text-xs font-medium">Princeton University, USA — Masters</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right — Bio */}
                    <div>
                        <p className="text-[#F5A623] text-xs font-bold tracking-widest uppercase mb-3">
                            The Mind Behind ApexJEE
                        </p>
                        <h2
                            className="text-5xl font-bold text-white mb-5"
                            style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.5px" }}
                        >
                            Udai Singh
                        </h2>
                        <p className="text-[rgba(255,255,255,0.45)] italic text-sm mb-1">
                            The theory was always free.
                        </p>
                        <p className="text-[#F5A623] italic text-sm mb-8">
                            Now, get the system that converts it into a rank.
                        </p>

                        {/* Quote card */}
                        <div
                            className="rounded-2xl p-6 relative"
                            style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                            }}
                        >
                            <span
                                className="absolute top-4 left-5 text-5xl text-[#F5A623] opacity-30 font-serif leading-none"
                                aria-hidden
                            >
                                &ldquo;
                            </span>
                            <p className="text-[rgba(255,255,255,0.75)] text-sm leading-relaxed pl-4">
                                I built ApexJEE with one clear principle:{" "}
                                <strong className="text-white font-semibold">
                                    a serious student should never have to step outside this platform for anything
                                </strong>{" "}
                                during their JEE preparation. Everything you need — the theory, the practice questions, the mock tests that feel like the real exam, the timetable that actually adapts to your life, the doubt resolution, the analytics that show exactly where you&apos;re losing marks — all of it is here, fully integrated, and designed to work as one coherent system. Not a collection of links and PDFs, but a complete, structured path from Day 1 to Rank 1.
                            </p>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-6 mt-10">
                            {[
                                { value: "1,00,000+", label: "YouTube Students" },
                                { value: "IIT Roorkee", label: "Alma Mater" },
                                { value: "Princeton", label: "Masters, USA" },
                            ].map((s, i) => (
                                <div key={i}>
                                    <p
                                        className="text-2xl font-bold text-[#F5A623]"
                                        style={{ fontFamily: "Georgia, serif" }}
                                    >
                                        {s.value}
                                    </p>
                                    <p className="text-[rgba(255,255,255,0.35)] text-xs uppercase tracking-widest mt-1">
                                        {s.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}