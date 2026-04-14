import { ScrollReveal, AnimatedStat } from "@/components/scroll-reveal";

const STATS = [
  { num: "$219", label: "avg. monthly spend", desc: "on subscriptions per person", accent: "#6366F1" },
  { num: "2.5×", label: "the underestimate", desc: "of what people think they pay", accent: "#EC4899" },
  { num: "$127", label: "wasted every year", desc: "on forgotten subscriptions", accent: "#F59E0B" },
];

export function StatsSection() {
  return (
    <section className="relative z-10 mx-auto max-w-[900px] px-6 py-28">
      <div className="section-glow w-[500px] h-[300px] -top-[50px] left-1/2 -translate-x-1/2" style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.06), transparent 70%)" }} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATS.map((stat, i) => (
          <ScrollReveal key={stat.num} variant="fade-up" delay={i * 120}>
            <div className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-500">
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
  );
}
