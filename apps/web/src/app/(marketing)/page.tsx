import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedDashboard } from "@/components/animated-dashboard";
import { LandingNav } from "@/components/landing-nav";
import { AuroraBg } from "@/components/aurora-bg";
import { ScrollReveal, AnimatedStat } from "@/components/scroll-reveal";
import { HeroParallax } from "@/components/hero-parallax";
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
  CreditCard,
  Calendar,
  PieChart,
} from "lucide-react";

/* ─── Data ─── */

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

      {/* ━━━ HERO with mouse parallax ━━━ */}
      <HeroParallax>
        <section className="relative z-10 mx-auto max-w-[1200px] px-6 pt-28 sm:pt-36 pb-12 text-center">
          {/* Pill */}
          <div className="anim-reveal inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/[0.06] px-4 py-1.5 text-[12px] font-medium tracking-wide text-indigo-300/80 mb-10">
            <Star className="h-3 w-3 fill-indigo-400 text-indigo-400" />
            Open source &middot; Self-hostable &middot; Free forever
          </div>

          <h1 className="anim-reveal anim-delay-1 font-display text-[clamp(2.8rem,7vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.045em]"
            style={{ transform: "translate(var(--px), var(--py))", transition: "transform 0.15s ease-out" }}>
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
      </HeroParallax>

      {/* ━━━ SERVICE CAROUSEL ━━━ */}
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
        <div className="section-glow w-[500px] h-[300px] -top-[50px] left-1/2 -translate-x-1/2" style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.06), transparent 70%)" }} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: "$219", label: "avg. monthly spend", desc: "on subscriptions per person", accent: "#6366F1" },
            { num: "2.5×", label: "the underestimate", desc: "of what people think they pay", accent: "#EC4899" },
            { num: "$127", label: "wasted every year", desc: "on forgotten subscriptions", accent: "#F59E0B" },
          ].map((stat, i) => (
            <ScrollReveal key={stat.num} variant="fade-up" delay={i * 120}>
              <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-500">
                {/* Top glow line */}
                <div className="absolute top-0 left-[20%] right-[20%] h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${stat.accent}40, transparent)` }} />
                <AnimatedStat
                  value={stat.num}
                  className="font-display text-[52px] font-bold tracking-[-0.04em] leading-none bg-gradient-to-br from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent group-hover:from-white group-hover:to-zinc-300 transition-all duration-500 inline-block"
                />
                <p className="mt-3 text-[14px] font-semibold text-zinc-300">{stat.label}</p>
                <p className="text-[13px] text-zinc-600 mt-1">{stat.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ━━━ Gradient divider ━━━ */}
      <div className="relative z-10 h-px mx-auto max-w-[600px]">
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/15 to-transparent" />
      </div>

      {/* ━━━ BENTO FEATURES ━━━ */}
      <section id="features" className="relative z-10 mx-auto max-w-[1100px] px-6 py-24">
        <div className="section-glow w-[600px] h-[400px] top-[100px] right-[-200px]" style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.05), transparent 70%)" }} />

        <ScrollReveal variant="fade-up">
          <div className="text-center mb-16">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-bold tracking-[-0.035em] leading-[1.1]">
              Built for people who
              <br />
              <span className="text-zinc-600">hate wasting money.</span>
            </h2>
          </div>
        </ScrollReveal>

        {/* Bento Grid — Apple-style mixed sizes */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">

          {/* ── Large: Dashboard ── */}
          <ScrollReveal variant="fade-up" delay={0} className="md:col-span-4">
            <div className="group bento-card p-8 min-h-[280px] flex flex-col justify-between h-full">
              <div>
                <div className="bento-icon mb-4" style={{ backgroundColor: "#6366F115", color: "#6366F1" }}>
                  <BarChart3 className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="font-display text-[18px] font-semibold text-zinc-100">Live Dashboard</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-zinc-500 max-w-sm">
                  Monthly spend, category breakdown, upcoming renewals — all in real-time.
                </p>
              </div>
              {/* Mini dashboard preview */}
              <div className="mt-6 flex gap-3">
                {[
                  { label: "Monthly", value: "$142.50", color: "#6366F1" },
                  { label: "Active", value: "12", color: "#22C55E" },
                  { label: "Annual", value: "$1,710", color: "#8B5CF6" },
                ].map((kpi) => (
                  <div key={kpi.label} className="flex-1 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 group-hover:border-white/[0.08] transition-all duration-500">
                    <p className="text-[10px] text-zinc-600">{kpi.label}</p>
                    <p className="font-mono text-[16px] font-bold tabular-nums mt-0.5" style={{ color: kpi.color }}>{kpi.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ── Small: Smart Alerts ── */}
          <ScrollReveal variant="fade-up" delay={80} className="md:col-span-2">
            <div className="group bento-card p-7 min-h-[280px] flex flex-col h-full">
              <div className="bento-icon mb-4" style={{ backgroundColor: "#F59E0B15", color: "#F59E0B" }}>
                <Bell className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <h3 className="font-display text-[16px] font-semibold text-zinc-100">Smart Alerts</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-500 flex-1">
                Reminders before every renewal. Weekly digest. Your rules.
              </p>
              {/* Mini notification preview */}
              <div className="mt-4 space-y-2">
                {[
                  { name: "Netflix", days: "2 days", color: "#E50914" },
                  { name: "Spotify", days: "5 days", color: "#1DB954" },
                ].map((n) => (
                  <div key={n.name} className="flex items-center gap-2 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2 group-hover:border-white/[0.08] transition-all">
                    <div className="h-5 w-5 rounded flex items-center justify-center text-[8px] font-bold text-white" style={{ backgroundColor: n.color }}>{n.name[0]}</div>
                    <span className="text-[11px] text-zinc-400 flex-1">{n.name} renews</span>
                    <span className="text-[10px] text-zinc-600">{n.days}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ── Small: CSV Import ── */}
          <ScrollReveal variant="fade-up" delay={160} className="md:col-span-2">
            <div className="group bento-card p-7 min-h-[260px] flex flex-col h-full">
              <div className="bento-icon mb-4" style={{ backgroundColor: "#22C55E15", color: "#22C55E" }}>
                <Upload className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <h3 className="font-display text-[16px] font-semibold text-zinc-100">CSV Auto-Detect</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-500 flex-1">
                Drop a bank export. We detect the format and surface recurring charges.
              </p>
              {/* Mini file drop preview */}
              <div className="mt-4 rounded-lg border-2 border-dashed border-white/[0.06] p-4 text-center group-hover:border-emerald-500/20 transition-all duration-500">
                <Upload className="h-4 w-4 text-zinc-600 mx-auto" />
                <p className="text-[10px] text-zinc-600 mt-1">Fio · Revolut · Wise · CSV</p>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Medium: Quick Setup ── */}
          <ScrollReveal variant="fade-up" delay={240} className="md:col-span-2">
            <div className="group bento-card p-7 min-h-[260px] flex flex-col h-full">
              <div className="bento-icon mb-4" style={{ backgroundColor: "#EC489915", color: "#EC4899" }}>
                <Zap className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <h3 className="font-display text-[16px] font-semibold text-zinc-100">60-Second Setup</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-500 flex-1">
                Pick from 35+ popular services. Done before your coffee cools.
              </p>
              {/* Mini service grid */}
              <div className="mt-4 grid grid-cols-4 gap-1.5">
                {[
                  { n: "N", c: "#E50914" }, { n: "S", c: "#1DB954" }, { n: "Y", c: "#FF0000" }, { n: "F", c: "#F24E1E" },
                  { n: "D", c: "#113CCF" }, { n: "C", c: "#10A37F" }, { n: "G", c: "#8B5CF6" }, { n: "+", c: "#52525B" },
                ].map((s, i) => (
                  <div key={i} className="aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold text-white group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundColor: s.c, transitionDelay: `${i * 30}ms` }}>
                    {s.n}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ── Medium: Multi-Currency ── */}
          <ScrollReveal variant="fade-up" delay={320} className="md:col-span-2">
            <div className="group bento-card p-7 min-h-[260px] flex flex-col h-full">
              <div className="bento-icon mb-4" style={{ backgroundColor: "#8B5CF615", color: "#8B5CF6" }}>
                <Globe className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <h3 className="font-display text-[16px] font-semibold text-zinc-100">Any Currency</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-zinc-500 flex-1">
                USD, EUR, CZK — auto-converted daily. One dashboard for everything.
              </p>
              {/* Mini currency badges */}
              <div className="mt-4 flex flex-wrap gap-2">
                {["USD", "EUR", "GBP", "CZK", "JPY", "CHF"].map((c) => (
                  <span key={c} className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] font-mono font-medium text-zinc-400 group-hover:border-violet-500/20 group-hover:text-zinc-300 transition-all duration-300">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ── Wide: Privacy ── */}
          <ScrollReveal variant="fade-up" delay={400} className="md:col-span-6">
            <div className="group bento-card p-8 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="bento-icon mb-4" style={{ backgroundColor: "#14B8A615", color: "#14B8A6" }}>
                  <Shield className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="font-display text-[18px] font-semibold text-zinc-100">Your Data. Period.</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-zinc-500 max-w-md">
                  No bank API. No tracking pixels. Open source AGPL-3.0. Self-host on your hardware with one command.
                </p>
              </div>
              <div className="flex gap-4">
                {[
                  { icon: Shield, label: "No bank login", desc: "CSV-only import" },
                  { icon: Github, label: "Open source", desc: "AGPL-3.0 license" },
                  { icon: Terminal, label: "Self-hostable", desc: "Docker Compose" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 text-center min-w-[120px] group-hover:border-teal-500/15 transition-all duration-500">
                    <item.icon className="h-5 w-5 text-zinc-500 mx-auto" />
                    <p className="text-[12px] font-semibold text-zinc-300 mt-2">{item.label}</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ━━━ Gradient divider ━━━ */}
      <div className="relative z-10 h-px mx-auto max-w-[600px]">
        <div className="h-px bg-gradient-to-r from-transparent via-fuchsia-500/15 to-transparent" />
      </div>

      {/* ━━━ PRICING / CTA ━━━ */}
      <section id="pricing" className="relative z-10 mx-auto max-w-[680px] px-6 py-28">
        <div className="section-glow w-[400px] h-[400px] top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: "radial-gradient(circle, rgba(34,197,94,0.04), transparent 60%)" }} />

        <ScrollReveal variant="blur-in">
          <div className="gradient-border-animated">
            <div className="relative bg-[#0C0C10] rounded-[20px] p-10 md:p-14 text-center noise">
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
