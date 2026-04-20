"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_SECTIONS = [
  { href: "#stats", label: "stats" },
  { href: "#features", label: "features" },
  { href: "#import", label: "import" },
  { href: "#compare", label: "vs wallos" },
  { href: "#deploy", label: "self-host" },
  { href: "#stack", label: "stack" },
] as const;

const SERVICES = [
  { name: "Netflix", letter: "N", color: "#E50914", price: "$15.99" },
  { name: "Spotify", letter: "S", color: "#1DB954", price: "$10.99" },
  { name: "YouTube", letter: "Y", color: "#FF0000", price: "$13.99" },
  { name: "Claude", letter: "C", color: "#D97757", price: "$20.00" },
  { name: "Figma", letter: "F", color: "#F24E1E", price: "$15.00" },
  { name: "GitHub", letter: "G", color: "#8B5CF6", price: "$10.00" },
  { name: "Notion", letter: "N", color: "#787878", price: "$10.00" },
  { name: "NordVPN", letter: "N", color: "#4687FF", price: "$12.99" },
  { name: "Dropbox", letter: "D", color: "#0061FF", price: "$11.99" },
  { name: "iCloud+", letter: "i", color: "#3693F3", price: "$2.99" },
  { name: "1Password", letter: "1", color: "#3B66BC", price: "$2.99" },
  { name: "Linear", letter: "L", color: "#5E6AD2", price: "$8.00" },
  { name: "Twitch", letter: "T", color: "#9146FF", price: "$8.99" },
  { name: "Bitwarden", letter: "B", color: "#175DDC", price: "$0.83" },
  { name: "Strava", letter: "S", color: "#FC4C02", price: "$11.99" },
];

