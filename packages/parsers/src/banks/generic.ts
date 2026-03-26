import type { BankParser, ParsedTransaction } from '../types';
import { parseDate, parseAmount } from '../utils';

/**
 * Find the index of a column matching one of the given patterns (case-insensitive).
 */
function findColumn(headers: string[], patterns: RegExp): number {
  return headers.findIndex(h => patterns.test(h));
}

export const genericParser: BankParser = {
  id: 'generic',
  name: 'Generic CSV',
  country: 'ANY',
  dateFormat: 'auto',
  encoding: 'utf-8',

  detect() {
    return 10; // Always matches with low confidence
  },

  parse(headers, rows) {
    const dateCol = findColumn(headers, /^(date|datum|día|fecha|data|Datum)$/i);
    const amountCol = findColumn(headers, /^(amount|částka|objem|betrag|suma|importe|montant|kwota)$/i);
    const descCol = findColumn(headers, /^(description|popis|název|name|note|zpráva|reference|memo|text|counterparty)$/i);

    const results: ParsedTransaction[] = [];

    for (const row of rows) {
      const dateStr = dateCol >= 0 ? row[dateCol] : row[0];
      const amountStr = amountCol >= 0 ? row[amountCol] : row[row.length - 1];
      const desc = descCol >= 0 ? row[descCol] : row[1] || '';

      const date = parseDate(dateStr || '');
      const rawAmount = parseAmount(amountStr || '');

      if (isNaN(date.getTime()) || isNaN(rawAmount)) continue;

      results.push({
        date,
        amount: Math.abs(rawAmount),
        type: rawAmount < 0 ? 'debit' : 'credit',
        description: desc,
        counterparty: desc || undefined,
        rawRow: Object.fromEntries(headers.map((h, i) => [h, row[i] || ''])),
      });
    }

    return results;
  },
};
