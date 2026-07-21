"use client";
import { Button } from "@/components/ui/button";

const plans = [
  {
    tag: "7 Days Free",
    period: null,
    name: "Free",
    price: null,
    priceNote: "7 Days. No card required.",
    features: [
      "Full Access to all content",
      "Practice question – all topics",
      "1 mock tests (JEE main)",
      "Revision notes & formula Sheets",
      "Smart timetable (Limited)",
      "Discussion forum access",
    ],
    cta: "Start Free Trial →",
    ctaVariant: "outline" as const,
    popular: false,
    dark: false,
  },
  {
    tag: "Monthly",
    period: "per month, billed monthly",
    name: "₹199",
    price: null,
    priceNote: null,
    features: [
      "Full study material access",
      "Chapter-wise practice questions",
      "2 mock tests per month",
      "Basic performance analytics",
      "Discussion forum access",
      "Android app access",
    ],
    cta: "Get Started",
    ctaVariant: "dark" as const,
    popular: false,
    dark: false,
  },
  {
    tag: "Quarterly",
    period: "per 3 months — save 17%",
    name: "₹499",
    price: null,
    priceNote: null,
    features: [
      "Everything in Monthly",
      "Unlimited mock tests",
      "Smart adaptive timetable",
      "Full performance analytics",
      "Expected rank after every test",
      "Priority doubt resolution",
    ],
    cta: "Start Free Trial",
    ctaVariant: "default" as const,
    popular: true,
    dark: true,
  },
  {
    tag: "Yearly",
    period: "per year — save 37%",
    name: "₹1,499",
    price: null,
    priceNote: null,
    features: [
      "Everything in Quarterly",
      "Personalised faculty messages",
      "Tutor/school progress access",
      "Early access to new features",
      "Downloadable study reports",
      "Dedicated support",
    ],
    cta: "Get Started",
    ctaVariant: "dark" as const,
    popular: false,
    dark: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-[#F0F2F8] py-5 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#F5A623] text-xs font-bold tracking-widest uppercase mb-3">
            Pricing
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0D1525] leading-tight mb-1">
            Transparent. Affordable.
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold italic text-[#F5A623] font-serif leading-tight mb-6">
            No hidden costs.
          </h2>
          <p className="text-[#6B7280] text-sm max-w-md mx-auto leading-relaxed">
            Choose the plan that fits your preparation timeline. Cancel anytime.
            All plans include full Physics &amp; Maths content.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-7 items-stretch">
          {plans.map((plan, i) => (
            <div
              key={i}
              className="group relative rounded-2xl flex flex-col bg-white text-[#0D1525] hover:bg-[#0D1525] hover:text-white border border-black/[0.06] hover:border-[rgba(245,166,35,0.2)] shadow-sm hover:shadow-[0_15px_40px_rgba(11,21,40,0.18)] hover:-translate-y-1 transition-all duration-300 transform"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-[#F5A623] text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-5 flex flex-col gap-5 flex-1">
                {/* Tag */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-[#9CA3AF] group-hover:text-white/45">
                    {plan.tag}
                  </p>
                  {plan.tag === "7 Days Free" && (
                    <div className="flex items-center gap-1 mb-2">
                      <span className="w-2 h-2 rounded-full bg-[#F5A623]" />
                      <span className="text-[10px] text-[#F5A623] font-semibold">
                        7 Days Free
                      </span>
                    </div>
                  )}
                  <p
                    className="text-4xl font-bold leading-none text-[#0D1525] group-hover:text-white transition-colors duration-200"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {plan.name}
                  </p>
                  {plan.period && (
                    <p className="text-xs mt-1 text-[#9CA3AF] group-hover:text-white/45">
                      {plan.period}
                    </p>
                  )}
                  {plan.priceNote && (
                    <p className="text-xs mt-1 text-[#9CA3AF] group-hover:text-white/40">
                      {plan.priceNote}
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-[#F3F4F6] group-hover:bg-white/10" />

                {/* Features */}
                <ul className="flex flex-col gap-2 flex-1">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="mt-0.5 shrink-0 text-[#6B7280] group-hover:text-[#F5A623] transition-colors duration-200"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-xs leading-relaxed text-[#374151] group-hover:text-white/70 transition-colors duration-200">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant="outline"
                  className="w-full mt-2 text-sm h-10 rounded-lg font-semibold border-[#0D1525] text-[#0D1525] group-hover:bg-[#F5A623] group-hover:text-black group-hover:border-[#F5A623] transition-all duration-300"
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
