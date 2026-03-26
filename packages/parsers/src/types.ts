export interface ParsedTransaction {
  date: Date;
  amount: number;
  type: 'debit' | 'credit';
  description: string;
  counterparty?: string;
  reference?: string;
  currency?: string;
  rawRow: Record<string, string>;
}

export interface BankParser {
  id: string;
  name: string;
  country: string;
  dateFormat: string;
  encoding?: string;
  detect(headers: string[], sampleRows: string[][]): number;
  parse(headers: string[], rows: string[][]): ParsedTransaction[];
}

export interface DetectedSubscription {
  name: string;
  amount: number;
  currency: string;
  estimatedCycle: 'monthly' | 'yearly' | 'weekly' | 'quarterly';
  occurrences: ParsedTransaction[];
  confidence: number;
  existingMatch?: string;
}

export interface ImportResult {
  totalRows: number;
  parsedRows: number;
  detectedSubscriptions: DetectedSubscription[];
  bankDetected: string;
  warnings: string[];
}
