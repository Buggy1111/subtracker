# 10 — Roadmap

> Poctivá mapa toho co je, co je plánované, a co ne. Stav 2026-04-17.

## v0.5 — Early Access (aktuální)

**Status:** Připraveno pro Reddit r/selfhosted launch. Core CRUD + CSV import + OAuth funguje.

**Co je hotové:** viz [05-FEATURES.md](05-FEATURES.md) sekce "Co funguje".

**Známé gapy:** viz [05-FEATURES.md](05-FEATURES.md) sekce "Co NEFUNGUJE / není implementováno" + [04-SECURITY.md](04-SECURITY.md) launch blockers.

## v0.6 — Post-Reddit Hardening (cíl: 2-4 týdny po launchi)

Priorita: fix toho co komunita najde + security debt.

- [ ] Upgrade `drizzle-orm` na `^0.45.2` + `next` na latest (vyřeší 2 × HIGH CVE)
- [ ] Rate limit na `/api/import` (Upstash Ratelimit)
- [ ] Security headers v `next.config.ts` (X-Frame-Options, Referrer-Policy, Permissions-Policy)
- [ ] MIME sniff validace v CSV upload
- [ ] Fix `getCategories()` bug — vrací global + user's own
- [ ] Docker compose: default password warning, odeber `5432:5432` mapping, resource limits
- [ ] Sentry integration (free tier stačí)
- [ ] Public health check endpoint rozšířit o DB ping (bez expozice detailu)
- [ ] Calendar navigace (prev/next month)
- [ ] Subscription detail page (read-only, link z list)
- [ ] Delete account — error handling + toast

## v1.0 — Feature Complete (cíl: ~3 měsíce post launch)

**Téma:** od "funguje" k "doporučíš kamarádovi".

### Email & notifikace
- [ ] Renewal email reminder (Resend, 1 den před renewal, customizable)
- [ ] Weekly digest email (pondělí ráno, summary za týden + next renewals)
- [ ] SMTP fallback pro self-host (nginx + Postfix relay, nebo Gmail app password)
- [ ] Unsubscribe link (povinné pro compliance)
- [ ] Email preferences v Settings

### Multi-currency
- [ ] FX API integrace (exchangerate.host free / open.er-api.com)
- [ ] User primary currency (z `users.currency`) → dashboard sčítá přepočtené
- [ ] Per-subscription keeper currency, display v preferred
- [ ] Historical rates (pro payments tabulku, aby dashboard graf neskákal s kurzem)

### Charts
- [ ] Tremor / Recharts integrace (preferuji Tremor = native shadcn-like)
- [ ] Dashboard: Monthly Trend (6 měsíců)
- [ ] Analytics: Category breakdown donut, stacked bar by month
- [ ] Calendar: heatmap varianta

### Mobile & PWA
- [ ] Bottom navigation na mobilu (subs | add | calendar | settings)
- [ ] Service worker + install prompt
- [ ] Offline cache pro list view

### Search & filtering
- [ ] Full-text search v subscription list
- [ ] Advanced filter: category, price range, date range
- [ ] Saved views

### Data management
- [ ] Export JSON / CSV (GDPR-friendly "download all my data")
- [ ] Payment history page (tabulka `payments`)
- [ ] Subscription pause schedule ("pause until 2026-07-01")

## v1.1 — Collaboration & Sharing (~6 měsíců post launch)

Pokud v1.0 získá trakci, pokračujeme k sharing modelu.

- [ ] Household / Family plan — share subscription s partnerem
- [ ] Split billing — "Netflix je za rodinu, já platím ale Anna mi dává 5 USD"
- [ ] Shared view (read-only link)
- [ ] Comments / notes na subscription (pro týmy)

## v1.2 — Integrations (long-term, spekulativní)

- [ ] Plaid / SaltEdge bank connect (namísto manuálního CSV)
- [ ] Auto-detect price increases (Netflix zdražil → alert)
- [ ] Cancellation assistant ("hey, you haven't used Disney+ in 3 months, want to cancel?")
- [ ] Chrome / Firefox extension — zachytit confirmation email po subscribe

## Co NEbudeme dělat

- **Crypto payments** — subscription = fiat recurring. Crypto má vlastní tooling.
- **Investment tracking** — separátní doména, viz Ghostfolio / Maybe.
- **Budget planning celkový** — YNAB / Lunchmoney jsou better suited. SubTracker je focused na subscriptions.
- **Password manager features** — 1Password / Bitwarden sit there. Neřešíme.
- **Mobile apps (native iOS/Android)** — PWA first. Native možná v v2.0 pokud je po tom poptávka.
- **Self-hosted billing platform** — BillSquid / Stripe Billing jsou B2B, tohle je consumer.

## Prioritizace

Každou feature hodnotíme proti:

1. **User pain score** — koho reálně bolí? (Reddit feedback, GitHub issues)
2. **Complexity** — kolik týdnů dev? (sólo projekt, 1 člověk, 10-15 hod/týden)
3. **Security debt** — nezvyšuje to attack surface?
4. **Maintenance cost** — budu to muset support-ovat 5 let?

Features bez user pain score (jen "cool to have") jdou do spodní šuplíku.

## Release cadence

- **Patch (vx.y.Z)** — bug fixes, security updates, týdně dle potřeby
- **Minor (vx.Y.0)** — nové features, měsíčně
- **Major (vX.0.0)** — breaking changes, DB migrace vyžadují user pozornost, ~6 měsíců

Produkce: auto-deploy na Vercel z `main` po merge. Docker image pushnut na GHCR po tag release.

## Jak ovlivnit roadmap

- GitHub Discussion "Feature request: XXX" — upvote
- PR s implementací — best way to accelerate
- Reddit / Twitter feedback — zohledňujeme hlavně v první 2 měsících po launchi
