import { AnimatedDashboard } from "@/components/animated-dashboard";
import { LandingNav } from "@/components/landing-nav";
import { AuroraBg } from "@/components/aurora-bg";
import { ScrollReveal } from "@/components/scroll-reveal";
import { HeroSection } from "@/components/landing/hero-section";
import { LogoTicker } from "@/components/landing/logo-ticker";
import { StatsSection } from "@/components/landing/stats-section";
import { BentoFeatures } from "@/components/landing/bento-features";
import { PricingCta } from "@/components/landing/pricing-cta";

function GradientDivider({ color = "indigo" }: { color?: string }) {
  const colors: Record<string, string> = {
    indigo: "via-indigo-500/20",
    cyan: "via-cyan-500/15",
    emerald: "via-emerald-500/15",
    fuchsia: "via-fuchsia-500/15",
  };
  return (
    <div className="relative z-10 h-px mx-auto max-w-[600px]">
      <div className={`h-px bg-gradient-to-r from-transparent ${colors[color]} to-transparent`} />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#07070A] text-zinc-100 selection:bg-indigo-500/30 selection:text-white">
      <AuroraBg />
      <LandingNav />
      <HeroSection />

      {/* Service carousel */}
      <section className="relative z-10 mx-auto max-w-[1000px] px-6 pt-12 pb-28">
        <ScrollReveal variant="fade-up">
          <p className="text-center text-[11px] font-bold tracking-[0.12em] uppercase text-zinc-600 mb-8">
            Track every subscription in one place
          </p>
        </ScrollReveal>
        <ScrollReveal variant="fade-scale" delay={100}>
          <AnimatedDashboard />
        </ScrollReveal>
      </section>

      <GradientDivider color="indigo" />
      <LogoTicker />
      <GradientDivider color="cyan" />
      <StatsSection />
      <GradientDivider color="emerald" />
      <BentoFeatures />
      <GradientDivider color="fuchsia" />
      <PricingCta />

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.08]">
        <div className="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between px-6">
          <p className="text-[13px] font-medium text-zinc-500">
            SubTracker — open source subscription tracking
          </p>
          <div className="flex items-center gap-5">
            <a href="https://github.com" className="text-[13px] font-medium text-zinc-500 hover:text-zinc-200 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
