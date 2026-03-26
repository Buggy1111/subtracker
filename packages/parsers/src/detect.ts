import type { BankParser } from './types';
import { fioParser } from './banks/fio';
import { revolutParser } from './banks/revolut';
import { wiseParser } from './banks/wise';
import { genericParser } from './banks/generic';

const parsers: BankParser[] = [
  fioParser,
  revolutParser,
  wiseParser,
  // generic is always last (lowest confidence)
  genericParser,
];

/**
 * Auto-detect which bank parser to use based on CSV headers.
 * Returns the parser with highest confidence score.
 */
export function detectBank(headers: string[], sampleRows: string[][]): BankParser {
  let bestParser = genericParser;
  let bestScore = 0;

  for (const parser of parsers) {
    const score = parser.detect(headers, sampleRows);
    if (score > bestScore) {
      bestScore = score;
      bestParser = parser;
    }
  }

  return bestParser;
}

export { parsers };