const FEATURES = [
  { num: "001", tag: "IMPORT", title: "CSV Auto-Detect", sub: "Drop a bank export. We detect Fio, Revolut, or Wise headers and surface recurring charges with confidence scores.", meta: "Fio · Revolut · Wise", status: "SHIPPED" },
  { num: "002", tag: "DASHBOARD", title: "Live Dashboard", sub: "Monthly spend, category breakdown, upcoming renewals — all in real-time. Annual projection at a glance.", meta: "Real-time", status: "SHIPPED" },
  { num: "003", tag: "QUICKADD", title: "60-Second Setup", sub: "Pick from 35+ pre-filled services — Netflix, Spotify, Claude, Figma, Notion. Done before your coffee cools.", meta: "35+ services", status: "SHIPPED" },
  { num: "004", tag: "ALERTS", title: "Smart Alerts", sub: "Reminders before every renewal. Weekly digest. Trial countdowns so you never get charged for something you forgot.", meta: "Weekly digest", status: "SHIPPED" },
  { num: "005", tag: "CALENDAR", title: "Renewal Calendar", sub: "Every upcoming charge on a visual calendar. Never be surprised by a $120 annual renewal again.", meta: "Month / week", status: "SHIPPED" },
  { num: "006", tag: "ANALYTICS", title: "Category & trend analytics", sub: "Top subs, category breakdown, billing cycle distribution. Understand where the money leaks.", meta: "7 chart types", status: "SHIPPED" },
  { num: "007", tag: "AUTH", title: "OAuth + self-hosted accounts", sub: "Sign in with Google or GitHub — or run completely local. Auth.js v5 under the hood.", meta: "Google · GitHub", status: "SHIPPED" },
  { num: "008", tag: "MULTICCY", title: "Multi-currency with FX", sub: "USD, EUR, GBP, CAD, JPY, CHF — converted and normalized to your home currency via daily ECB rates.", meta: "6 currencies", status: "SHIPPED" },
  { num: "009", tag: "DATA", title: "Your data. Period.", sub: "No bank login. Open source (AGPL-3.0). Self-host with one command. Export anytime. We can't see your data.", meta: "AGPL-3.0", status: "SHIPPED" },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Scroll-spy across both inline desktop links and mobile drawer links.
    const links = document.querySelectorAll<HTMLAnchorElement>(
      ".lv3-nav-links a, .lv3-nav-drawer a",
    );
    const sections = [...links]
      .map((a) => document.querySelector(a.getAttribute("href") ?? ""))
      .filter((el): el is Element => !!el);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            links.forEach((a) => {
              const target = document.querySelector(a.getAttribute("href") ?? "");
              a.classList.toggle("lv3-active", target === entry.target);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Close drawer on Escape so users can dismiss without aiming at the X.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Clicking the brand while already on the landing page is always meant as
  // "take me back to the top". Without this, Next.js Link short-circuits the
  // same-route navigation and nothing happens.
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window === "undefined") return;
    if (window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="lv3">
      <nav className="lv3-nav">
        <div className="lv3-wrap lv3-nav-row">
          <div className="lv3-nav-brand">
            <Link href="/" className="lv3-logo" onClick={handleLogoClick}>
              Sub<span className="lv3-dot">·</span>Tracker
            </Link>
            <span className="lv3-status">
              <span className="lv3-live-dot" />v0.5 · LIVE
            </span>
          </div>

          <div className="lv3-nav-links">
            {NAV_SECTIONS.map((s) => (
              <a key={s.href} href={s.href}>{s.label}</a>
            ))}
          </div>

          <div className="lv3-nav-ctas">
            <Link href="/login" className="lv3-nav-demo">
              <span>Live demo</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </Link>
            <a href="https://github.com/Buggy1111/subtracker" target="_blank" rel="noopener noreferrer" className="lv3-nav-cta">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span>GitHub</span>
              <span className="lv3-badge">v0.5</span>
            </a>
            <button
              type="button"
              className="lv3-nav-menu-btn"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="lv3-nav-drawer"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {menuOpen ? (
                  <>
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <div
          id="lv3-nav-drawer"
          className={`lv3-nav-drawer${menuOpen ? " lv3-nav-drawer-open" : ""}`}
          aria-hidden={!menuOpen}
        >
          <div className="lv3-wrap lv3-nav-drawer-inner">
            {NAV_SECTIONS.map((s) => (
              <a key={s.href} href={s.href} onClick={closeMenu}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <section className="lv3-hero">
        <div className="lv3-wrap lv3-hero-grid">
          <div>
            <div className="lv3-hero-kicker">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--lv3-accent)", boxShadow: "0 0 10px var(--lv3-accent)", animation: "lv3-pulse 2s infinite" }} />
              v0.5 · Open source · Self-hostable · Free forever
            </div>
            <h1>
              Your subscriptions.
              <br />
              <span className="lv3-em">Under control.</span>
            </h1>
            <p className="lv3-hero-sub">
              The average person pays <span className="lv3-highlight">$219/mo</span> in subscriptions — and forgets about a third of them. SubTracker catches every dollar.
            </p>
            <div className="lv3-hero-cta-row">
              <Link href="/login" className="lv3-btn-primary">
                Start tracking — it&apos;s free →
              </Link>
              <a href="https://github.com/Buggy1111/subtracker" target="_blank" rel="noopener noreferrer" className="lv3-btn-ghost">
                <span>Self-host</span>
                <span className="lv3-label">git clone</span>
              </a>
            </div>
            <div className="lv3-trust-row">
              <span><span className="lv3-check">✓</span> Free forever</span>
              <span className="lv3-sep">·</span>
              <span><span className="lv3-check">✓</span> No credit card</span>
              <span className="lv3-sep">·</span>
              <span><span className="lv3-check">✓</span> AGPL-3.0</span>
            </div>
          </div>

          <div className="lv3-dash">
            <div className="lv3-dash-head">
              <span className="lv3-dash-title">Dashboard</span>
              <span className="lv3-dash-meta">APRIL · 2026</span>
            </div>
            <div className="lv3-kpi-grid">
              <div className="lv3-kpi lv3-kpi-primary">
                <div className="lv3-kpi-label">Monthly Spend</div>
                <div className="lv3-kpi-value">$142.50</div>
                <div className="lv3-kpi-sub">12 active subscriptions</div>
              </div>
              <div className="lv3-kpi">
                <div className="lv3-kpi-label">Active</div>
                <div className="lv3-kpi-value">12</div>
                <div className="lv3-kpi-sub">14 total</div>
              </div>
              <div className="lv3-kpi">
                <div className="lv3-kpi-label">Next Renewal</div>
                <div className="lv3-kpi-value" style={{ fontSize: 18 }}>Apr 21</div>
                <div className="lv3-kpi-sub">Netflix · $15.99</div>
              </div>
              <div className="lv3-kpi">
                <div className="lv3-kpi-label">Annual Projection</div>
                <div className="lv3-kpi-value" style={{ fontSize: 18 }}>$1,710</div>
                <div className="lv3-kpi-sub">Estimated yearly total</div>
              </div>
            </div>
            <div className="lv3-dash-renewals">
              <div className="lv3-dash-renewals-head">Upcoming · 7 days</div>
              <div className="lv3-renewal-row">
                <div className="lv3-renewal-svc">
                  <span className="lv3-renewal-dot" style={{ background: "#E50914" }}>N</span>
                  <span>Netflix renews</span>
                </div>
                <span className="lv3-renewal-meta"><span className="lv3-renewal-urgent">in 2 days</span> · $15.99</span>
              </div>
              <div className="lv3-renewal-row">
                <div className="lv3-renewal-svc">
                  <span className="lv3-renewal-dot" style={{ background: "#1DB954" }}>S</span>
                  <span>Spotify renews</span>
                </div>
                <span className="lv3-renewal-meta"><span className="lv3-renewal-soon">in 5 days</span> · $10.99</span>
              </div>
              <div className="lv3-renewal-row">
                <div className="lv3-renewal-svc">
                  <span className="lv3-renewal-dot" style={{ background: "#D97757" }}>C</span>
                  <span>Claude renews</span>
                </div>
                <span className="lv3-renewal-meta">in 6 days · $20.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="lv3-ticker-wrap">
        <p className="lv3-ticker-label">Tracks 35+ popular services out of the box</p>
        <div className="lv3-ticker">
          <div className="lv3-ticker-track">
            {[...SERVICES, ...SERVICES].map((s, i) => (
              <div key={i} className="lv3-ticker-item">
                <span className="lv3-ticker-logo" style={{ background: s.color }}>{s.letter}</span>
                <span className="lv3-svc">{s.name}</span>
                <span className="lv3-sep">·</span>
                <span className="lv3-amt">{s.price}/mo</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="lv3-killer" id="stats">
        <div className="lv3-wrap">
          <div className="lv3-killer-head">
            <div className="lv3-killer-kicker">The damage report</div>
            <h2 className="lv3-killer-title">
              The numbers you don&apos;t want to see. <span className="lv3-em-fg">But should.</span>
            </h2>
          </div>
          <div className="lv3-stats-trio">
            <div className="lv3-stat-card">
              <span className="lv3-stat-num"><span className="lv3-sm">$</span>219</span>
              <div className="lv3-stat-label">avg. monthly spend</div>
              <p className="lv3-stat-desc">on subscriptions, per person</p>
            </div>
            <div className="lv3-stat-card lv3-mid">
              <span className="lv3-stat-num">2.5×</span>
              <div className="lv3-stat-label">the underestimate</div>
              <p className="lv3-stat-desc">of what people think they pay</p>
            </div>
            <div className="lv3-stat-card lv3-red">
              <span className="lv3-stat-num"><span className="lv3-sm">$</span>127</span>
              <div className="lv3-stat-label">wasted every year</div>
              <p className="lv3-stat-desc">on forgotten subscriptions</p>
            </div>
          </div>
        </div>
      </section>

      <section className="lv3-problem">
        <div className="lv3-wrap">
          <p className="lv3-problem-quote">
            Built for people who <span className="lv3-em">hate</span>
            <br />
            <span className="lv3-dim">wasting money.</span>
          </p>
        </div>
      </section>

      <section className="lv3-ledger" id="features">
        <div className="lv3-wrap">
          <div className="lv3-section-head">0.1 · THE FEATURES</div>
          <div className="lv3-ledger-intro">
            <h2 className="lv3-section-title">
              Everything a <span className="lv3-em">tracker</span> should do.<br />Nothing a tracker shouldn&apos;t.
            </h2>
            <p>No ads. No upsells. No &quot;Pro plan&quot; that unlocks basic math. Just a clean ledger of what you pay and when it renews — running on your server, reading from your bank.</p>
          </div>

          <div className="lv3-ledger-table">
            <div className="lv3-ledger-head">
              <span>#</span>
              <span>Tag</span>
              <span>Entry</span>
              <span>Scope</span>
              <span style={{ textAlign: "right" }}>Status</span>
            </div>
            {FEATURES.map((f) => (
              <div key={f.num} className="lv3-ledger-row">
                <span className="lv3-row-num">{f.num}</span>
                <span className="lv3-row-tag">{f.tag}</span>
                <div className="lv3-row-desc">
                  {f.title}
                  <span className="lv3-row-sub">{f.sub}</span>
                </div>
                <span className="lv3-row-meta">{f.meta}</span>
                <span className="lv3-row-status">{f.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lv3-import" id="import">
        <div className="lv3-wrap lv3-demo-grid">
          <div>
            <div className="lv3-section-head">0.2 · THE IMPORT</div>
            <h2 className="lv3-section-title">
              Drop a CSV.<br /><span className="lv3-em">Get every subscription.</span>
            </h2>
            <p className="lv3-hero-sub" style={{ marginTop: 28, maxWidth: 480 }}>
              Export your last 6 months from Fio, Revolut, or Wise. SubTracker detects recurring patterns — same merchant, same amount, same cadence — and suggests subscriptions with confidence scores. You confirm. It imports.
            </p>
            <div className="lv3-chips">
              <span className="lv3-chip">Fio Banka</span>
              <span className="lv3-chip">Revolut</span>
              <span className="lv3-chip">Wise</span>
              <span className="lv3-chip">Generic CSV</span>
              <span className="lv3-chip lv3-chip-accent">+ yours via PR</span>
            </div>
          </div>
          <div className="lv3-terminal">
            <div className="lv3-terminal-head">
              <span className="lv3-term-dot lv3-term-dot-r" />
              <span className="lv3-term-dot lv3-term-dot-y" />
              <span className="lv3-term-dot lv3-term-dot-g" />
              <span className="lv3-terminal-title">subtracker · import · fio-2026-q1.csv</span>
            </div>
            <div className="lv3-terminal-body">
              <div className="lv3-term-line"><span className="lv3-term-prompt">→</span><span className="lv3-term-cmd">parsing fio-2026-q1.csv</span></div>
              <div className="lv3-term-line">&nbsp;&nbsp;<span className="lv3-term-detect">detected:</span> Fio Banka format (✓ headers match)</div>
              <div className="lv3-term-line">&nbsp;&nbsp;486 transactions · Jan 1 → Mar 31</div>
              <div className="lv3-term-line">&nbsp;</div>
              <div className="lv3-term-line"><span className="lv3-term-prompt">→</span><span className="lv3-term-cmd">scanning for recurring patterns</span></div>
              <div className="lv3-term-line">&nbsp;&nbsp;<span className="lv3-term-ok">✓</span> <span className="lv3-term-highlight">NETFLIX.COM</span> — $15.99 · monthly · 94%</div>
              <div className="lv3-term-line">&nbsp;&nbsp;<span className="lv3-term-ok">✓</span> <span className="lv3-term-highlight">SPOTIFY AB</span> — $10.99 · monthly · 98%</div>
              <div className="lv3-term-line">&nbsp;&nbsp;<span className="lv3-term-ok">✓</span> <span className="lv3-term-highlight">GITHUB INC</span> — $10.00 · monthly · 97%</div>
              <div className="lv3-term-line">&nbsp;&nbsp;<span className="lv3-term-ok">✓</span> <span className="lv3-term-highlight">ANTHROPIC</span> — $20.00 · monthly · 91%</div>
              <div className="lv3-term-line">&nbsp;&nbsp;<span className="lv3-term-ok">✓</span> <span className="lv3-term-highlight">FIGMA INC</span> — $15.00 · monthly · 95%</div>
              <div className="lv3-term-line">&nbsp;&nbsp;<span className="lv3-term-warn">?</span> EIGHT SLEEP — $24.00 · 2 charges · 62%</div>
              <div className="lv3-term-line">&nbsp;</div>
              <div className="lv3-term-line"><span className="lv3-term-ok">✓</span> 5 subscriptions confirmed · 1 flagged</div>
              <div className="lv3-term-line">&nbsp;&nbsp;<span className="lv3-term-detect">total recurring:</span> <span className="lv3-term-highlight">$71.98 / month</span><span className="lv3-term-cursor" /></div>
            </div>
          </div>
        </div>
      </section>

      <section className="lv3-compare" id="compare">
        <div className="lv3-wrap">
          <div className="lv3-section-head">0.3 · HONESTLY THOUGH</div>
          <h2 className="lv3-section-title">Why not <span className="lv3-em">Wallos?</span></h2>
          <p className="lv3-compare-lead">Wallos is great and we love that it exists. But it&apos;s from a different era of the web. SubTracker is what you get if you design the same idea today.</p>

          <div className="lv3-compare-grid">
            <div className="lv3-receipt lv3-them">
              <div className="lv3-receipt-title">Wallos</div>
              <div className="lv3-receipt-subtitle">PHP · 7.6K ★ · since 2023</div>
              {[
                ["Stack", "PHP 8 · SQLite"],
                ["Frontend", "Vanilla JS + jQuery"],
                ["Type safety", "—"],
                ["CSV import", "Generic only"],
                ["Bank auto-detect", "—"],
                ["Deploy target", "Apache / LAMP"],
                ["Mobile UX", "Responsive-ish"],
                ["Aesthetic", "Admin panel"],
              ].map(([k, v]) => (
                <div key={k} className="lv3-receipt-line"><span>{k}</span><span className="lv3-val">{v}</span></div>
              ))}
            </div>
            <div className="lv3-receipt lv3-us">
              <div className="lv3-receipt-title">SubTracker</div>
              <div className="lv3-receipt-subtitle">TypeScript · v0.5 · 2026</div>
              {[
                ["Stack", "Next.js 16 · Postgres"],
                ["Frontend", "React 19 · Tailwind v4"],
                ["Type safety", "End-to-end + Drizzle"],
                ["CSV import", "Fio · Revolut · Wise"],
                ["Bank auto-detect", "Yes, 3 + growing"],
                ["Deploy target", "Docker / Vercel / Neon"],
                ["Mobile UX", "Mobile-first"],
                ["Aesthetic", "This page."],
              ].map(([k, v]) => (
                <div key={k} className="lv3-receipt-line"><span>{k}</span><span className="lv3-val">{v}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="lv3-deploy" id="deploy">
        <div className="lv3-wrap">
          <div className="lv3-section-head">0.4 · YOUR SERVER, YOUR RULES</div>
          <h2 className="lv3-section-title">Run it <span className="lv3-em">anywhere.</span></h2>
          <p className="lv3-compare-lead">Two honest paths. Neither one has us seeing your data.</p>

          <div className="lv3-deploy-grid">
            <div className="lv3-deploy-card">
              <div className="lv3-deploy-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                  <line x1="8" y1="12" x2="8" y2="12.01" />
                  <line x1="12" y1="12" x2="12" y2="12.01" />
                  <line x1="16" y1="12" x2="16" y2="12.01" />
                </svg>
              </div>
              <div className="lv3-deploy-title">Self-host · Docker</div>
              <p className="lv3-deploy-desc">One docker-compose file. Postgres + web. Runs on your Raspberry Pi, your Hetzner box, your homelab. No telemetry, no phone-home.</p>
              <pre className="lv3-deploy-code">{`$ git clone github.com/Buggy1111/subtracker
$ cd subtracker
$ docker compose up -d
  ▸ serving on :3000`}</pre>
            </div>
            <div className="lv3-deploy-card">
              <div className="lv3-deploy-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div className="lv3-deploy-title">Deploy · Vercel + Neon</div>
              <p className="lv3-deploy-desc">Zero-config for the free tier. Fork, connect Vercel, point at a Neon serverless Postgres. Personal tracker online in under 10 minutes.</p>
              <pre className="lv3-deploy-code">{`$ vercel link
$ vercel env add DATABASE_URL
$ vercel --prod
  ▸ live in 94s`}</pre>
            </div>
          </div>
        </div>
      </section>

      <section className="lv3-stack" id="stack">
        <div className="lv3-wrap">
          <div className="lv3-section-head">0.5 · BILL OF MATERIALS</div>
          <h2 className="lv3-section-title">Opinionated, <span className="lv3-em">not overbuilt.</span></h2>
          <p className="lv3-stack-lead">Nine dependencies that matter. No mystery bundle. Read every file in the repo in one evening.</p>

          <pre className="lv3-stack-tree">{`subtracker@0.5.0 · AGPL-3.0 · ~12k LOC · 0 npm ads
├─ next           ^16.0.0   app router, RSC, server actions
├─ react          ^19.0.0   use() and Actions
├─ typescript     ^5.5.0    strict, no any
├─ tailwindcss    ^4.0.0    v4, no config file
├─ drizzle-orm    ^0.33.0   SQL in TS, migrations from schema
├─ postgres       ^3.4.0    Neon or self-hosted
├─ auth.js        ^5.0.0    Google + GitHub
├─ recharts       ^2.12.0   analytics only
└─ papaparse      ^5.4.0    CSV parsing, no magic`}</pre>
        </div>
      </section>

      <section className="lv3-cta">
        <div className="lv3-wrap">
          <div className="lv3-cta-badge">✓ FREE FOREVER · NO CREDIT CARD</div>
          <h2 className="lv3-cta-title">
            No subscription<br />
            <span className="lv3-dim">to track subscriptions.</span>
          </h2>

          <div className="lv3-cta-features">
            {[
              "Unlimited subs (self-hosted)",
              "Beautiful dark dashboard",
              "Bank CSV auto-detection",
              "Renewal reminders",
              "Multi-currency support",
              "Docker self-hosting",
            ].map((f) => (
              <div key={f} className="lv3-cta-feature">
                <span className="lv3-check">✓</span>{f}
              </div>
            ))}
          </div>

          <div className="lv3-cta-row">
            <Link href="/login" className="lv3-btn-primary">Get started free →</Link>
            <a href="https://github.com/Buggy1111/subtracker" target="_blank" rel="noopener noreferrer" className="lv3-btn-ghost">
              <span>Star on GitHub</span><span className="lv3-label">★</span>
            </a>
          </div>

          <div className="lv3-cta-cmd">
            <span className="lv3-hint">OR SELF-HOST</span>
            <span className="lv3-kw">$ docker compose up -d</span>
          </div>
        </div>
      </section>

      <footer className="lv3-footer">
        <div className="lv3-wrap">
          <div className="lv3-footer-grid">
            <div>
              <div className="lv3-footer-logo">Sub<span className="lv3-dot">·</span>Tracker</div>
              <p className="lv3-footer-tag">Open-source subscription tracking. Built in Moravia by one developer. Reviewed by no marketing team.</p>
            </div>
            <div className="lv3-footer-col">
              <h5>Product</h5>
              <Link href="/login">Live demo</Link>
              <a href="#features">Features</a>
              <a href="#deploy">Self-host</a>
              <a href="#stack">Stack</a>
            </div>
            <div className="lv3-footer-col">
              <h5>Source</h5>
              <a href="https://github.com/Buggy1111/subtracker" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://github.com/Buggy1111/subtracker/issues" target="_blank" rel="noopener noreferrer">Issues</a>
              <a href="https://github.com/Buggy1111/subtracker/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">Contributing</a>
              <a href="https://github.com/Buggy1111/subtracker/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">AGPL-3.0</a>
            </div>
            <div className="lv3-footer-col">
              <h5>Community</h5>
              <a href="https://reddit.com/r/selfhosted" target="_blank" rel="noopener noreferrer">r/selfhosted</a>
              <a href="https://github.com/Buggy1111/subtracker/discussions" target="_blank" rel="noopener noreferrer">Discussions</a>
            </div>
          </div>
          <div className="lv3-footer-bottom">
            <span>© 2026 · BUILT IN MORAVIA · NO TELEMETRY</span>
            <span>v0.5.0 · LAST DEPLOY 2026-04-19</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
