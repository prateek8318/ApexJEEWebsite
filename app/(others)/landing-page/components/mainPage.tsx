// "use client";

// export default function HomePage() {
//   const features = [
//     {
//       icon: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
//           <polygon points="23 7 16 12 23 17 23 7" />
//           <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
//         </svg>
//       ),
//       title: "Video Lectures",
//       desc: "Chapter-wise videos mapped to the full JEE syllabus",
//     },
//     {
//       icon: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
//           <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
//         </svg>
//       ),
//       title: "Practice Questions",
//       desc: "Topic-wise questions with step-by-step solutions",
//     },
//     {
//       icon: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
//           <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
//         </svg>
//       ),
//       title: "Mock Tests",
//       desc: "JEE-Main & Advanced pattern — timed, realistic",
//     },
//     {
//       icon: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
//           <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
//         </svg>
//       ),
//       title: "Smart Timetable",
//       desc: "Auto-adapts to your pace, off-days and exam date",
//     },
//     {
//       icon: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
//           <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
//         </svg>
//       ),
//       title: "Performance Analytics",
//       desc: "Weak-topic detection and expected rank after every test",
//     },
//     {
//       icon: (
//         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
//           <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//         </svg>
//       ),
//       title: "Doubt Forum",
//       desc: "Ask doubts anytime — answered by faculty & peers",
//     },
//   ];

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg, #0A0F1E 0%, #0D1525 40%, #0F1A2E 100%)",
//         fontFamily: "'Inter', sans-serif",
//       }}
//     >
//       {/* Navbar */}
//       <nav
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: "0 48px",
//           height: "60px",
//           borderBottom: "1px solid rgba(255,255,255,0.05)",
//           background: "rgba(10,15,30,0.9)",
//           backdropFilter: "blur(10px)",
//           position: "sticky",
//           top: 0,
//           zIndex: 100,
//         }}
//       >
//         {/* Logo */}
//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <div
//             style={{
//               width: "28px",
//               height: "28px",
//               background: "#F5A623",
//               borderRadius: "6px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontWeight: "700",
//               fontSize: "14px",
//               color: "#000",
//             }}
//           >
//             A
//           </div>
//           <span style={{ fontWeight: "700", fontSize: "18px", letterSpacing: "-0.3px" }}>
//             Apex<span style={{ color: "#F5A623" }}>JEE</span>
//           </span>
//         </div>

//         {/* Nav Links */}
//         <div style={{ display: "flex", alignItems: "center", gap: "36px" }}>
//           {["About", "Features", "Pricing"].map((link) => (
//             <a
//               key={link}
//               href="#"
//               style={{
//                 color: "rgba(255,255,255,0.75)",
//                 textDecoration: "none",
//                 fontSize: "14px",
//                 fontWeight: "500",
//                 transition: "color 0.2s",
//               }}
//               onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
//               onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
//             >
//               {link}
//             </a>
//           ))}
//           <button
//             style={{
//               background: "#F5A623",
//               color: "#000",
//               border: "none",
//               borderRadius: "6px",
//               padding: "8px 20px",
//               fontWeight: "600",
//               fontSize: "14px",
//               cursor: "pointer",
//               transition: "background 0.2s, transform 0.1s",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "#E09610";
//               e.currentTarget.style.transform = "translateY(-1px)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "#F5A623";
//               e.currentTarget.style.transform = "translateY(0)";
//             }}
//           >
//             Start Free Trial
//           </button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <main
//         style={{
//           maxWidth: "1100px",
//           margin: "0 auto",
//           padding: "80px 48px 60px",
//           display: "grid",
//           gridTemplateColumns: "1fr 1.1fr",
//           gap: "60px",
//           alignItems: "center",
//         }}
//       >
//         {/* Left Column */}
//         <div>
//           {/* Badge */}
//           <div
//             style={{
//               display: "inline-flex",
//               alignItems: "center",
//               gap: "6px",
//               background: "rgba(245,166,35,0.1)",
//               border: "1px solid rgba(245,166,35,0.3)",
//               borderRadius: "20px",
//               padding: "5px 14px",
//               marginBottom: "28px",
//             }}
//           >
//             <span style={{ color: "#F5A623", fontSize: "8px" }}>●</span>
//             <span
//               style={{
//                 color: "#F5A623",
//                 fontSize: "11px",
//                 fontWeight: "600",
//                 letterSpacing: "0.8px",
//                 textTransform: "uppercase",
//               }}
//             >
//               India&apos;s First Complete Self-Study System
//             </span>
//           </div>

