
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTAFooter() {
    const platformLinks = [
        "Study Material",
        "Mock Tests",
        "Practice Questions",
        "Smart Timetable",
        "Discussion Forum",
        "Android App",
    ];
    const companyLinks = ["About Us", "Pricing", "Blog", "Careers", "Contact"];
    const legalLinks = [
        "Terms of Service",
        "Privacy Policy",
        "Refund Policy",
        "Cookie Policy",
    ];

    return (
        <>
            {/* CTA Section */}
            <section
                className="py-20 text-center relative overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #0A0F1E 0%, #0D1525 60%, #0F1A2E 100%)",
                }}
            >
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-2">
                        Your IIT dream doesn&apos;t
                    </h2>
                    <h2
                        className="text-4xl md:text-5xl font-bold italic text-[#F5A623] leading-tight mb-8"
                        style={{ fontFamily: "Georgia, serif" }}
                    >
                        need a coaching class.
                    </h2>
                    <p className="text-[rgba(255,255,255,0.6)] text-base mb-2">
                        Built by the channel with 1,00,000 students. For the student who is serious.
                    </p>
                    <p className="text-[rgba(255,255,255,0.45)] text-sm mb-10">
                        Start your free trial today — no credit card, no commitments.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link href="/auth/login">
                            <Button className="bg-[#F5A623] text-black hover:bg-[#E09610] font-semibold px-7 h-12 text-sm rounded-lg flex items-center gap-2">
                                <span className="text-lg">+</span>
                                Begin Your Free Trial
                            </Button>
                        </Link>
                        <Link href="#pricing">
                            <Button
                                variant="outline"
                                className=" bg-blue-900 text-white hover:bg-blue-700 font-semibold px-7 h-12 text-sm rounded-lg flex items-center gap-2"
                            >
                                View Pricing
                            </Button>
                        </Link>
                    </div>

                    <p className="text-[rgba(255,255,255,0.3)] text-xs mt-6">
                        Free trial available • No credit card required • Cancel anytime.
                    </p>
                </div>
            </section >

            {/* Footer */}
            < footer
                className="py-12 mx-auto max-w-full h-full"
                style={{ background: "#080D18", borderTop: "1px solid rgba(255,255,255,0.05)" }
                }
            >
                <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_1fr_1fr] gap-10 mb-10">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 bg-[#F5A623] rounded-md flex items-center justify-center font-bold text-sm text-black">
                                    A
                                </div>
                                <span className="font-bold text-lg text-white">
                                    Apex<span className="text-[#F5A623]">JEE</span>
                                </span>
                            </div>
                            <p className="text-[rgba(255,255,255,0.4)] text-xs leading-relaxed mb-4">
                                India&apos;s most affordable and complete self-study system for IIT JEE — Physics and
                                Mathematics. Built for aspirants who refuse to compromise.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {["Physics", "Mathematics", "JEE Main & Advanced"].map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-[10px] text-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.1)] rounded-full px-3 py-1"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Platform */}
                        <div>
                            <p className="text-white text-xs font-bold tracking-widest uppercase mb-4">Platform</p>
                            <ul className="space-y-2.5">
                                {platformLinks.map((l) => (
                                    <li key={l}>
                                        <a href="#" className="text-[rgba(255,255,255,0.45)] text-sm hover:text-white transition-colors">
                                            {l}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <p className="text-white text-xs font-bold tracking-widest uppercase mb-4">Company</p>
                            <ul className="space-y-2.5">
                                {companyLinks.map((l) => (
                                    <li key={l}>
                                        <a href="#" className="text-[rgba(255,255,255,0.45)] text-sm hover:text-white transition-colors">
                                            {l}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <p className="text-white text-xs font-bold tracking-widest uppercase mb-4">Legal</p>
                            <ul className="space-y-2.5">
                                {legalLinks.map((l) => (
                                    <li key={l}>
                                        <a href="#" className="text-[rgba(255,255,255,0.45)] text-sm hover:text-white transition-colors">
                                            {l}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div
                        className="flex flex-col md:flex-row items-center justify-between pt-6 gap-2"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                    >
                        <p className="text-[rgba(255,255,255,0.25)] text-xs">
                            © 2025 ApexJEE. All rights reserved.
                        </p>
                        <p className="text-[rgba(255,255,255,0.25)] text-xs">
                            Designed for the aspirant who believes in self-reliance.
                        </p>
                    </div>
                </div>
            </footer >
        </>
    );
}