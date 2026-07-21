// "use client";

// import { Card } from "@/components/ui/card";

// const features = [
//   // feature objects omitted for brevity; copy from existing Featuressection.tsx
// ];

// export default function FeaturesSection() {
//   return (
//     <section className="bg-[#F0F2F8] py-0">
//       {/* Ticker / marquee strip */}
//       <div className="bg-[#1a2540] text-[#F5A623] text-xs font-semibold tracking-widest uppercase overflow-hidden py-2 mb-0">
//         <div className="flex gap-12 whitespace-nowrap px-8">
//           {[
//             "No class needed",
//             "Adaptive Study Timetables",
//             "Mock Tests · Practice Questions · Video Lectures",
//             "90% Cheaper than Coaching",
//             "Real-time Analytics",
//             "Available on Android",
//           ].map((t, i) => (
//             <span key={i} className="flex items-center gap-3">
//               <span className="text-white opacity-40">|</span>{t}
//             </span>
//           ))}
//         </div>
//       </div>
//       {/* Section content omitted for brevity */}
//     </section>
//   );
// }


"use client";

export default function FeaturesSection() {
  return (
    <section className="bg-[#F0F2F8] py-0">
      {/* Ticker / marquee strip */}
      <div className="bg-[#1a2540] text-[#F5A623] text-xs font-semibold tracking-widest uppercase overflow-hidden py-2">
        <div className="flex gap-12 whitespace-nowrap px-[80px]">
          {[
            "No class needed",
            "Adaptive Study Timetables",
            "Mock Tests · Practice Questions · Video Lectures",
            "90% Cheaper than Coaching",
            "Real-time Analytics",
            "Available on Android",
          ].map((t, i) => (
            <span key={i} className="flex items-center gap-3">
              <span className="text-white opacity-40">|</span>{t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}