//           {/* Headline */}
//           <h1
//             style={{
//               fontSize: "52px",
//               fontWeight: "700",
//               lineHeight: "1.1",
//               letterSpacing: "-1px",
//               color: "#fff",
//               marginBottom: "8px",
//             }}
//           >
//             Crack IIT JEE
//           </h1>

//           {/* Italic subheadline */}
//           <p
//             style={{
//               fontSize: "44px",
//               fontWeight: "700",
//               fontStyle: "italic",
//               color: "#F5A623",
//               lineHeight: "1.2",
//               marginBottom: "20px",
//               fontFamily: "Georgia, serif",
//             }}
//           >
//             On Your Own Terms
//           </p>

//           {/* Description */}
//           <p
//             style={{
//               fontSize: "15px",
//               color: "rgba(255,255,255,0.6)",
//               lineHeight: "1.6",
//               marginBottom: "36px",
//               maxWidth: "380px",
//             }}
//           >
//             The complete self-study system for IIT JEE — without the ₹1,50,000 coaching fee
//           </p>

//           {/* CTA Buttons */}
//           <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "36px" }}>
//             <button
//               style={{
//                 background: "#F5A623",
//                 color: "#000",
//                 border: "none",
//                 borderRadius: "7px",
//                 padding: "12px 24px",
//                 fontWeight: "600",
//                 fontSize: "14px",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 transition: "background 0.2s, transform 0.1s",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = "#E09610";
//                 e.currentTarget.style.transform = "translateY(-1px)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = "#F5A623";
//                 e.currentTarget.style.transform = "translateY(0)";
//               }}
//             >
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                 <circle cx="12" cy="12" r="10" />
//                 <polyline points="12 8 16 12 12 16" />
//                 <line x1="8" y1="12" x2="16" y2="12" />
//               </svg>
//               Start Free Trial
//             </button>
//             <button
//               style={{
//                 background: "transparent",
//                 color: "#fff",
//                 border: "1px solid rgba(255,255,255,0.2)",
//                 borderRadius: "7px",
//                 padding: "12px 22px",
//                 fontWeight: "500",
//                 fontSize: "14px",
//                 cursor: "pointer",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 transition: "border-color 0.2s, transform 0.1s",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)";
//                 e.currentTarget.style.transform = "translateY(-1px)";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
//                 e.currentTarget.style.transform = "translateY(0)";
//               }}
//             >
//               Explore Features
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <polyline points="9 18 15 12 9 6" />
//               </svg>
//             </button>
//           </div>

//           {/* YouTube social proof */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "14px",
//               background: "rgba(255,255,255,0.04)",
//               border: "1px solid rgba(255,255,255,0.08)",
//               borderRadius: "10px",
//               padding: "12px 18px",
//               width: "fit-content",
//             }}
//           >
//             <div
//               style={{
//                 width: "36px",
//                 height: "36px",
//                 background: "rgba(255,255,255,0.08)",
//                 borderRadius: "50%",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 flexShrink: 0,
//               }}
//             >
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
//                 <polygon points="5 3 19 12 5 21 5 3" />
//               </svg>
//             </div>
//             <div>
//               <div style={{ fontWeight: "700", fontSize: "16px", color: "#fff" }}>1,00,000+</div>
//               <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
//                 Subscribers on YouTube
//               </div>
//             </div>
//             <div
//               style={{
//                 marginLeft: "8px",
//                 paddingLeft: "14px",
//                 borderLeft: "1px solid rgba(255,255,255,0.1)",
//                 fontSize: "11px",
//                 color: "rgba(255,255,255,0.35)",
//                 lineHeight: "1.5",
//               }}
//             >
//               <div>Stick to the channel</div>
//               <div>student trust</div>
//             </div>
//           </div>
//         </div>

