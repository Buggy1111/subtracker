import { ScrollReveal } from "@/components/scroll-reveal";

const LOGOS = [
  { n: "Netflix", c: "#E50914" }, { n: "Spotify", c: "#1DB954" }, { n: "YouTube", c: "#FF0000" },
  { n: "Adobe", c: "#FF0000" }, { n: "ChatGPT", c: "#10A37F" }, { n: "Figma", c: "#A259FF" },
  { n: "Disney+", c: "#113CCF" }, { n: "iCloud", c: "#3693F3" }, { n: "GitHub", c: "#8B5CF6" },
  { n: "Notion", c: "#E8E8E8" }, { n: "Hulu", c: "#1CE783" }, { n: "1Password", c: "#0572EC" },
];

export function LogoTicker() {
  return (
    <ScrollReveal variant="fade-up">
      <section className="relative z-10 py-16 overflow-hidden">
        <p className="text-center text-[11px] font-bold tracking-[0.15em] uppercase text-zinc-500 mb-8">
          Tracks 35+ popular services out of the box
        </p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-[#07070A] to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-[#07070A] to-transparent" />
          <div className="flex animate-[scroll-logos_30s_linear_infinite]" style={{ width: "max-content" }}>
            {[...LOGOS, ...LOGOS].map((s, i) => (
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
  );
}
