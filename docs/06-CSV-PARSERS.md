# SubTracker — CSV/OFX Bank Import System

## Architecture

```
User uploads file
  → Detect encoding (UTF-8, Windows-1250, ISO-8859-2)
  → Parse with Papa Parse
  → Auto-detect bank format (header matching)
  → Transform to ParsedTransaction[]
  → Detect recurring charges (subscription detector)
  → User reviews & confirms
  → Create subscriptions + payment records
```

## Core Types

```typescript
interface ParsedTransaction {
  date: Date;
  amount: number;           // Always positive for expenses
  type: 'debit' | 'credit';
  description: string;
  counterparty?: string;
  reference?: string;
  currency?: string;
  rawRow: Record<string, string>;  // Original data for debugging
}

interface BankParser {
  id: string;               // 'fio', 'csas', 'revolut'
  name: string;             // 'Fio Banka'
  country: string;          // 'CZ', 'US', 'GB'
  detect(headers: string[], sampleRows: string[][]): number;  // 0-100 confidence
  parse(headers: string[], rows: string[][]): ParsedTransaction[];
  dateFormat: string;       // 'DD.MM.YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'
  encoding?: string;        // Expected encoding
}

interface DetectedSubscription {
  name: string;                    // Cleaned merchant name
  amount: number;                  // Average amount
  currency: string;
  estimatedCycle: 'monthly' | 'yearly' | 'weekly' | 'quarterly';
  occurrences: ParsedTransaction[];
  confidence: number;              // 0-100
  existingMatch?: string;          // ID if matches existing subscription
}

interface ImportResult {
  totalRows: number;
  parsedRows: number;
  detectedSubscriptions: DetectedSubscription[];
  bankDetected: string;
  warnings: string[];
}
```

## Bank Parsers

### Czech Banks

#### Fio Banka
```typescript
const fioParser: BankParser = {
  id: 'fio',
  name: 'Fio Banka',
  country: 'CZ',
  dateFormat: 'DD.MM.YYYY',
  encoding: 'utf-8',
  detect: (headers) => {
    // Fio headers: "Datum", "Objem", "Měna", "Protiúčet", "Název protiúčtu",
    // "Kód banky", "Zpráva pro příjemce", "Typ", "ID operace"
    const fioHeaders = ['ID operace', 'Datum', 'Objem', 'Měna'];
    const matches = fioHeaders.filter(h => headers.includes(h)).length;
    return (matches / fioHeaders.length) * 100;
  },
  parse: (headers, rows) => {
    const dateIdx = headers.indexOf('Datum');
    const amountIdx = headers.indexOf('Objem');
    const currencyIdx = headers.indexOf('Měna');
    const counterpartyIdx = headers.indexOf('Název protiúčtu');
    const descIdx = headers.indexOf('Zpráva pro příjemce');
    // ... parse each row
  },
};
```

#### Česká spořitelna (ČSAS)
- Headers: "Datum zaúčtování", "Částka", "Měna", "Název protiúčtu"
- Encoding: Windows-1250 or UTF-8
- Delimiter: semicolon

#### ČSOB
- Headers: "datum zaúčtování", "částka", "měna", "název protiúčtu"
- Encoding: Windows-1250
- Delimiter: semicolon

#### Komerční banka
- Headers: "Datum splatnosti", "Castka", "Mena"
- Encoding: Windows-1250
- Delimiter: semicolon

#### Moneta Money Bank
- Similar to ČSOB format
- Delimiter: semicolon

### International Banks

#### Revolut
```typescript
const revolutParser: BankParser = {
  id: 'revolut',
  name: 'Revolut',
  country: 'INTL',
  dateFormat: 'YYYY-MM-DD',
  encoding: 'utf-8',
  detect: (headers) => {
    // Revolut: "Type","Product","Started Date","Completed Date",
    // "Description","Amount","Fee","Currency","State","Balance"
    const revHeaders = ['Type', 'Product', 'Started Date', 'Completed Date', 'Amount', 'Currency', 'State'];
    const matches = revHeaders.filter(h => headers.includes(h)).length;
    return (matches / revHeaders.length) * 100;
  },
};
```

