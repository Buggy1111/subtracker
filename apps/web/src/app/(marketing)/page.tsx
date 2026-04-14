import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedDashboard } from "@/components/animated-dashboard";
import { LandingNav } from "@/components/landing-nav";
import { AuroraBg } from "@/components/aurora-bg";
import { ScrollReveal, AnimatedStat } from "@/components/scroll-reveal";
import {
  Upload,
  Bell,
  Shield,
  BarChart3,
  Github,
  Zap,
  Globe,
  ArrowRight,
  Check,
  Terminal,
  Star,
} from "lucide-react";

/* ─── Data ─── */

const features = [
  { icon: BarChart3, title: "Live Dashboard", desc: "Spending curves, category donuts, trend sparklines — all rendered in real-time.", accent: "#6366F1" },
  { icon: Upload, title: "CSV Auto-Detect", desc: "Drop a bank export. We detect the format, parse transactions, surface recurring charges.", accent: "#22C55E" },
  { icon: Bell, title: "Smart Alerts", desc: "Reminders before every renewal. Daily digest. Web push. Your rules.", accent: "#F59E0B" },
  { icon: Zap, title: "60-Second Setup", desc: "Pick from 35+ popular services or paste a CSV. Done before your coffee cools.", accent: "#EC4899" },
  { icon: Globe, title: "Any Currency", desc: "USD, EUR, CZK, BTC — auto-converted daily. One dashboard for everything.", accent: "#8B5CF6" },
  { icon: Shield, title: "Your Data. Period.", desc: "No bank API. No tracking. Open source. Self-host on your hardware.", accent: "#14B8A6" },
];

const logos = [
  { n: "Netflix", c: "#E50914" }, { n: "Spotify", c: "#1DB954" }, { n: "YouTube", c: "#FF0000" },
  { n: "Adobe", c: "#FF0000" }, { n: "ChatGPT", c: "#10A37F" }, { n: "Figma", c: "#A259FF" },
  { n: "Disney+", c: "#113CCF" }, { n: "iCloud", c: "#3693F3" }, { n: "GitHub", c: "#8B5CF6" },
  { n: "Notion", c: "#E8E8E8" }, { n: "Hulu", c: "#1CE783" }, { n: "1Password", c: "#0572EC" },
];

