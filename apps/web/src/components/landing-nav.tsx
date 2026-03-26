"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Github, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

export function LandingNav() {
  const navRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mouseInNav, setMouseInNav] = useState(false);

  /* Track scroll for compact mode */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Mouse-following glow on the nav bar */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!navRef.current || !glowRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glowRef.current.style.setProperty("--glow-x", `${x}px`);
    glowRef.current.style.setProperty("--glow-y", `${y}px`);
    glowRef.current.style.opacity = "1";
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = "0";
    setMouseInNav(false);
  }, []);

  return (
    <div
      className={`sticky top-3 z-50 mx-auto px-4 transition-all duration-700 ease-out ${
        scrolled ? "max-w-[720px]" : "max-w-[800px]"
      }`}
    >
      {/* Outer wrapper — rotating conic gradient border */}
      <div className="nav-prism-border relative rounded-[20px] p-[1px]">
        <nav
          ref={navRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setMouseInNav(true)}
          onMouseLeave={handleMouseLeave}
          className={`relative flex items-center justify-between rounded-[19px] px-3 transition-all duration-700 ease-out overflow-hidden ${
            scrolled ? "py-1.5" : "py-2"
          }`}
          style={{
            background: "rgba(7, 7, 10, 0.82)",
            backdropFilter: "blur(40px) saturate(1.6)",
            WebkitBackdropFilter: "blur(40px) saturate(1.6)",
            boxShadow: scrolled
              ? "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)"
              : "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Mouse-follow glow */}
          <div
            ref={glowRef}
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 rounded-[19px] overflow-hidden"
          >
            <div
              className="absolute w-[280px] h-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: "var(--glow-x, 50%)",
                top: "var(--glow-y, 50%)",
                background:
                  "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
              }}
            />
          </div>

          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-2.5 group pl-1">
            <div className="nav-logo-wrap relative">
              <div
                className={`relative flex items-center justify-center rounded-[10px] text-white font-bold transition-all duration-500 ${
                  scrolled ? "h-7 w-7 text-[11px]" : "h-8 w-8 text-xs"
                }`}
                style={{
                  background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #6366F1 100%)",
                  backgroundSize: "200% 200%",
                  animation: "nav-logo-gradient 4s ease infinite",
                }}
              >
                S
              </div>
              {/* Ambient glow behind logo */}
              <div className="absolute inset-0 rounded-[10px] opacity-40 group-hover:opacity-70 transition-opacity duration-500 blur-[10px]"
                style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }} />
            </div>
            <span className="font-display text-[14px] font-semibold tracking-[-0.01em] text-zinc-200 group-hover:text-white transition-colors duration-300">
              SubTracker
            </span>
          </Link>

          {/* Center nav links */}
          <div className="hidden sm:flex relative z-10 items-center gap-0.5 rounded-[12px] bg-white/[0.035] p-[3px] border border-white/[0.03]">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link-item relative px-4 py-[5px] rounded-[9px] text-[12.5px] font-medium text-zinc-500 hover:text-zinc-100 transition-all duration-250"
              >
                <span className="relative z-10">{link.label}</span>
              </a>
            ))}
            <div className="h-3 w-px bg-white/[0.06] mx-0.5" />
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link-item relative flex items-center gap-1.5 px-3.5 py-[5px] rounded-[9px] text-[12.5px] font-medium text-zinc-500 hover:text-zinc-100 transition-all duration-250"
            >
              <Github className="h-3.5 w-3.5" />
              <span className="relative z-10">GitHub</span>
            </a>
          </div>

          {/* CTA button with sweep animation */}
          <div className="relative z-10">
            <Button
              size="sm"
              render={<Link href="/login" />}
              nativeButton={false}
              className="nav-cta-btn relative text-white text-[12.5px] font-semibold rounded-[11px] px-4.5 py-[7px] border-0 overflow-hidden transition-all duration-300 hover:-translate-y-px active:translate-y-0"
              style={{
                background: "linear-gradient(135deg, #6366F1, #7C3AED)",
                boxShadow:
                  "0 0 0 1px rgba(99,102,241,0.3), 0 2px 8px rgba(99,102,241,0.25), 0 0 20px rgba(99,102,241,0.1)",
              }}
            >
              <span className="relative z-10 flex items-center gap-1.5">
                Get Started
                <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
              {/* Sweep light effect */}
              <div className="nav-cta-sweep absolute inset-0 pointer-events-none" />
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}
