# SubTracker — UI/UX Design Specification

## Design Philosophy

1. **Beautiful first** — design is the #1 differentiator for solo dev projects
2. **Dark mode default** — 80%+ of target audience prefers dark
3. **Mobile-first** — but desktop must shine too (bento grid)
4. **Immediate value** — show the "shock number" (total spend) instantly
5. **Positive framing** — "You saved X" not "You wasted X"

## Color System

### Primary Palette: Modern Purple (Fintech Startup)

```css
/* Light Mode */
--primary:          #7C3AED;  /* Violet 600 */
--primary-hover:    #6D28D9;  /* Violet 700 */
--primary-light:    #EDE9FE;  /* Violet 100 */
--secondary:        #A78BFA;  /* Violet 400 */

--success:          #10B981;  /* Emerald 500 — savings, positive */
--warning:          #F59E0B;  /* Amber 500 — upcoming renewals */
--danger:           #EF4444;  /* Red 500 — overspending, cancelled */
--info:             #3B82F6;  /* Blue 500 — neutral info */

--background:       #FAFAFE;
--surface:          #FFFFFF;
--surface-hover:    #F5F3FF;  /* Violet 50 */
--border:           #E5E7EB;  /* Gray 200 */

--text-primary:     #1E1B4B;  /* Indigo 950 */
--text-secondary:   #6B7280;  /* Gray 500 */
--text-muted:       #9CA3AF;  /* Gray 400 */

/* Dark Mode */
--background:       #0B0F1A;
--surface:          #151B2B;
--surface-2:        #1E2538;
--surface-3:        #263045;
--border:           #2A3249;
--border-hover:     #374151;

--primary:          #8B5CF6;  /* Violet 500 — slightly lighter for dark */
--primary-hover:    #7C3AED;

--success:          #34D399;  /* Emerald 400 — softened */
--warning:          #FBBF24;  /* Amber 400 */
--danger:           #F87171;  /* Red 400 */

--text-primary:     #F1F5F9;  /* Slate 100 */
--text-secondary:   #94A3B8;  /* Slate 400 */
--text-muted:       #475569;  /* Slate 600 */
```

### Category Colors

```css
--cat-entertainment:  #8B5CF6;  /* Violet */
--cat-productivity:   #3B82F6;  /* Blue */
--cat-streaming:      #EC4899;  /* Pink */
--cat-music:          #10B981;  /* Emerald */
--cat-cloud:          #6366F1;  /* Indigo */
--cat-news:           #F59E0B;  /* Amber */
--cat-gaming:         #EF4444;  /* Red */
--cat-health:         #14B8A6;  /* Teal */
--cat-food:           #F97316;  /* Orange */
--cat-shopping:       #A855F7;  /* Purple */
--cat-utilities:      #64748B;  /* Slate */
--cat-other:          #9CA3AF;  /* Gray */
```

## Typography

```css
--font-sans:        'Inter', 'Plus Jakarta Sans', system-ui, sans-serif;
--font-mono:        'JetBrains Mono', 'Fira Code', monospace;  /* For prices */

/* Scale */
--text-hero:        3rem / 1.1;     /* Total monthly spend */
--text-h1:          1.875rem / 1.2; /* Page titles */
--text-h2:          1.5rem / 1.3;   /* Section titles */
--text-h3:          1.25rem / 1.4;  /* Card titles */
--text-body:        1rem / 1.5;     /* Default */
--text-sm:          0.875rem / 1.5; /* Secondary info */
--text-xs:          0.75rem / 1.5;  /* Labels, badges */

/* Prices — tabular numbers for alignment */
font-variant-numeric: tabular-nums;
```

## Spacing & Radius

```css
--radius-sm:   8px;   /* Buttons, badges */
--radius-md:   12px;  /* Input fields */
--radius-lg:   16px;  /* Cards */
--radius-xl:   20px;  /* Dashboard widgets */
--radius-full: 9999px; /* Pills, avatars */

--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
```

## Shadows

```css
/* Light mode */
--shadow-sm:   0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md:   0 2px 8px rgba(0, 0, 0, 0.06);
--shadow-lg:   0 4px 16px rgba(0, 0, 0, 0.08);
--shadow-xl:   0 8px 32px rgba(0, 0, 0, 0.10);

/* Dark mode — use border instead of shadow */
--shadow-sm:   none; /* use border: 1px solid var(--border) */
--shadow-md:   none;
```

## Layout

