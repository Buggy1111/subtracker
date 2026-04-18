# SubTracker Documentation

Rozcestník veškeré dokumentace projektu. Tento adresář je rozdělen na dvě vrstvy:

1. **Audit & provoz (00–10)** — novější, produkčně zaměřené dokumenty. Začni tady, pokud nasazuješ, auditovi nebo přispíváš.
2. **Původní návrh (01-PROJECT-OVERVIEW … 10-COMPETITIVE-ANALYSIS)** — dokumenty z plánovací fáze. Obsahují původní vizi, mohou se v detailech lišit od aktuální implementace.

> **Status:** v0.5 Early Access (připraveno na Reddit r/selfhosted launch).
> Produkce: https://subtracker-web-six.vercel.app/ · GitHub: https://github.com/Buggy1111/subtracker

## Provozní dokumentace (audit-first)

| #  | Dokument | Popis |
|----|----------|-------|
| 00 | [INDEX](00-INDEX.md) | Tento soubor — rozcestník |
| 01 | [Architecture](01-ARCHITECTURE.md) | Monorepo, packages, data flow, trust boundaries |
| 02 | [Getting Started](02-GETTING-STARTED.md) | Lokální setup, OAuth, DB, migrace |
| 03 | [Deployment](03-DEPLOYMENT.md) | Vercel + Docker Compose + Neon |
| 04 | [Security](04-SECURITY.md) | Threat model, reporting issues, hardening checklist |
| 05 | [Features](05-FEATURES.md) | Honest feature list (co funguje, co NE) |
| 06 | [API](06-API.md) | Server actions, API routes, validace |
| 07 | [Database](07-DATABASE.md) | Schema, migrace, cascade delete |
| 08 | [Parsers](08-PARSERS.md) | Fio/Revolut/Wise/generic + detekce subskripcí |
| 09 | [Contributing](09-CONTRIBUTING.md) | Dev workflow, testy, PR flow |
| 10 | [Roadmap](10-ROADMAP.md) | Co je v0.5, co plánujeme do v1.0 |

## Původní plánovací dokumenty

Tyto dokumenty popisují původní vizi z března 2026. Některé části jsou zastaralé (hlavně 07 — plán mluvil o tiered pricing, reálně jedeme 100 % free/AGPL).

| Dokument | Stav |
|----------|------|
| [01-PROJECT-OVERVIEW.md](01-PROJECT-OVERVIEW.md) | Aktuální |
| [02-TECH-STACK.md](02-TECH-STACK.md) | Aktuální (upgrade na Next 16) |
| [03-DATABASE-SCHEMA.md](03-DATABASE-SCHEMA.md) | Aktuální |
| [04-FEATURES.md](04-FEATURES.md) | Ambiciózní — realita v [05-FEATURES.md](05-FEATURES.md) |
| [05-UI-DESIGN.md](05-UI-DESIGN.md) | Aktuální |
| [06-CSV-PARSERS.md](06-CSV-PARSERS.md) | Aktuální |
| [07-BUSINESS-MODEL.md](07-BUSINESS-MODEL.md) | **Zastaralé** — free/AGPL only |
| [08-IMPLEMENTATION-PLAN.md](08-IMPLEMENTATION-PLAN.md) | Historická reference |
| [09-API-ROUTES.md](09-API-ROUTES.md) | Doplněno o aktuální podobu v [06-API.md](06-API.md) |
| [10-COMPETITIVE-ANALYSIS.md](10-COMPETITIVE-ANALYSIS.md) | Aktuální |

## Rychlá orientace

- **Nasazuješ SubTracker?** → [02-GETTING-STARTED](02-GETTING-STARTED.md) → [03-DEPLOYMENT](03-DEPLOYMENT.md)
- **Auditor/reviewer?** → [04-SECURITY](04-SECURITY.md) → [01-ARCHITECTURE](01-ARCHITECTURE.md)
- **Přispěvatel?** → [09-CONTRIBUTING](09-CONTRIBUTING.md)
- **Chceš vědět co funguje?** → [05-FEATURES](05-FEATURES.md) → [10-ROADMAP](10-ROADMAP.md)
