import Link from "next/link";

function NavBar() {
    return (
        <div
            style={{
                background: "linear-gradient(135deg, #0A0F1E 0%, #0D1525 40%, #0F1A2E 100%)",
            }}
            className="w-full"
        >
            {/* Navbar */}
            <nav
                style={{
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    background: "rgba(10,15,30,0.9)",
                    backdropFilter: "blur(10px)",
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                }}
                className="w-full"
            >
                <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-24 h-16 flex items-center justify-between">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "28px", height: "28px", background: "#F5A623", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px", color: "#000" }}>A</div>
                        <span style={{ fontWeight: "700", fontSize: "18px", letterSpacing: "-0.3px", color: "#f5a623ff" }}>Apex<span style={{ color: "#F5A623" }}>JEE</span></span>
                    </div>
                    <div className="flex items-center gap-6 md:gap-9">
                        {["About", "Features", "Pricing"].map((link) => (
                            <a key={link} href={`#${link.toLowerCase()}`} style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "14px", fontWeight: "500" }} className="hover:text-[#F5A623] transition-colors duration-200">{link}</a>
                        ))}
                        <Link href="/auth/login">
                            <button style={{ background: "#F5A623", color: "#000", border: "none", borderRadius: "6px", padding: "8px 20px", fontWeight: "600", fontSize: "14px", cursor: "pointer" }} className="hover:bg-[#E09610] transition-colors duration-200">
                                Start Free Trial
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    )
}
export default NavBar;