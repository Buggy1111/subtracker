import { ScrollReveal } from "@/components/scroll-reveal";
import {
  Upload,
  Bell,
  Shield,
  BarChart3,
  Github,
  Zap,
  Globe,
  Terminal,
} from "lucide-react";

export function BentoFeatures() {
  return (
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
  );
}