#### Wise (TransferWise)
- Headers: "TransferWise ID", "Date", "Amount", "Currency", "Description"
- Always UTF-8, comma-delimited

#### N26
- Headers: "Date", "Payee", "Account number", "Transaction type", "Payment reference", "Amount (EUR)"
- Always UTF-8, comma-delimited

#### Generic Parser (fallback)
```typescript
const genericParser: BankParser = {
  id: 'generic',
  name: 'Generic CSV',
  country: 'ANY',
  detect: () => 10,  // Always matches with low confidence
  parse: (headers, rows) => {
    // Heuristic: find date-like column, amount-like column, description-like column
    const dateCol = headers.findIndex(h =>
      /date|datum|día|fecha/i.test(h));
    const amountCol = headers.findIndex(h =>
      /amount|částka|objem|betrag|suma|balance/i.test(h));
    const descCol = headers.findIndex(h =>
      /description|popis|název|name|note|zpráva|reference/i.test(h));
    // ... best-effort parsing
  },
};
```

## Subscription Detection Algorithm

```typescript
function detectSubscriptions(
  transactions: ParsedTransaction[],
  existingSubscriptions: Subscription[]
): DetectedSubscription[] {
  // Step 1: Group by merchant/counterparty name (normalized)
  const grouped = groupByMerchant(transactions);

  // Step 2: For each group, check if recurring
  const detected: DetectedSubscription[] = [];

  for (const [merchant, txns] of grouped) {
    if (txns.length < 2) continue;  // Need at least 2 occurrences

    // Step 3: Analyze intervals between payments
    const intervals = calculateIntervals(txns);
    const avgInterval = mean(intervals);
    const stdDev = standardDeviation(intervals);

    // Step 4: Determine billing cycle
    let cycle: string | null = null;
    let confidence = 0;

    if (avgInterval >= 25 && avgInterval <= 35 && stdDev < 5) {
      cycle = 'monthly';
      confidence = 90 - stdDev * 5;
    } else if (avgInterval >= 350 && avgInterval <= 380 && stdDev < 15) {
      cycle = 'yearly';
      confidence = 85 - stdDev * 2;
    } else if (avgInterval >= 5 && avgInterval <= 9 && stdDev < 2) {
      cycle = 'weekly';
      confidence = 85 - stdDev * 10;
    } else if (avgInterval >= 85 && avgInterval <= 100 && stdDev < 10) {
      cycle = 'quarterly';
      confidence = 80 - stdDev * 3;
    }

    if (!cycle || confidence < 50) continue;

    // Step 5: Check amount consistency
    const amounts = txns.map(t => t.amount);
    const amountStdDev = standardDeviation(amounts);
    const avgAmount = mean(amounts);

    // If amounts vary by more than 10%, lower confidence
    if (amountStdDev / avgAmount > 0.10) {
      confidence -= 20;
    }

    // Step 6: Check if matches existing subscription
    const existingMatch = existingSubscriptions.find(sub =>
      normalize(sub.name) === normalize(merchant) ||
      fuzzyMatch(sub.name, merchant) > 0.8
    );

    if (confidence >= 50) {
      detected.push({
        name: cleanMerchantName(merchant),
        amount: roundToTwoDecimals(avgAmount),
        currency: txns[0].currency || 'USD',
        estimatedCycle: cycle,
        occurrences: txns,
        confidence,
        existingMatch: existingMatch?.id,
      });
    }
  }

  return detected.sort((a, b) => b.confidence - a.confidence);
}

// Merchant name normalization
function cleanMerchantName(raw: string): string {
  return raw
    .replace(/\b(PAYMENT|PURCHASE|DEBIT|CARD|POS|ONLINE)\b/gi, '')
    .replace(/\b\d{4,}\b/g, '')           // Remove long numbers
    .replace(/\b[A-Z]{2}\b$/g, '')         // Remove trailing country codes
    .replace(/\s+/g, ' ')
    .trim();
}
```

