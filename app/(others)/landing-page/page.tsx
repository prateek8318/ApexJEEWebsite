import FounderSection from "./components/Foundersection";
import TestimonialsSection from "./components/Testimonialssection ";
import CTAFooter from "./components/Ctafooter";
import { PricingSection, HeroSection, NavBar, PlatformFeatures } from "./components";

export default function Home() {
    return (
        <div style={{ fontFamily: "'Inter', sans-serif" }}>
            <NavBar />
            <HeroSection />
            <PlatformFeatures />
            <FounderSection />
            <PricingSection />
            <TestimonialsSection />
            <CTAFooter />
        </div>
    );
}