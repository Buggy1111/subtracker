# 09 — Contributing

> Kompletnější doprovod k root [CONTRIBUTING.md](../CONTRIBUTING.md). Tenhle dokument popisuje konvence, tooling a PR flow.

## Setup

Viz [02-GETTING-STARTED.md](02-GETTING-STARTED.md). TL;DR:

```bash
git clone https://github.com/Buggy1111/subtracker.git
cd subtracker
npm install
cp apps/web/.env.example apps/web/.env.local
# doplň OAuth creds
npm run dev
```

## Tooling

| Nástroj | Účel |
|---------|------|
| **Turborepo** | Monorepo build orchestrace (`turbo dev`, `turbo build`, …) |
| **TypeScript 5** | Strict mode, `noEmit` pro `type-check` |
| **Vitest** | Unit testy (`npm test` za monorepo, každý package má `vitest.config.ts`) |
| **next lint** | ESLint pro `apps/web` |
| **Drizzle Kit** | `db:generate`, `db:migrate`, `db:studio` |
| **Tailwind v4** | CSS (žádný `tailwind.config.js` — config je v `globals.css`) |
| **shadcn/ui** | Kopírované komponenty v `src/components/ui/` |

## Běžné příkazy

```bash
# Top-level (všechny packages/apps)
npm run dev           # Turbo: dev server + packages watch
npm run build         # Turbo: build all
npm run test          # Turbo: vitest run all
npm run type-check    # tsc --noEmit
npm run lint          # next lint

# Database
npm run db:generate   # vygeneruj novou migraci z schema.ts
npm run db:migrate    # spusť pending migrace
npm run db:studio     # Drizzle Studio GUI
npm run db:seed       # vlož default kategorie

# Per-workspace
npm test -w @subtracker/parsers
npm test -w @subtracker/db
npm test -w @subtracker/web
```

## Branching & commits

- `main` — production (deploy via Vercel)
- Feature branches: `feat/...`, `fix/...`, `docs/...`, `refactor/...`
- Pull requesty proti `main`
- Commit format: ~Conventional Commits
  ```
  feat: add weekly digest email preview
  fix: handle empty CSV in fio parser
  refactor: split landing page into sections
  docs: update security threat model
  ```

## Code style

### TypeScript
- **strict** mode, ne `any` (používej `unknown` + type guard)
- Funkce preferované před classami (výjimka: Auth.js provider definice)
- Server Actions: začni `"use server"`, return `ActionResult<T>`

### React / Next
- **Server Components by default** — `"use client"` jen když potřebuješ hook / event handler
- Stránka = server component, ikdyž má jen client wrapper (page.tsx → client.tsx pattern)
- `Link` přes `next/link` — ne `<a>` pro interní navigaci (mimo landing OSS links)

### Styling
- Tailwind utility classes. Dark mode first (body je `#09090B`)
- Custom CSS: jen v `globals.css`, přes `@layer`
- Žádné inline `style={{ ... }}` jen pokud je to dynamic (gradient, animation timeline)

### Validace
- Server-side: Zod schema z `@subtracker/db/validators`
- Client-side: `zodResolver(schema)` s `react-hook-form`
- Není důvod duplikovat schéma na frontendu — sdílej přes `@subtracker/db/validators`

## Testy

### Unit (vitest)
- `packages/*/src/__tests__/**.test.ts` — pure logic
- `apps/web/src/__tests__/*.test.ts` — server actions (s mocky)
- Mock strategy: `vi.mock()` pro `@/lib/db`, `@/lib/auth`, `next/cache`
- Coverage: není povinná, ale důležité edge casy pokrývat (neauth flow, invalid input, empty data)

### Před PR
```bash
npm run type-check   # musí projít 0 errors
npm test             # všechny testy zelené
npm run build        # musí projít (zahrnuje `next build`)
npm run lint         # warnings nevadí, ale errors fixni
```

### CI
`.github/workflows/ci.yml` spouští na `push main` a PR:
```
npm ci
npm test
npm run build  (s dummy DATABASE_URL a AUTH_SECRET)
```

Pokud chceš přidat e2e test (Playwright), připrav PR s diskusí design — zatím nemáme Playwright setup.

## Přidání nové fíčury

### Novou stránku
1. `apps/web/src/app/(app)/your-page/page.tsx` (Server Component, fetch data přes `actions/`)
2. Pokud potřebuje interactivity, vytvoř `client.tsx` a `'use client'`
3. Přidej link v `AppSidebar` (`apps/web/src/components/app-sidebar.tsx`)
4. Middleware / layout už řeší auth guard

### Nový server action
1. Do `apps/web/src/app/actions/*.ts` (nebo vytvoř nový soubor podle domény)
2. `"use server"` directive první řádek
3. Auth check, Zod validate, ownership query, revalidate
4. Test v `apps/web/src/__tests__/`

### Nový bank parser
Viz [08-PARSERS.md](08-PARSERS.md) → sekce "Přidání nového bank parser".

### Nová DB tabulka
1. `packages/db/src/schema.ts` — přidej `pgTable`
2. `npm run db:generate` — vygeneruje migraci v `drizzle/`
3. Review migraci — zkontroluj DROP TABLE / RENAME smysluplně
4. `npm run db:migrate` lokálně, ověř v Drizzle Studio
5. Přidej Zod schema v `validators.ts` pokud bude user-facing input
6. Commit schema.ts + migraci

## Co NEpřijímáme (low-priority PRs)

Některé requesty odmítáme aby projekt zůstal focused:

- Alternativní ORMs (Prisma, TypeORM) — Drizzle je náš choice
- Bundlers jiné než Turbopack/webpack default
- **Credentials (password) auth** — OAuth only. Password storage security je pro 1-man projekt out-of-scope.
- Crypto / Bitcoin tracking — projekt je o subscription cost management
- Custom charting libs pokud existuje Tremor / recharts equivalent

## Co vítáme

- Nové bank parsers (hlavně EU banky: KB, ČSOB, ING DE, BNP, …)
- i18n scaffold (next-intl)
- Chart components (Dashboard / Analytics)
- A11y improvements (aria labels, keyboard navigation)
- Performance optimalizace (RSC caching, image opt, font subsetting)
- Bug reporty s reproducible steps

## Otázky?

- GitHub Issues — bugs, features
- GitHub Discussions — obecné otázky, brainstorm
- Email autor: michalbugy12@gmail.com (prosím jen security + commercial)
