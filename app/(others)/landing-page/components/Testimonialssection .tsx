// "use client";

// const testimonials = [
//     {
//         stars: 5,
//         quote:
//             '"I couldn\'t afford coaching classes. ApexJEE gave me a structure I never had before — the timetable feature alone changed everything for me."',
//         name: "Rahul Sharma",
//         detail: "Lucknow — JEE Aspirant, 2025",
//         initials: "R",
//         color: "#2563EB",
//     },
//     {
//         stars: 5,
//         quote:
//             '"The mock tests feel exactly like the real exam. Getting my expected rank instantly after each test pushed me to improve every single week."',
//         name: "Priya Mehta",
//         detail: "Jaipur — JEE Advanced Aspirant",
//         initials: "P",
//         color: "#92400E",
//     },
//     {
//         stars: 5,
//         quote:
//             '"The discussion forum is incredible. I post a doubt and it\'s answered within hours — sometimes by other students who\'ve faced the same problem!"',
//         name: "Arjun Patel",
//         detail: "Pune — Dropper preparing for JEE 2026",
//         initials: "A",
//         color: "#065F46",
//     },
// ];

// export default function TestimonialsSection() {
//     return (
//         <section className="bg-[#F8F9FC] py-20">
//             <div className="max-w-5xl mx-auto px-6">
//                 {/* Header */}
//                 <div className="text-center mb-14">
//                     <p className="text-[#F5A623] text-xs font-bold tracking-widest uppercase mb-3">
//                         Student Stories
//                     </p>
//                     <h2 className="text-4xl md:text-5xl font-bold text-[#0D1525] leading-tight mb-1">
//                         Real aspirants.
//                     </h2>
//                     <h2 className="text-4xl md:text-5xl font-bold text-[#F5A623] leading-tight">
//                         Real results.
//                     </h2>
//                 </div>

//                 {/* Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                     {testimonials.map((t, i) => (
//                         <div
//                             key={i}
//                             className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
//                             style={{ border: "1px solid rgba(0,0,0,0.05)" }}
//                         >
//                             {/* Stars */}
//                             <div className="flex gap-0.5">
//                                 {Array.from({ length: t.stars }).map((_, j) => (
//                                     <svg
//                                         key={j}
//                                         width="16"
//                                         height="16"
//                                         viewBox="0 0 24 24"
//                                         fill="#F59E0B"
//                                         stroke="none"
//                                     >
//                                         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//                                     </svg>
//                                 ))}
//                             </div>

//                             {/* Quote */}
//                             <p className="text-[#374151] text-sm leading-relaxed italic flex-1">{t.quote}</p>

//                             {/* Author */}
//                             <div className="flex items-center gap-3 pt-2">
//                                 <div
//                                     className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
//                                     style={{ background: t.color }}
//                                 >
//                                     {t.initials}
//                                 </div>
//                                 <div>
//                                     <p className="text-[#0D1525] text-sm font-semibold">{t.name}</p>
//                                     <p className="text-[#9CA3AF] text-xs">{t.detail}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// }




"use client";

const testimonials = [
    {
        stars: 5,
        quote:
            '"I couldn\'t afford coaching classes. ApexJEE gave me a structure I never had before — the timetable feature alone changed everything for me."',
        name: "Rahul Sharma",
        detail: "Lucknow — JEE Aspirant, 2025",
        initials: "R",
        color: "#2563EB",
    },
    {
        stars: 5,
        quote:
            '"The mock tests feel exactly like the real exam. Getting my expected rank instantly after each test pushed me to improve every single week."',
        name: "Priya Mehta",
        detail: "Jaipur — JEE Advanced Aspirant",
        initials: "P",
        color: "#92400E",
    },
    {
        stars: 5,
        quote:
            '"The discussion forum is incredible. I post a doubt and it\'s answered within hours — sometimes by other students who\'ve faced the same problem!"',
        name: "Arjun Patel",
        detail: "Pune — Dropper preparing for JEE 2026",
        initials: "A",
        color: "#065F46",
    },
];

export default function TestimonialsSection() {
    return (
        <section className="bg-[#F8F9FC] py-20 px-6 md:px-12 lg:px-20">
            <div className="max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="text-center mb-14">
                    <p className="text-[#F5A623] text-xs font-bold tracking-widest uppercase mb-3">
                        Student Stories
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#0D1525] leading-tight mb-1">
                        Real aspirants.
                    </h2>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#F5A623] leading-tight">
                        Real results.
                    </h2>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
                            style={{ border: "1px solid rgba(0,0,0,0.05)" }}
                        >
                            {/* Stars */}
                            <div className="flex gap-0.5">
                                {Array.from({ length: t.stars }).map((_, j) => (
                                    <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-[#374151] text-sm leading-relaxed italic flex-1">{t.quote}</p>

                            {/* Author */}
                            <div className="flex items-center gap-3 pt-2">
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                                    style={{ background: t.color }}
                                >
                                    {t.initials}
                                </div>
                                <div>
                                    <p className="text-[#0D1525] text-sm font-semibold">{t.name}</p>
                                    <p className="text-[#9CA3AF] text-xs">{t.detail}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}