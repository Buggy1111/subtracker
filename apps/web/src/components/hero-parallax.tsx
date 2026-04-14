"use client";

import { useRef, useCallback, type ReactNode } from "react";

export function HeroParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    ref.current.style.setProperty("--px", `${x * 12}px`);
    ref.current.style.setProperty("--py", `${y * 8}px`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.setProperty("--px", "0px");
    ref.current.style.setProperty("--py", "0px");
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="hero-parallax"
      style={{ "--px": "0px", "--py": "0px" } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
