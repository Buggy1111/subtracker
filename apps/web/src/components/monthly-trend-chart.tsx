"use client";

import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/lib/format";

type Point = { month: string; label: string; total: number };

interface Props {
  data: Point[];
  currency: string;
}

const WIDTH = 560;
const HEIGHT = 220;
const PADDING_X = 16;
const PADDING_Y = 24;

function smoothPath(points: { x: number; y: number }[], closeToBaseY?: number): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const p = points[0];
    const line = `M ${p.x} ${p.y}`;
    if (closeToBaseY !== undefined) {
      return `${line} L ${p.x} ${closeToBaseY} Z`;
    }
    return line;
  }

  const d: string[] = [`M ${points[0].x} ${points[0].y}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = (p0.x + p1.x) / 2;
    d.push(`C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`);
  }

  if (closeToBaseY !== undefined) {
    const last = points[points.length - 1];
    const first = points[0];
    d.push(`L ${last.x} ${closeToBaseY}`);
    d.push(`L ${first.x} ${closeToBaseY}`);
    d.push("Z");
  }

  return d.join(" ");
}

export function MonthlyTrendChart({ data, currency }: Props) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Derive coordinates — always work in the same viewBox space
  const max = Math.max(...data.map((p) => p.total), 1);
  const innerW = WIDTH - PADDING_X * 2;
  const innerH = HEIGHT - PADDING_Y * 2;
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;

  const points = data.map((p, i) => ({
    x: PADDING_X + i * stepX,
    y: PADDING_Y + innerH - (p.total / max) * innerH,
    ...p,
  }));

  const baseY = PADDING_Y + innerH;
  const linePath = smoothPath(points);
  const areaPath = smoothPath(points, baseY);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const onMove = (e: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width) * WIDTH;
      let closest = 0;
      let best = Infinity;
      for (let i = 0; i < points.length; i++) {
        const d = Math.abs(points[i].x - relX);
        if (d < best) {
          best = d;
          closest = i;
        }
      }
      setHoverIdx(closest);
    };
    const onLeave = () => setHoverIdx(null);
    svg.addEventListener("pointermove", onMove);
    svg.addEventListener("pointerleave", onLeave);
    return () => {
      svg.removeEventListener("pointermove", onMove);
      svg.removeEventListener("pointerleave", onLeave);
    };
  }, [points]);

  const hover = hoverIdx !== null ? points[hoverIdx] : null;
  const allZero = data.every((p) => p.total === 0);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-label="Monthly spending trend over the last 6 months"
      >
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c4ff3d" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c4ff3d" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="trend-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c4ff3d" />
            <stop offset="100%" stopColor="#c4ff3d" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines */}
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={PADDING_X}
            x2={WIDTH - PADDING_X}
            y1={PADDING_Y + innerH * t}
            y2={PADDING_Y + innerH * t}
            stroke="rgba(255,255,255,0.04)"
            strokeDasharray="2 4"
          />
        ))}

        {/* Area */}
        {!allZero && (
          <path d={areaPath} fill="url(#trend-fill)" />
        )}

        {/* Line */}
        {!allZero && (
          <path
            d={linePath}
            fill="none"
            stroke="url(#trend-line)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Points */}
        {!allZero &&
          points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={hoverIdx === i ? 5 : 3}
              fill={hoverIdx === i ? "#fff" : "#c4ff3d"}
              stroke={hoverIdx === i ? "#c4ff3d" : "none"}
              strokeWidth="2"
              className="transition-all duration-150"
            />
          ))}

        {/* Hover guideline */}
        {hover && (
          <line
            x1={hover.x}
            x2={hover.x}
            y1={PADDING_Y}
            y2={baseY}
            stroke="rgba(196,255,61,0.35)"
            strokeDasharray="3 3"
          />
        )}

        {/* Month labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={HEIGHT - 4}
            textAnchor="middle"
            className="fill-zinc-500 text-[10px]"
            style={{ fontSize: 10 }}
          >
            {p.label}
          </text>
        ))}
      </svg>

      {/* Tooltip */}
      {hover && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-md border border-white/10 bg-zinc-900/95 px-2.5 py-1.5 text-xs shadow-lg backdrop-blur-sm"
          style={{
            left: `${(hover.x / WIDTH) * 100}%`,
            top: `${(hover.y / HEIGHT) * 100}%`,
            marginTop: -8,
          }}
        >
          <div className="text-zinc-500 text-[10px] uppercase tracking-wide">
            {hover.label}
          </div>
          <div className="font-mono font-semibold text-zinc-100 tabular-nums">
            {formatCurrency(hover.total, currency)}
          </div>
        </div>
      )}

      {allZero && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-600">
          No spending history yet
        </div>
      )}
    </div>
  );
}
