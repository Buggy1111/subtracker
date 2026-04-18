import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroParallax } from "@/components/hero-parallax";
import { Github, ArrowRight, Star } from "lucide-react";

export function HeroSection() {
  return (
    <HeroParallax>
      <section className="relative z-10 mx-auto max-w-[1200px] px-6 pt-28 sm:pt-36 pb-12 text-center">
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
          <Button variant="ghost" render={<a href="https://github.com/Buggy1111/subtracker" target="_blank" rel="noopener noreferrer" />} nativeButton={false}
            className="h-[46px] px-6 text-zinc-500 text-[14px] hover:text-zinc-200 rounded-[12px] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-200">
            <Github className="mr-2 h-4 w-4" />
            Star on GitHub
          </Button>
        </div>
      </section>
    </HeroParallax>
  );
}
