"use client";

import { useEffect, useState } from "react";
import brandIcons from "@/lib/brand-icons.json";

const services = [
  { name: "Netflix", icon: "netflix", price: "$15.99", color: "#E50914" },
  { name: "Spotify", icon: "spotify", price: "$10.99", color: "#1DB954" },
  { name: "YouTube", icon: "youtube", price: "$13.99", color: "#FF0000" },
  { name: "Claude", icon: "claude", price: "$20.00", color: "#D97757" },
  { name: "Figma", icon: "figma", price: "$15.00", color: "#F24E1E" },
  { name: "GitHub", icon: "github", price: "$10.00", color: "#8B5CF6" },
  { name: "Notion", icon: "notion", price: "$10.00", color: "#787878" },
  { name: "NordVPN", icon: "nordvpn", price: "$12.99", color: "#4687FF" },
  { name: "Dropbox", icon: "dropbox", price: "$11.99", color: "#0061FF" },
  { name: "iCloud+", icon: "icloud", price: "$2.99", color: "#3693F3" },
  { name: "1Password", icon: "onepassword", price: "$2.99", color: "#3B66BC" },
  { name: "Linear", icon: "linear", price: "$8.00", color: "#5E6AD2" },
  { name: "Twitch", icon: "twitch", price: "$8.99", color: "#9146FF" },
  { name: "Bitwarden", icon: "bitwarden", price: "$0.83", color: "#175DDC" },
  { name: "Strava", icon: "strava", price: "$11.99", color: "#FC4C02" },
  { name: "Medium", icon: "medium", price: "$5.00", color: "#787878" },
];

type BrandKey = keyof typeof brandIcons;

export function AnimatedDashboard() {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % services.length);
        setIsTransitioning(false);
      }, 400);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const current = services[index];
  const brand = brandIcons[current.icon as BrandKey];

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Logo */}
      <div
        className={`transition-all duration-500 ease-out ${
          isTransitioning
            ? "opacity-0 scale-75 blur-md"
            : "opacity-100 scale-100 blur-0"
        }`}
      >
        <div
          className="flex items-center justify-center rounded-[28px] transition-shadow duration-700"
          style={{
            width: 140,
            height: 140,
            backgroundColor: current.color + "10",
            boxShadow: `0 0 80px ${current.color}20, 0 0 160px ${current.color}08`,
          }}
        >
          {brand ? (
            <svg width={64} height={64} viewBox="0 0 24 24" fill={current.color}>
              <path d={brand.path} />
            </svg>
          ) : (
            <span className="font-bold text-5xl" style={{ color: current.color }}>
              {current.name.charAt(0)}
            </span>
          )}
        </div>
      </div>

      {/* Name + Price */}
      <div
        className={`text-center transition-all duration-500 ease-out ${
          isTransitioning
            ? "opacity-0 translate-y-3 blur-sm"
            : "opacity-100 translate-y-0 blur-0"
        }`}
      >
        <p className="font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-zinc-200">
          {current.name}
        </p>
        <p className="font-mono-feature text-4xl sm:text-5xl font-bold tracking-[-0.03em] mt-3 text-white">
          {current.price}
          <span className="text-zinc-600 text-lg font-medium">/mo</span>
        </p>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-1.5">
        {services.map((_, i) => (
          <div
            key={i}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === index ? 24 : 6,
              backgroundColor: i === index ? current.color : "rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
