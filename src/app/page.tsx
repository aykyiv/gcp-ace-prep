/**
 * Landing Page
 *
 * Simple, clean homepage with clear value proposition
 * No fancy animations - just clean sections
 */

import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { StatsSection } from "@/components/landing/stats-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CTASection } from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorks />
      <CTASection />
    </main>
  );
}

// TODO: Add FAQ section
// TODO: Add domain overview section
