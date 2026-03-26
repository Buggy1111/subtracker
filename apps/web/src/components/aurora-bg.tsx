"use client";

/**
 * Premium dark background — inspired by Linear, Vercel, Raycast.
 *
 * Layers (bottom to top):
 * 1. Base color (#07070A)
 * 2. Subtle gradient glow behind hero (indigo + blue, very soft)
 * 3. Ghost grid lines (2-3% opacity)
 * 4. Noise/grain texture overlay (3% opacity — this is the secret)
 * 5. Section-specific accent glows (positioned per-section)
 */
export function AuroraBg() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* Layer 1: Hero glow — single, soft, centered */}
      <div
        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[min(1000px,100vw)] h-[700px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(99, 102, 241, 0.10) 0%, rgba(59, 130, 246, 0.04) 45%, transparent 75%)",
        }}
      />

      {/* Layer 1b: Secondary warm accent — very subtle, top right */}
      <div
        className="absolute top-[5%] right-[-5%] w-[500px] h-[400px]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.05) 0%, transparent 65%)",
          filter: "blur(40px)",
          animation: "aurora-breathe 25s ease-in-out infinite",
        }}
      />

      {/* Layer 2: Ghost grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 80% 50% at 50% 20%, rgba(0,0,0,0.6) 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 50% at 50% 20%, rgba(0,0,0,0.6) 0%, transparent 70%)",
        }}
      />

      {/* Layer 3: Noise/grain texture — THE secret to premium dark UI */}
      <div
        className="fixed inset-0 z-[9998] opacity-[0.030] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />
    </div>
  );
}
