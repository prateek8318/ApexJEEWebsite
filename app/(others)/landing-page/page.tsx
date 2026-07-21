import FeaturesSection from "./components/Featuressection";
import FounderSection from "./components/Foundersection";
import TestimonialsSection from "./components/Testimonialssection ";
import CTAFooter from "./components/Ctafooter";
import { PricingSection, HeroSection, NavBar, PlatformFeatures } from "./components";

export default function Home() {
    return (
        <div style={{ fontFamily: "'Inter', sans-serif" }}>
            <NavBar />
            <HeroSection />
            <FeaturesSection />
            <PlatformFeatures />
            <FounderSection />
            <PricingSection />
            <TestimonialsSection />
            <CTAFooter />
        </div>
    );
}