"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms before animation starts after entering viewport */
  delay?: number;
  /** Animation variant */
  variant?: "fade-up" | "fade-scale" | "fade-left" | "fade-right" | "blur-in";
  /** Only animate once */
  once?: boolean;
  /** Threshold — how much of the element should be visible (0-1) */
  threshold?: number;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  variant = "fade-up",
  once = true,
  threshold = 0.15,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  const variants = {
    "fade-up": {
      hidden: "opacity-0 translate-y-8 scale-[0.98]",
      visible: "opacity-100 translate-y-0 scale-100",
    },
    "fade-scale": {
      hidden: "opacity-0 scale-[0.92]",
      visible: "opacity-100 scale-100",
    },
    "fade-left": {
      hidden: "opacity-0 -translate-x-6",
      visible: "opacity-100 translate-x-0",
    },
    "fade-right": {
      hidden: "opacity-0 translate-x-6",
      visible: "opacity-100 translate-x-0",
    },
    "blur-in": {
      hidden: "opacity-0 blur-[8px] scale-[0.96]",
      visible: "opacity-100 blur-0 scale-100",
    },
  };

  const v = variants[variant];

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
        isVisible ? v.visible : v.hidden
      } ${className}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

/**
 * Animated counter — counts up from 0 to target when visible.
 */
export function AnimatedStat({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState(value);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateValue();
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  });

  function animateValue() {
    // Extract numeric part
    const prefix = value.match(/^[^0-9]*/)?.[0] || "";
    const suffix = value.match(/[^0-9.]*$/)?.[0] || "";
    const numStr = value.replace(prefix, "").replace(suffix, "");
    const target = parseFloat(numStr);

    if (isNaN(target)) {
      setDisplayed(value);
      return;
    }

    const hasDecimal = numStr.includes(".");
    const duration = 1200;
    const startTime = performance.now();

    function update(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      setDisplayed(
        prefix + (hasDecimal ? current.toFixed(1) : Math.round(current).toString()) + suffix
      );

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplayed(value);
      }
    }

    requestAnimationFrame(update);
  }

  return (
    <span ref={ref} className={className}>
      {displayed}
    </span>
  );
}
