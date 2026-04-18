# 04 — Security

> **Verdikt auditu (2026-04-17, pre-launch):** v0.5 je z pohledu business logiky bezpečná (auth, ownership checks, validace OK), ale **má vážnou zero-day závislost** (`drizzle-orm < 0.45.2`, GHSA-gpj5-g38j-94v9 — SQL injection via improperly escaped SQL identifiers) a několik launch-gate hardeningů chybí. Před veřejným Reddit launchem viz *Launch blockers* níže.

## Reportování issues

**Našel jsi security bug?** Prosím **NE** veřejný GitHub issue. Místo toho:

- Email: michalbugy12@gmail.com (předmět: `[SubTracker Security]`)
- Odpověď obvykle do 72 hodin. Disclosure coordination na přání.

Pokud je to low-severity (např. "README má špatný odkaz"), klidně jako normální issue.

## Threat model (v0.5)

### Asety
- Subscription data uživatele (názvy služeb, částky, renewal dates, notes)
- User profil (email, jméno, monthly budget)
- OAuth tokens (access/refresh v `accounts` tabulce)

### Actors
- **Anonym** — návštěvník landingu
- **Auth. user** — přihlášený přes Google/GitHub
- **Admin/DB operator** — má DB přístup (self-host operátor)
- **Útočník** — remote, bez přihlašovacích údajů

### Trust boundary diagram

```
  Anonym                         Auth. user
    |                                 |
    v                                 v
  /  landing  <--- CDN --->  /(app)/*  (vyžaduje auth)
    |                                 |
    |                                 v
    |                            Server Actions  -- eq(userId, session.user.id) --> DB
    |                                 |
    v                                 v
  /login -> Auth.js (OAuth)       /api/import (manual auth check, 5 MB limit, CSV only)
```

### Hlavní rizika a jejich stav