### Desktop (>1024px) — Bento Grid Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] SubTracker          [Search]  [🔔]  [Avatar ▾]     │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                   │
│ Dashboard│  ┌──────────┐┌──────────┐┌──────────┐┌─────────┐│
│          │  │ $487/mo  ││ 14 subs  ││ Netflix  ││ Budget  ││
│ Subscrip.│  │ Total    ││ Active   ││ in 3 days││ 72%     ││
│          │  └──────────┘└──────────┘└──────────┘└─────────┘│
│ Import   │                                                   │
│          │  ┌─────────────────────┐┌────────────────────────┐│
│ Analytics│  │                     ││                        ││
│          │  │    Area Chart       ││    Donut Chart         ││
│ Calendar │  │    Monthly Trend    ││    By Category         ││
│          │  │                     ││                        ││
│ Settings │  └─────────────────────┘└────────────────────────┘│
│          │                                                   │
│          │  ┌───────────────────────────────────────────────┐│
│          │  │  Upcoming Renewals                            ││
│          │  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   ││
│          │  │  │Netflix│Spotfy│Adobe │Disney│GitHub│   ││
│          │  │  │$15.99│$10.99│$54.99│$13.99│$4.00│   ││
│          │  │  │3 days│5 days│12 d. │15 d. │22 d.│   ││
│          │  │  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘   ││
│          │  └───────────────────────────────────────────────┘│
└──────────┴──────────────────────────────────────────────────┘
```

### Mobile (<640px) — Single Column

```
┌──────────────────────┐
│  SubTracker    [🔔][≡]│
├──────────────────────┤
│                       │
│    $487.32/mo         │
│    14 subscriptions   │
│    ▼ 3.2% vs last mo  │
│                       │
├──────────────────────┤
│ [Upcoming][All][Stats]│
├──────────────────────┤
│ ┌──────────────────┐ │
│ │ 🔴 Netflix $15.99│ │
│ │   Renews in 3d   │ │
│ │   ← swipe: edit  │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ 🟢 Spotify $10.99│ │
│ │   Renews in 5d   │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ 🟢 Adobe  $54.99 │ │
│ │   Renews in 12d  │ │
│ └──────────────────┘ │
│        ...            │
├──────────────────────┤
│ [🏠][📋][➕][📊][⚙️] │
└──────────────────────┘
```

## Component Specifications

### Subscription Card

```
┌────────────────────────────────────────┐
│  [Logo]  Netflix            $15.99/mo  │
│          Entertainment      Renews     │
│          ● Active           in 3 days  │
└────────────────────────────────────────┘

States:
- Active: green dot, normal text
- Trial: blue dot, "Trial ends in X days" badge
- Renewing soon (≤3 days): amber dot, amber border glow
- Paused: gray dot, muted text
- Cancelled: red dot, strikethrough price
```

### KPI Card

```
┌─────────────────────────┐
│  Monthly Spend           │
│  $487.32                 │
│  ▲ 12.3% vs last month  │
│  ═══════════░░░░░  72%  │  ← budget bar (optional)
└─────────────────────────┘

Variants:
- Default: neutral border
- Success: green accent (under budget)
- Warning: amber accent (approaching budget)
- Danger: red accent (over budget)
```

### Empty State

```
┌─────────────────────────────────┐
│                                  │
│      [Illustration]              │
│                                  │
│   No subscriptions yet           │
│                                  │
│   Add your first subscription    │
│   to see where your money goes   │
│                                  │
│   [+ Add Subscription]           │
│   [Import from Bank CSV]         │
│                                  │
└─────────────────────────────────┘
```

## Animations & Transitions

```css
/* Standard transitions */
transition-colors:    150ms ease;
transition-transform: 200ms ease;
transition-opacity:   200ms ease;

/* Page transitions */
fade-in:             200ms ease;

/* Chart animations */
initial-load:        800ms ease-out;
data-update:         300ms ease;

/* Number counting */
hero-metric-count:   1000ms ease-out;  /* Count up from 0 to total */

/* Micro-interactions */
card-hover:          scale(1.01), shadow increase
button-press:        scale(0.98)
toggle-switch:       spring animation
confetti:            on first subscription added, on savings milestone
```

## Accessibility

- WCAG AA minimum contrast ratios (4.5:1 text, 3:1 large text)
- All interactive elements keyboard-navigable
- Screen reader labels on all icons and charts
- Reduced motion support (`prefers-reduced-motion`)
- Focus indicators on all interactive elements
- Color is never the only indicator (always paired with text/icon)
- Chart data available as table alternative

## Service Logos

### Strategy
1. Use **Simple Icons** (simpleicons.org) — 3000+ brand SVGs, free
2. Fallback: first letter of service name in brand color circle
3. User can upload custom logo

### Implementation
```tsx
// Logo component with fallback
function ServiceLogo({ name, logo, color }: Props) {
  if (logo && hasSimpleIcon(logo)) {
    return <SimpleIcon name={logo} color={color} size={32} />;
  }
  // Fallback: colored circle with initial
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center"
         style={{ backgroundColor: color || '#7C3AED' }}>
      <span className="text-white font-bold text-sm">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
```
