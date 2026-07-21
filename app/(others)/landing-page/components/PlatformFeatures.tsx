import { Card } from "@/components/ui/card";
import { 
  Calendar, 
  BookOpen, 
  FileText, 
  Clock, 
  MessageSquare, 
  TrendingUp, 
  Smartphone 
} from "lucide-react";

const featuresData = [
  {
    title: "Adaptive Study Timetable",
    desc: "Auto-generated daily schedules based on your exam date, topics remaining, and desired number of revisions — adjusts itself as you go.",
    icon: Calendar,
    iconColor: "text-[#2563EB]",
    iconBg: "bg-[#EBF1FF]",
    bullets: [
      "Set start/end dates & topics",
      "Mark off-days & auto-redistribute",
      "Progress tracker on dashboard",
      "Regular study + revision modes"
    ]
  },
  {
    title: "Practice Questions",
    desc: "50,000+ topic-wise JEE questions with full step-by-step solutions. Attempt at your pace — the platform tracks every right and wrong answer.",
    icon: BookOpen,
    iconColor: "text-[#EA580C]",
    iconBg: "bg-[#FFF3EB]",
    bullets: [
      "Chapter-wise question banks",
      "Step-by-step solutions",
      "Track correct / incorrect history",
      "Flag difficult questions for revision"
    ]
  },
  {
    title: "Revision Notes",
    desc: "Complete chapter-wise revision notes and formula sheets — professionally written and exam-ready. You don&apos;t need to make them yourself.",
    icon: FileText,
    iconColor: "text-[#94A3B8]",
    iconBg: "bg-[#F1F5F9]",
    bullets: [
      "Full Physics & Maths coverage",
      "Downloadable PDF per chapter",
      "Formula sheets — one per chapter",
      "Bulk download: entire subject in one PDF"
    ]
  },
  {
    title: "Mock Tests",
    desc: "Full-length timed mock tests in exact JEE Main & Advanced pattern — with instant scoring and All-India expected rank prediction.",
    icon: Clock,
    iconColor: "text-[#475569]",
    iconBg: "bg-[#F1F5F9]",
    bullets: [
      "JEE Main & Advanced patterns",
      "Real-time countdown timer",
      "Instant score + expected rank",
      "Full solutions after each test"
    ]
  },
  {
    title: "Doubt Resolution",
    desc: "Post any doubt anytime — get answers from faculty or fellow students. No doubt goes unanswered. No coaching class needed for that.",
    icon: MessageSquare,
    iconColor: "text-[#475569]",
    iconBg: "bg-[#F1F5F9]",
    bullets: [
      "Subject-wise discussion threads",
      "Faculty + peer responses",
      "Upvote & resolve threads",
      "Instant doubt notifications"
    ]
  },
  {
    title: "Performance Analytics",
    desc: "Know exactly where you&apos;re losing marks. In-depth dashboards show weak areas, timetable adherence, score trends and rank simulation.",
    icon: TrendingUp,
    iconColor: "text-[#EF4444]",
    iconBg: "bg-[#FEE2E2]",
    bullets: [
      "Topic-wise accuracy heatmaps",
      "Score trends over all mock tests",
      "Weak area detection & alerts",
      "Timetable adherence tracking"
    ]
  }
];

export default function PlatformFeatures() {
  return (
    <section className="bg-[#F4F6FB] py-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-[1800px] mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#C89B3C] text-[11px] font-bold tracking-[0.2em] uppercase mb-4">
            PLATFORM FEATURES
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight mb-6">
            Everything you need,{" "}
            <span className="italic text-[#E0A938] font-serif font-medium">
              nothing you don&apos;t
            </span>
          </h2>
          <p className="text-[#64748B] text-[15px] max-w-xl mx-auto leading-relaxed">
            Your notes are scattered. Your timetable is missing. Your doubts are unanswered.
            <br />
            ApexJEE fixes all three — in one place.
          </p>
        </div>

        {/* 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featuresData.map((f, index) => {
            const IconComponent = f.icon;

            return (
              <Card 
                key={index} 
                className="group border-0 p-8 flex flex-col justify-between hover:bg-[#0B1528] bg-white text-[#0F172A] hover:text-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(11,21,40,0.15)] rounded-2xl hover:rounded-3xl hover:translate-y-[-2px] transition-all duration-300 cursor-pointer"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${f.iconBg} group-hover:bg-[rgba(255,255,255,0.08)]`}>
                    <IconComponent className={`w-6 h-6 transition-colors duration-300 ${f.iconColor} group-hover:text-[#94A3B8]`} />
                  </div>
                  <h3 className="text-xl font-bold font-serif mb-4 text-[#0F172A] group-hover:text-white transition-colors duration-300">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-6 text-[#64748B] group-hover:text-[#94A3B8] transition-colors duration-300">
                    {f.desc}
                  </p>
                </div>
                <ul className="space-y-2.5">
                  {f.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-[#475569] group-hover:text-[#E2E8F0] transition-colors duration-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E0A938]" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        {/* Android App Promo Banner */}
        <div className="bg-[#0B1528] rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center gap-6 md:gap-10 shadow-[0_10px_30px_rgba(11,21,40,0.15)]">
          <div className="flex flex-col items-center justify-center min-w-[140px] text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(255,255,255,0.08)] flex items-center justify-center border border-[rgba(255,255,255,0.1)]">
              <Smartphone className="w-7 h-7 text-[#E0A938]" />
            </div>
            <span className="font-bold text-lg tracking-wide font-serif">
              Android App
            </span>
          </div>
          
          <div className="flex-1">
            <p className="text-sm text-[#94A3B8] leading-relaxed mb-6 text-center md:text-left">
              Full feature parity on mobile— study anywhere, take tests, check progress, and access all materials on the go.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-[#E2E8F0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0A938]" />
                  Complete mobile experience
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#E2E8F0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0A938]" />
                  Synced across web & mobile
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-[#E2E8F0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0A938]" />
                  Available on Google Play Store
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#E2E8F0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E0A938]" />
                  Offline-ready content access
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