| ID | Riziko | Status |
|----|--------|--------|
| T1 | Cross-tenant leak (user A čte data usera B) | **Mitigated** — všechny DB queries v `apps/web/src/app/actions/*.ts` mají `and(eq(id, X), eq(userId, session.user.id))`. Ověřeno čtením kódu. |
| T2 | SQL injection | **Částečně otevřeno** — kód používá Drizzle query builder (parametrizované), ale drizzle verze 0.38.4 má známou zranitelnost v escape SQL identifierů. V kódu nepoužíváme raw sql template literals, což je úzká plocha, ale upgrade nutný. |
| T3 | CSRF | **Mitigated** — Next 16 server actions jsou by-default origin-checked. `/api/import` přijímá jen multipart/form-data + session cookie check. |
| T4 | XSS | **Mitigated** — React auto-escape, 0 × raw-HTML injection API v celém kódu, vstupy jdou přes Zod. Uživatelský vstup se vykresluje jako text. |
| T5 | OAuth account takeover | **Mitigated** — flag pro linking účtů se stejným emailem napříč provider není nastaven (Auth.js default = false). Kdyby útočník vytvořil Google účet se stejným emailem jako GitHub user, Auth.js dvojité linkování odmítne. |
| T6 | File upload abuse (DoS, content inj.) | **Částečně** — `/api/import` validuje: koncovka `.csv`, velikost ≤ 5 MB. **Chybí**: MIME sniff, rate limit, concurrent upload limit. ReDoS riziko v parsers je low (žádné catastrophic regex patterny). |
| T7 | Mass account creation / spam | **Otevřeno** — žádný rate limit, žádný captcha. Google/GitHub OAuth ale vyžadují reálný účet, což zvedá útokovou cenu. |
| T8 | Brute force na /api/auth/* | **Low risk** — Auth.js OAuth je redirect-based, není tam password field. Dev Credentials provider je jen pro `NODE_ENV=development`. |
| T9 | Session fixation / hijacking | **Mitigated** — Auth.js nastavuje secure cookies (`httpOnly`, `Secure` na HTTPS, `SameSite=lax`). JWT má secret z `AUTH_SECRET`. |
| T10 | Secrets leak | **Riziko na disku** — `.env.local` a `vercel-env-production.txt` obsahují produkční plaintext secrets (DB URL, OAuth secrets, AUTH_SECRET). Gitignorované, ale na disku dev stroje. |
| T11 | Data leak přes error messages | **Mitigated** — actions vracejí generické `{ success: false, error: "..." }`, ne stack traces. `error.tsx` zobrazuje `error.digest` (Next.js-generated ID), ne stack. |
| T12 | SSRF přes CSV parser | **Žádné riziko** — parsery ne-fetchují URLs. Jen textové parsování. |

## Launch blockery (MUST FIX před Reddit)

1. **HIGH — SQL injection CVE v drizzle-orm**
   - `drizzle-orm@0.38.4` → advisory GHSA-gpj5-g38j-94v9 (CVSS 7.5)
   - Fix: upgrade na `drizzle-orm@^0.45.2` (semver-major), test migrací
   - Rizika pro nás: nízká (neskládáme dynamické identifikátory z user inputu), ale je to veřejný CVE na headline dep — Reddit to najde.
   - Akce: `npm install drizzle-orm@latest` + `npm run build` + `npm test` + ověřit migrace

2. **HIGH — Next.js DoS advisory**
   - `next@16.2.1` → GHSA-q4gf-8mx6-v5v3 ("Denial of Service with Server Components")
   - Fix: `npm install next@16.2.4`
   - Akce: otestovat `npm run build` a dev smoke test

3. **MEDIUM — Neon DATABASE_URL exposed v `.env.local` a `vercel-env-production.txt`**
   - Soubor na disku obsahuje produkční heslo Postgres DB
   - `.gitignore` sedí, nejsou v git historii (ověřeno `git log --all -p -- '*.env*'` — prázdné)
   - Akce:
     a) **Rotuj DATABASE_URL password** v Neon konzoli (Neon umí rotovat bez downtime přes pooler)
     b) Rotuj `AUTH_SECRET` (existující sessiony se invalidují — OK pro pre-launch)
     c) Rotuj Google a GitHub OAuth secrets
     d) Smaž `vercel-env-production.txt` z pracovního stromu

4. **MEDIUM — `/api/import` nemá rate limit**
   - Uživatel může poslat 1000 × 5 MB CSV v loopu → DoS na Neon compute time (Neon má free tier limit ~0.5 compute hours/den)
   - Actually-exploitable, protože auth je levný (OAuth sessions cachované)
   - Akce: přidat Vercel Edge Config nebo [Upstash Ratelimit](https://upstash.com/docs/ratelimit) — třeba 10 importů / hour / user

## Highly recommended (hardening před launchem)

5. **Security headers v `next.config.ts`**
   ```ts
   async headers() {
     return [{
       source: "/:path*",
       headers: [
         { key: "X-Frame-Options", value: "DENY" },
         { key: "X-Content-Type-Options", value: "nosniff" },
         { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
         { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
       ],
     }];
   }
   ```
   Vercel má default `X-Frame-Options: SAMEORIGIN` a `Strict-Transport-Security`, ale nemá CSP. Pro OAuth flow CSP trochu komplikuje (externí redirecty), takže jako první krok `X-Frame-Options: DENY` + `nosniff` + `Referrer-Policy`.

6. **File upload — validuj skutečný MIME, ne jen koncovku**
   - `/api/import/route.ts:23` kontroluje `file.name.endsWith(".csv")` — útočník může přejmenovat `exploit.html` → `exploit.csv`
   - Pro CSV je to spíš kosmetická dier (parser selže nebo vyhodí exception), ale:
   - Přidej: čtení prvních N bytes a heuristiku (obsahuje `,` nebo `;` oddělovače, řádky, ASCII/UTF text)
   - Plus: logovat podezřelé uploady

7. **Docker compose — změň default DB password, odeber `ports: 5432:5432`**
   - Self-hoster co zkopíruje compose 1:1 dostane Postgres s `subtracker:subtracker` exposovaný na `:5432` z internetu, pokud nepoužívá firewall.
   - Akce: doplnit warning komentář v `docker-compose.yml` + změnit default na `changeme` + připojit README upozornění

8. **Delete account — current user NEodhlásíš po DELETE**
   - `apps/web/src/app/(app)/settings/settings-client.tsx:54-58` volá `deleteAccount()` a pak `signOut()`. Mezitím ale session v DB už je smazaná (cascade delete z `users`), takže `signOut` se musí spolehnout jen na JWT/cookies. To v pořádku, ale pokud `deleteAccount()` selže (nezaloguje chybu), UI nic neví. Ošetření chyby chybí.
   - Akce: zalogovat chybu, ukázat toast. Low priority.

9. **OAuth link cross-provider**
   - Pokud uživatel přihlásí Googlem (`email@example.com`), pak se vrátí s GitHubem na stejný email, Auth.js default vyhodí `OAuthAccountNotLinked`. Landing na `/api/auth/error?error=OAuthAccountNotLinked` je generická Auth.js stránka — bez custom error page to je OK, ale uživatel to může chápat jako bug.
   - Akce: custom `/api/auth/error` page s vysvětlením "pro stejný email použijte stejný provider" nebo přidat explicitní account linking flow (post-launch).

10. **CSV parser: unicode / path traversal v `fileName`**
    - `confirmImport()` v `apps/web/src/app/actions/import.ts:32` ukládá `fileName` do DB bez sanitizace. Pokud někdo nahraje soubor `../../etc/passwd.csv`, hodnota se uloží do DB, ale nikde se jako path neinterpretuje. Riziko = 0, ale estetika.
    - Akce: normalizovat na `path.basename(fileName)` nebo odstranit speciální znaky.

## Nice-to-have (post-launch)

- **Sentry / error tracking** — aktuálně žádný APM, v případě produkčního bugu jsi slepý
- **Audit log** — tabulka `audit_events` (user_id, action, timestamp, details JSONB) — pro compliance
- **CSP s nonces** — Next.js 16 to podporuje, ale OAuth vyžaduje velmi opatrné `connect-src`
- **Subresource Integrity** — Tailwind/shadcn fonts z Google, CDN hash verification
- **Backups test** — Neon má PITR, ale ověřit **restore** na samostatný project (alespoň 1× před launchem)
- **2FA** — OAuth provider to řeší sám (Google/GitHub 2FA), ale pokud se někdy přidá Credentials, potřebujeme TOTP
- **Soft-delete** místo hard-delete — `users.deletedAt` místo `DELETE`, kvůli ochraně před náhodným smazáním

## Dependencies audit (2026-04-17)

```
$ npm audit
10 vulnerabilities (6 moderate, 4 high)

HIGH:
  - drizzle-orm < 0.45.2  (SQL injection via SQL identifiers)  <- produkční runtime
  - next 16.0.0-beta.0 - 16.2.2  (DoS with Server Components)  <- produkční runtime
  - path-to-regexp 8.0.0 - 8.3.0  (ReDoS)                       <- tranzitivní, dev
  - vite 7.0.0 - 7.3.1  (path traversal / arbitrary file read)  <- dev only (vitest)

MODERATE:
  - @esbuild-kit/{core-utils,esm-loader}                        <- drizzle-kit dev dep
  - esbuild                                                     <- drizzle-kit dev dep
  - @hono/node-server                                            <- drizzle-kit dev dep
  - drizzle-kit                                                 <- dev
  - hono                                                        <- drizzle-kit dev dep
```

**Runtime (produkční riziko):** drizzle-orm HIGH, next HIGH. Ostatní jsou dev-tooling.

**Fix plán:**
```bash
npm install next@latest drizzle-orm@latest
npm install -D drizzle-kit@latest vite@latest
npm run db:generate   # ověřit že migrace jsou stabilní
npm run build && npm test
```

## Penetration testing checklist (pre-Reddit)

- [ ] Přihlásit se jako user A, získat ID subscription A-sub
- [ ] Přihlásit se jako user B, zkusit `GET /subscriptions/<A-sub>/edit` → očekáváno `notFound()` (404)
- [ ] Zkusit `POST` s invalid Zod data → očekáváno error message bez stack trace
- [ ] Upload CSV s 10 MB → očekáváno 400 "File too large"
- [ ] Upload `malicious.csv.exe` přejmenovaný na `.csv` → parser vyhodí exception, handled gracefully
- [ ] Upload CSV s ReDoS-like obsahem (miliony řádků) — timeout? OOM?
- [ ] `DELETE /api/<cokoliv>` bez cookie → 401 Not authenticated
- [ ] Sign in as A, smazat účet, zkusit znovu loadnout `/dashboard` → redirect na `/login`
- [ ] Cross-site request: POST na server action z externí domény → odmítnuto (Next origin check)