## Encoding Detection

```typescript
async function detectEncoding(file: File): Promise<string> {
  const buffer = await file.slice(0, 4096).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Check BOM
  if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
    return 'utf-8';
  }
  if (bytes[0] === 0xFF && bytes[1] === 0xFE) {
    return 'utf-16le';
  }

  // Check for Czech characters in Windows-1250
  // Characters like ě(0xEC), š(0x9A), č(0xE8), ř(0xF8), ž(0x9E)
  const hasWin1250 = bytes.some(b =>
    b === 0x9A || b === 0x9E || b === 0x8A || b === 0x8E
  );

  if (hasWin1250) return 'windows-1250';

  return 'utf-8';
}
```

## Number Format Detection

```typescript
// European: 1.234,56 or 1 234,56
// US/UK: 1,234.56
function parseAmount(value: string): number {
  const cleaned = value.replace(/\s/g, '');

  // Check if comma is decimal separator (European)
  if (/^\d{1,3}(\.\d{3})*,\d{2}$/.test(cleaned)) {
    return parseFloat(cleaned.replace(/\./g, '').replace(',', '.'));
  }

  // Check if dot is decimal separator (US)
  if (/^\d{1,3}(,\d{3})*\.\d{2}$/.test(cleaned)) {
    return parseFloat(cleaned.replace(/,/g, ''));
  }

  // Simple number with comma decimal
  if (/^-?\d+,\d+$/.test(cleaned)) {
    return parseFloat(cleaned.replace(',', '.'));
  }

  return parseFloat(cleaned);
}
```

## Import UI Flow

### Step 1: Upload
- Drag & drop zone + file picker
- Accept: .csv, .ofx, .qfx, .qif
- Max file size: 10MB
- Show file name + size after selection

### Step 2: Preview & Bank Detection
- Show detected bank name with confidence
- "Not right? Select your bank manually" dropdown
- Preview first 5 rows in a table
- Show column mapping

### Step 3: Detected Subscriptions
- List of detected recurring charges
- Each with: name, amount, cycle, confidence %, occurrence count
- Checkbox to include/exclude
- Option to map to existing subscription
- Category auto-suggestion

### Step 4: Confirm & Import
- Summary: "Importing X subscriptions from Y transactions"
- Import button
- Success message with link to view imported subscriptions

## Community Bank Parser Contribution

### How Contributors Add a Bank
1. Fork repo
2. Create `packages/parsers/src/banks/{bank-id}.ts`
3. Implement `BankParser` interface
4. Add to parser registry in `packages/parsers/src/detect.ts`
5. Add sample CSV (anonymized) to `packages/parsers/tests/fixtures/`
6. Write test
7. PR

### Parser Template
```typescript
// packages/parsers/src/banks/mybank.ts
import type { BankParser, ParsedTransaction } from '../types';

export const mybankParser: BankParser = {
  id: 'mybank',
  name: 'My Bank',
  country: 'XX',
  dateFormat: 'DD.MM.YYYY',
  encoding: 'utf-8',

  detect(headers, sampleRows) {
    // Return 0-100 confidence score
    const expected = ['Column1', 'Column2', 'Column3'];
    const matches = expected.filter(h => headers.includes(h)).length;
    return (matches / expected.length) * 100;
  },

  parse(headers, rows) {
    return rows.map(row => ({
      date: parseDate(row[0]),
      amount: Math.abs(parseFloat(row[1])),
      type: parseFloat(row[1]) < 0 ? 'debit' : 'credit',
      description: row[2],
      counterparty: row[3],
      currency: row[4] || 'USD',
      rawRow: Object.fromEntries(headers.map((h, i) => [h, row[i]])),
    }));
  },
};
```
