"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { planApi } from "@/lib/api/user/plan";

export default function PricingSection() {
    const { data: plansData, isLoading } = useQuery({
        queryKey: ["public-plans"],
        queryFn: planApi.getAllPlans,
    });

    const plans = plansData?.data || [];

    if (isLoading) {
        return (
            <section id="pricing" className="bg-[#F0F2F8] py-20 px-6 md:px-12 lg:px-20">
                <div className="max-w-[1600px] mx-auto text-center py-20">
                    <p className="text-[#F5A623] font-semibold">Loading plans...</p>
                </div>
            </section>
        );
    }

    return (
        <section id="pricing" className="bg-[#F0F2F8] py-20 px-6 md:px-12 lg:px-20">
            <div className="max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="text-center mb-14">
                    <p className="text-[#F5A623] text-xs font-bold tracking-widest uppercase mb-3">Pricing</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#0D1525] leading-tight mb-1">
                        Transparent. Affordable.
                    </h2>
                    <h2 className="text-4xl md:text-5xl font-bold italic text-[#F5A623] font-serif leading-tight mb-6">
                        No hidden costs.
                    </h2>
                    <p className="text-[#6B7280] text-sm max-w-md mx-auto leading-relaxed">
                        Choose the plan that fits your preparation timeline. Cancel anytime. All plans include full
                        Physics &amp; Maths content.
                    </p>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-7 items-stretch">
                    {plans.map((plan: any, i: number) => {
                        const isFree = plan.price === 0;
                        const isPopular = plan.badge === "MOST POPULAR";
                        const isHighlight = plan.highlight;
                        const priceDisplay = isFree ? "Free" : `₹${plan.price}`;

                        let periodDisplay = null;
                        if (plan.billingCycleDays === 30) periodDisplay = "per month, billed monthly";
                        else if (plan.billingCycleDays === 90) periodDisplay = `per 3 months — save ${plan.savePercent || 0}%`;
                        else if (plan.billingCycleDays === 365) periodDisplay = `per year — save ${plan.savePercent || 0}%`;
                        
                        const priceNote = plan.trialDays > 0 ? `${plan.trialDays} Days Free. No card required.` : null;
                        const tag = plan.name; // e.g. "Monthly"

                        return (
                        <div
                            key={i}
                            className={`group relative rounded-2xl flex flex-col shadow-sm hover:-translate-y-1 transition-all duration-300 transform ${isHighlight ? 'bg-[#0D1525] text-white border border-[#0D1525]' : 'bg-white text-[#0D1525] hover:bg-[#0D1525] hover:text-white border border-black/[0.06] hover:border-[rgba(245,166,35,0.2)] hover:shadow-[0_15px_40px_rgba(11,21,40,0.18)]'}`}
                        >
                            {isPopular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                    <span className="bg-[#F5A623] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="p-5 flex flex-col gap-5 flex-1">
                                {/* Tag */}
                                <div>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isHighlight ? 'text-white/45' : 'text-[#9CA3AF] group-hover:text-white/45'}`}>
                                        {tag}
                                    </p>
                                    {plan.isTrial && (
                                        <div className="flex items-center gap-1 mb-2">
                                            <span className="w-2 h-2 rounded-full bg-[#F5A623]" />
                                            <span className="text-[10px] text-[#F5A623] font-semibold">{plan.trialDays} Days Free</span>
                                        </div>
                                    )}
                                    <p
                                        className={`text-4xl font-bold leading-none transition-colors duration-200 ${isHighlight ? 'text-white' : 'text-[#0D1525] group-hover:text-white'}`}
                                        style={{ fontFamily: "Georgia, serif" }}
                                    >
                                        {priceDisplay}
                                    </p>
                                    {periodDisplay && (
                                        <p className={`text-xs mt-1 ${isHighlight ? 'text-white/45' : 'text-[#9CA3AF] group-hover:text-white/45'}`}>
                                            {periodDisplay}
                                        </p>
                                    )}
                                    {priceNote && <p className={`text-xs mt-1 ${isHighlight ? 'text-white/40' : 'text-[#9CA3AF] group-hover:text-white/40'}`}>{priceNote}</p>}
                                </div>

                                {/* Divider */}
                                <div className={`h-px ${isHighlight ? 'bg-white/10' : 'bg-[#F3F4F6] group-hover:bg-white/10'}`} />

                                {/* Features */}
                                <ul className="flex flex-col gap-2 flex-1">
                                    {plan.features?.map((feat: any, j: number) => (
                                        <li key={j} className="flex items-start gap-2">
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                className={`mt-0.5 shrink-0 transition-colors duration-200 ${isHighlight ? 'text-[#F5A623]' : 'text-[#6B7280] group-hover:text-[#F5A623]'}`}
                                            >
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            <span className={`text-xs leading-relaxed transition-colors duration-200 ${isHighlight ? 'text-white/70' : 'text-[#374151] group-hover:text-white/70'}`}>
                                                {feat.label}
                                            </span >
                                        </li >
                                    ))}
                                </ul >

                                {/* CTA */}
                                <Link href="/auth/login" className="w-full mt-2">
                                    <Button
                                        variant={isHighlight ? "default" : "outline"}
                                        className={`w-full text-sm h-10 rounded-lg font-semibold transition-all duration-300 ${isHighlight ? 'bg-[#F5A623] hover:bg-[#F5A623]/90 text-black border-none' : 'border-[#0D1525] text-[#0D1525] group-hover:bg-[#F5A623] group-hover:text-black group-hover:border-[#F5A623]'}`}
                                    >
                                        {plan.ctaLabel || "Get Started"}
                                    </Button>
                                </Link>
                            </div >
                        </div >
                    )})}
                </div >
            </div >
        </section >
    );
}