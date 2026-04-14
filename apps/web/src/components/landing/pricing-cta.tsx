import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Check, ArrowRight, Terminal } from "lucide-react";

const FEATURES = [
  "Unlimited subs (self-hosted)",
  "Beautiful dark dashboard",
  "Bank CSV auto-detection",
  "Renewal reminders",
  "Multi-currency support",
  "Docker self-hosting",
];

export function PricingCta() {
  return (
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
              {FEATURES.map((item, i) => (
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
  );
}