//         {/* Right Column — Feature Grid Card */}
//         <div
//           style={{
//             background: "rgba(15,22,40,0.8)",
//             border: "1px solid rgba(30,45,70,0.8)",
//             borderRadius: "16px",
//             padding: "28px",
//             backdropFilter: "blur(10px)",
//           }}
//         >
//           {/* Card header */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//               marginBottom: "24px",
//             }}
//           >
//             <div
//               style={{
//                 width: "28px",
//                 height: "28px",
//                 background: "rgba(245,166,35,0.15)",
//                 border: "1px solid rgba(245,166,35,0.3)",
//                 borderRadius: "6px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
//                 <polyline points="9 11 12 14 22 4" />
//                 <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
//               </svg>
//             </div>
//             <span style={{ fontWeight: "600", fontSize: "15px", color: "#fff" }}>
//               Everything You Need to Crack JEE
//             </span>
//           </div>

//           {/* 2-col grid of 6 features */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: "2px",
//               marginBottom: "2px",
//             }}
//           >
//             {features.slice(0, 6).map((f, i) => (
//               <div
//                 key={i}
//                 style={{
//                   background: "rgba(255,255,255,0.02)",
//                   border: "1px solid rgba(255,255,255,0.06)",
//                   borderRadius: "10px",
//                   padding: "14px 16px",
//                   transition: "background 0.2s, border-color 0.2s",
//                   cursor: "default",
//                 }}
//                 onMouseEnter={(e) => {
//                   (e.currentTarget as HTMLDivElement).style.background = "rgba(245,166,35,0.05)";
//                   (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(245,166,35,0.2)";
//                 }}
//                 onMouseLeave={(e) => {
//                   (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)";
//                   (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
//                 }}
//               >
//                 <div style={{ marginBottom: "8px" }}>{f.icon}</div>
//                 <div style={{ fontWeight: "600", fontSize: "13px", color: "#fff", marginBottom: "4px" }}>
//                   {f.title}
//                 </div>
//                 <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.45)", lineHeight: "1.5" }}>
//                   {f.desc}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Wide bottom card - Complete Revision Notes */}
//           <div
//             style={{
//               background: "rgba(245,166,35,0.05)",
//               border: "1px solid rgba(245,166,35,0.2)",
//               borderRadius: "10px",
//               padding: "14px 16px",
//               marginTop: "2px",
//               display: "flex",
//               gap: "14px",
//               alignItems: "flex-start",
//               transition: "background 0.2s",
//               cursor: "default",
//             }}
//             onMouseEnter={(e) => {
//               (e.currentTarget as HTMLDivElement).style.background = "rgba(245,166,35,0.1)";
//             }}
//             onMouseLeave={(e) => {
//               (e.currentTarget as HTMLDivElement).style.background = "rgba(245,166,35,0.05)";
//             }}
//           >
//             <div style={{ flexShrink: 0, marginTop: "2px" }}>
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2">
//                 <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//                 <polyline points="14 2 14 8 20 8" />
//                 <line x1="16" y1="13" x2="8" y2="13" />
//                 <line x1="16" y1="17" x2="8" y2="17" />
//                 <polyline points="10 9 9 9 8 9" />
//               </svg>
//             </div>
//             <div>
//               <div style={{ fontWeight: "600", fontSize: "13px", color: "#F5A623", marginBottom: "5px" }}>
//                 Complete Revision Notes — You don&apos;t need to make them
//               </div>
//               <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.45)", lineHeight: "1.55" }}>
//                 Chapter-wise, exam-ready revision notes and formula sheets for Physics & Maths. Professionally written, downloadable PDFs — nothing left for you to compile.
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