/* ─── Page ─── */

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#07070A] text-zinc-100 selection:bg-indigo-500/30 selection:text-white">

      {/* ━━━ LIVING BACKGROUND ━━━ */}
      <AuroraBg />

      {/* ━━━ NAV ━━━ */}
      <LandingNav />

      {/* ━━━ HERO ━━━ */}
      <section className="relative z-10 mx-auto max-w-[1200px] px-6 pt-28 sm:pt-36 pb-12 text-center">
        {/* Pill */}
        <div className="anim-reveal inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/[0.06] px-4 py-1.5 text-[12px] font-medium tracking-wide text-indigo-300/80 mb-10">
          <Star className="h-3 w-3 fill-indigo-400 text-indigo-400" />
          Open source &middot; Self-hostable &middot; Free forever
        </div>

        <h1 className="anim-reveal anim-delay-1 font-display text-[clamp(2.8rem,7vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.045em]">
          <span className="block text-white">Your subscriptions.</span>
          <span className="block mt-1 bg-gradient-to-r from-indigo-300 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_4s_linear_infinite]">
            Under control.
          </span>
        </h1>

        <p className="anim-reveal anim-delay-2 mx-auto mt-8 max-w-[480px] text-[16px] leading-[1.7] text-zinc-500 font-medium">
          The average person pays <span className="text-zinc-200 font-semibold font-mono-feature">$219<span className="text-zinc-500 font-normal">/mo</span></span> in
          subscriptions — and forgets about a third of them.
          SubTracker catches every dollar.
        </p>

        <div className="anim-reveal anim-delay-3 mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button render={<Link href="/login" />} nativeButton={false}
            className="h-[46px] px-7 bg-indigo-500 text-white text-[14px] font-semibold rounded-[12px]
              shadow-[0_1px_2px_rgba(0,0,0,0.3),0_0_0_1px_rgba(99,102,241,0.5),0_4px_24px_rgba(99,102,241,0.25)]
              hover:bg-indigo-400
              hover:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_0_0_1px_rgba(99,102,241,0.6),0_8px_40px_rgba(99,102,241,0.35)]
              hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200">
            Start tracking — it&apos;s free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="ghost" render={<a href="https://github.com" target="_blank" rel="noopener noreferrer" />} nativeButton={false}
            className="h-[46px] px-6 text-zinc-500 text-[14px] hover:text-zinc-200 rounded-[12px] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-200">
            <Github className="mr-2 h-4 w-4" />
            Star on GitHub
          </Button>
        </div>
      </section>

      {/* ━━━ SERVICE LOGOS + PRICES (animated) ━━━ */}
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

      {/* ━━━ Gradient divider ━━━ */}
      <div className="relative z-10 h-px mx-auto max-w-[600px]">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      </div>

      {/* ━━━ LOGO TICKER ━━━ */}
      <ScrollReveal variant="fade-up">
        <section className="relative z-10 py-16 overflow-hidden">
          <p className="text-center text-[11px] font-bold tracking-[0.15em] uppercase text-zinc-500 mb-8">
            Tracks 35+ popular services out of the box
          </p>
          <div className="relative">
            {/* Left/right fade masks */}
            <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-[#07070A] to-transparent" />
            <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-[#07070A] to-transparent" />
            <div className="flex animate-[scroll-logos_30s_linear_infinite]" style={{ width: "max-content" }}>
              {[...logos, ...logos].map((s, i) => (
                <div key={i} className="flex items-center gap-3 mx-7 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[12px] font-bold"
                    style={{ backgroundColor: s.c + "25", color: s.c }}>
                    {s.n.charAt(0)}
                  </div>
                  <span className="text-[13px] font-medium text-zinc-400">{s.n}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ━━━ Gradient divider ━━━ */}
      <div className="relative z-10 h-px mx-auto max-w-[600px]">
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />
      </div>

      {/* ━━━ STATS ━━━ */}
      <section className="relative z-10 mx-auto max-w-[900px] px-6 py-28">
        {/* Section-specific glow */}
        <div className="section-glow w-[500px] h-[300px] -top-[50px] left-1/2 -translate-x-1/2" style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.06), transparent 70%)" }} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { num: "$219", label: "avg. monthly spend", desc: "on subscriptions per person" },
            { num: "2.5×", label: "the underestimate", desc: "of what people think they pay" },
            { num: "$127", label: "wasted every year", desc: "on forgotten subscriptions" },
          ].map((stat, i) => (
            <ScrollReveal key={stat.num} variant="fade-up" delay={i * 120}>
              <div className="text-center md:text-left group">
                <AnimatedStat
                  value={stat.num}
                  className="font-display text-[48px] md:text-[56px] font-bold tracking-[-0.04em] leading-none bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-600 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:via-violet-300 group-hover:to-fuchsia-400 transition-all duration-500 inline-block"
                />
                <p className="mt-3 text-[14px] font-semibold text-zinc-300">{stat.label}</p>
                <p className="text-[13px] text-zinc-600">{stat.desc}</p>
                {i < 2 && <div className="hidden md:block mt-8 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ━━━ Gradient divider ━━━ */}
      <div className="relative z-10 h-px mx-auto max-w-[600px]">
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/15 to-transparent" />
      </div>

      {/* ━━━ FEATURES ━━━ */}
      <section id="features" className="relative z-10 mx-auto max-w-[1100px] px-6 py-24">
        {/* Section glow */}
        <div className="section-glow w-[600px] h-[400px] top-[100px] right-[-200px]" style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.05), transparent 70%)" }} />

        <ScrollReveal variant="fade-up">
          <div className="text-center mb-20">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-bold tracking-[-0.035em] leading-[1.1]">
              Built for people who
              <br />
              <span className="text-zinc-600">hate wasting money.</span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} variant="fade-up" delay={i * 80}>
              <div className="group refract-card p-7 h-full">
                <div className="icon-glow mb-6 flex h-12 w-12 items-center justify-center rounded-[14px] transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-3deg]"
                  style={{ backgroundColor: f.accent + "10", color: f.accent }}>
                  <f.icon className="h-[22px] w-[22px]" strokeWidth={1.8} />
                </div>
                <h3 className="font-display text-[16px] font-semibold tracking-[-0.01em] text-zinc-100">
                  {f.title}
                </h3>
                <p className="mt-2.5 text-[13.5px] leading-[1.65] text-zinc-500 group-hover:text-zinc-400 transition-colors duration-300">
                  {f.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ━━━ Gradient divider ━━━ */}
      <div className="relative z-10 h-px mx-auto max-w-[600px]">
        <div className="h-px bg-gradient-to-r from-transparent via-fuchsia-500/15 to-transparent" />
      </div>

      {/* ━━━ PRICING / CTA ━━━ */}
      <section id="pricing" className="relative z-10 mx-auto max-w-[680px] px-6 py-28">
        {/* Section glow */}
        <div className="section-glow w-[400px] h-[400px] top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: "radial-gradient(circle, rgba(34,197,94,0.04), transparent 60%)" }} />

        <ScrollReveal variant="blur-in">
          <div className="gradient-border-animated">
            <div className="relative bg-[#0C0C10] rounded-[20px] p-10 md:p-14 text-center noise">
              {/* Top refraction */}
              <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent" />

              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/[0.06] border border-emerald-500/15 px-4 py-1.5 text-[12px] font-semibold tracking-wide text-emerald-400 mb-8">
                <Check className="h-3.5 w-3.5" />
                Free forever — no credit card
              </div>

              <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-bold tracking-[-0.035em] leading-[1.1]">
                No subscription
                <br />
                <span className="text-zinc-600">to track subscriptions.</span>
              </h2>

              <div className="mt-10 grid gap-2.5 max-w-[300px] mx-auto text-left">
                {[
                  "Unlimited subs (self-hosted)",
                  "Beautiful dark dashboard",
                  "Bank CSV auto-detection",
                  "Renewal reminders",
                  "Multi-currency support",
                  "Docker self-hosting",
                ].map((item, i) => (
                  <ScrollReveal key={item} variant="fade-left" delay={i * 60} once>
                    <div className="flex items-center gap-3">
                      <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-emerald-500/10 flex-shrink-0">
                        <Check className="h-2.5 w-2.5 text-emerald-400" strokeWidth={3} />
                      </div>
                      <span className="text-[13px] text-zinc-400">{item}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <div className="mt-10">
                <Button render={<Link href="/login" />} nativeButton={false}
                  className="h-[48px] px-8 bg-indigo-500 text-white text-[15px] font-semibold rounded-[14px]
                    shadow-[0_1px_2px_rgba(0,0,0,0.4),0_0_0_1px_rgba(99,102,241,0.5),0_8px_32px_rgba(99,102,241,0.25)]
                    hover:bg-indigo-400
                    hover:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_0_0_1px_rgba(99,102,241,0.6),0_12px_48px_rgba(99,102,241,0.35)]
                    hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200">
                  Get started free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="mt-10 flex flex-col items-center gap-1.5">
                <p className="text-[11px] font-medium tracking-wide text-zinc-600">Or self-host with one command:</p>
                <div className="flex items-center justify-center gap-2 rounded-[12px] border border-white/[0.04] bg-white/[0.02] px-5 py-3 max-w-max">
                  <Terminal className="h-3.5 w-3.5 text-zinc-600" />
                  <code className="text-[13px] font-mono-feature text-zinc-400">
                    <span className="text-zinc-700">$</span> docker compose up -d
                  </code>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ━━━ FOOTER ━━━ */}
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
