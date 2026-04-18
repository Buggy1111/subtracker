# 08 — Bank CSV Parsers

> `@subtracker/parsers` package: `packages/parsers/`. Čistý TS, jediná produkční dependence je `papaparse` (ale `apps/web/src/app/api/import/route.ts` vlastně neuži papaparse, má vlastní CSV parse helper). Vše je synchronní, pure functions.

## Architektura

```
        CSV Buffer (Uint8Array)
               |
               v
        detectEncoding()  --> "utf-8" | "utf-16le" | "windows-1250"
               |
               v
        TextDecoder(...)  -->  text
               |
               v
        parseCSVLine(...)  --> headers[], rows[][]
               |
               v
        detectBank(headers, sampleRows)
               |
          highest confidence
               v
        BankParser.parse(headers, rows)  -->  ParsedTransaction[]
               |
               v
        detectSubscriptions(txs)  -->  DetectedSubscription[]
```

## Podporované banky

### Fio Banka (`banks/fio.ts`)
- Country: CZ, Encoding: UTF-8
- Detection: headers musí obsahovat `ID operace`, `Datum`, `Objem`, `Měna` (4 z nich → 100 % confidence)
- Date format: DD.MM.YYYY
- Amount: EU format s čárkou jako decimal (`parseAmount` utility)
- Fields mapped:
  - `Datum` → date
  - `Objem` → amount (absolute), sign → debit/credit
  - `Měna` → currency (default CZK)
  - `Název protiúčtu` → counterparty
  - `Zpráva pro příjemce` → description
  - `ID operace` → reference

### Revolut (`banks/revolut.ts`)
- Country: INTL, Encoding: UTF-8
- Detection: headers musí obsahovat `Type`, `Product`, `Started Date`, `Completed Date`, `Amount`, `Currency`, `State`
- Date format: YYYY-MM-DD (z `Completed Date`)
- Amount: US format (parseFloat přímo, žádné EU decimal)
- Default currency: EUR

### Wise / TransferWise (`banks/wise.ts`)
- Country: INTL, Encoding: UTF-8
- Detection: `TransferWise ID`, `Date`, `Amount`, `Currency`, `Description`
- Date format: YYYY-MM-DD
- Default currency: USD

### Generic (`banks/generic.ts`)
- Catch-all, vždy vrátí confidence 10 → je poslední volba pokud žádný specifický parser nematchne
- Tries to find columns by regex patterns:
  - Date: `/^(date|datum|día|fecha|data|Datum)$/i`
  - Amount: `/^(amount|částka|objem|betrag|suma|importe|montant|kwota)$/i`
  - Description: `/^(description|popis|název|name|note|zpráva|reference|memo|text|counterparty)$/i`
- Skippuje řádky kde parse date/amount selže.

## Encoding detection

`utils.ts:detectEncoding()`:
- BOM check → UTF-8 BOM nebo UTF-16LE BOM
- Byte heuristika: pokud byte patří do `{0x9A, 0x9E, 0x8A, 0x8E}` (typické Windows-1250 pozice pro š/ž/Š/Ž), → `windows-1250`
- Default → `utf-8`

**Limit:** ISO-8859-2 / latin2 není rozeznáváno separátně (sdílené code pointy s 1250 se zvládnou, ale některé rozdílné znaky se zobrazí špatně).

## Subscription detection algoritmus

`subscription-detector.ts:detectSubscriptions()`:

1. **Group by merchant** — `cleanMerchantName(counterparty || description).toLowerCase().trim()`
   - `cleanMerchantName` strippuje keywords (`PAYMENT`, `PURCHASE`, `DEBIT`, `CARD`, `POS`, `ONLINE`, `TO`), dlouhá čísla (5+ číslic), trailing 2-letter country codes, více-mezer
2. **Skip groups < 2 transakce** — potřebujeme aspoň 2 pro interval
3. **Compute intervals** — dny mezi consecutivními transakcemi (sorted by date)
4. **Classify cycle** — avg interval + stddev rozhoduje:
   - weekly: avg 5-9 days, stddev < 2
   - monthly: avg 25-35 days, stddev < 5
   - quarterly: avg 85-100 days, stddev < 10
   - yearly: avg 350-380 days, stddev < 15
5. **Confidence score** — base per cycle, minus `stddev × multiplier`, minus 20 if amount stddev/avg > 10 %
6. **Filter confidence < 50** → zahodit
7. **Sort** descending by confidence

### Co algoritmus NEDĚLÁ
- Neumí rozpoznat trial → paid transition (první platba za 0 USD, pak full price)
- Neumí rozpoznat price changes (Netflix zdražil z $14.99 na $15.49 → rozdělí to do dvou skupin nebo sníží confidence)
- Neumí merge podobné merchant names ("NETFLIX" vs "NETFLIX.COM" vs "Netflix Inc.") — `cleanMerchantName` to trochu pomůže, ale není fuzzy matching
- Neumí cross-reference s existujícími subscriptions (abychom nevytvářeli duplikáty)
- Neumí rozpoznat proration (splátky různé částky v různé dny)

### Test coverage
Tests v `packages/parsers/src/__tests__/`:
- `utils.test.ts` — parseAmount, parseDate, cleanMerchantName, detectEncoding
- `banks.test.ts` — každý bank parser vůči sample CSV
- `subscription-detector.test.ts` — hlavní scenarios (monthly, yearly, noise rejection)

Vitest, běží `npm test -w @subtracker/parsers`.

## ReDoS audit

Všechny regex v parser kódu jsou jednoduché anchor-bound (`^...$`) nebo literal patterns. Žádný catastrophic backtracking scenario.

Parser je **synchronous, single-pass** (O(n) v počtu řádků), takže 5 MB CSV (max upload size) se rozparsuje v ~desítkách ms. DoS vektor by musel jít přes velký počet souběžných uploadů — ochrana = rate limiting (viz 04-SECURITY blocker #4).

## Přidání nového bank parser

1. Vytvoř `packages/parsers/src/banks/{bank}.ts` s exportem `BankParser`
2. Implementuj `detect(headers, sampleRows)` → vrátí 0-100 confidence
3. Implementuj `parse(headers, rows)` → vrátí `ParsedTransaction[]`
4. Zaregistruj v `packages/parsers/src/detect.ts` array `parsers`
5. Přidej testy v `packages/parsers/src/__tests__/banks.test.ts`
6. Update "Supports: Fio Banka, Revolut, Wise, and generic CSV" v `apps/web/src/app/(app)/import/import-client.tsx:231`

## Limits v produkci

- Max upload: 5 MB (route.ts:27)
- Max rows: žádný explicitní limit, ale 5 MB je ~50k rows pro typický tx file
- Detection algorithm memory: `O(merchants * avg_tx_per_merchant)` — pro 5 MB CSV naprosto zanedbatelné
- Time: single-pass, ~50-200 ms na 10k řádků
