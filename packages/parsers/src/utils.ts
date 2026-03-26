/**
 * Parse a numeric string in either US (1,234.56) or EU (1.234,56) format.
 * Strips currency symbols and whitespace.
 */
export function parseAmount(value: string): number {
  // Strip currency symbols and trim
  let cleaned = value
    .replace(/[^0-9.,\-\s]/g, '')
    .trim();

  if (cleaned === '') return NaN;

  // Remove all whitespace (space thousands: 1 234,56)
  cleaned = cleaned.replace(/\s/g, '');

  // EU format: 1.234,56 (dot as thousands, comma as decimal)
  if (/^-?\d{1,3}(\.\d{3})+,\d{1,2}$/.test(cleaned)) {
    return parseFloat(cleaned.replace(/\./g, '').replace(',', '.'));
  }

  // US format: 1,234.56 (comma as thousands, dot as decimal)
  if (/^-?\d{1,3}(,\d{3})+\.\d{1,2}$/.test(cleaned)) {
    return parseFloat(cleaned.replace(/,/g, ''));
  }

  // Simple comma decimal (no thousands): 15,99
  if (/^-?\d+,\d{1,2}$/.test(cleaned)) {
    return parseFloat(cleaned.replace(',', '.'));
  }

  // Simple dot decimal or integer: 15.99, 100
  if (/^-?\d+(\.\d+)?$/.test(cleaned)) {
    return parseFloat(cleaned);
  }

  return NaN;
}

/**
 * Parse a date string in various formats.
 * Supports: YYYY-MM-DD, DD.MM.YYYY, DD/MM/YYYY, MM/DD/YYYY (with hint), YYYYMMDD
 */
export function parseDate(value: string, hint?: 'us' | 'eu'): Date {
  const trimmed = value.trim();

  // ISO / datetime: 2026-04-15 or 2026-04-15T10:30:00
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
  }

  // Compact: YYYYMMDD
  if (/^\d{8}$/.test(trimmed)) {
    const y = parseInt(trimmed.slice(0, 4));
    const m = parseInt(trimmed.slice(4, 6));
    const d = parseInt(trimmed.slice(6, 8));
    return new Date(y, m - 1, d);
  }

  // Dot-separated: DD.MM.YYYY
  const dotMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dotMatch) {
    return new Date(parseInt(dotMatch[3]), parseInt(dotMatch[2]) - 1, parseInt(dotMatch[1]));
  }

  // Slash-separated: DD/MM/YYYY or MM/DD/YYYY
  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const a = parseInt(slashMatch[1]);
    const b = parseInt(slashMatch[2]);
    const y = parseInt(slashMatch[3]);

    if (hint === 'us') {
      // MM/DD/YYYY
      return new Date(y, a - 1, b);
    }
    // Default: DD/MM/YYYY (EU)
    return new Date(y, b - 1, a);
  }

  return new Date(NaN);
}

/**
 * Normalize bank transaction descriptions to extract clean merchant names.
 */
export function cleanMerchantName(raw: string): string {
  return raw
    .replace(/\b(PAYMENT|PURCHASE|DEBIT|CARD|POS|ONLINE|TO)\b/gi, '')
    .replace(/\b\d{5,}\b/g, '')           // Remove long numbers (5+ digits)
    .replace(/\b[A-Z]{2}\s*$/g, '')       // Remove trailing 2-letter country codes
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Detect file encoding from raw bytes.
 */
export function detectEncoding(bytes: Uint8Array): string {
  // Check BOM
  if (bytes.length >= 3 && bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
    return 'utf-8';
  }
  if (bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xFE) {
    return 'utf-16le';
  }

  // Check for Windows-1250 Czech characters
  // š=0x9A, ž=0x9E, Š=0x8A, Ž=0x8E, ě=0xEC is same in 1250 and latin2
  const hasWin1250 = bytes.some(b =>
    b === 0x9A || b === 0x9E || b === 0x8A || b === 0x8E
  );

  if (hasWin1250) return 'windows-1250';

  return 'utf-8';
}
