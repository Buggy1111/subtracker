import { describe, it, expect } from 'vitest';
import { parseAmount, parseDate, cleanMerchantName, detectEncoding } from '../utils';

// ============================================================
// parseAmount — handle EU & US number formats
// ============================================================
describe('parseAmount', () => {
  // US format: 1,234.56
  it('parses US format with comma thousands separator', () => {
    expect(parseAmount('1,234.56')).toBe(1234.56);
  });

  it('parses simple US decimal', () => {
    expect(parseAmount('15.99')).toBe(15.99);
  });

  it('parses large US number', () => {
    expect(parseAmount('12,345,678.90')).toBe(12345678.90);
  });

  // EU format: 1.234,56 or 1 234,56
  it('parses EU format with dot thousands and comma decimal', () => {
    expect(parseAmount('1.234,56')).toBe(1234.56);
  });

  it('parses EU format with space thousands', () => {
    expect(parseAmount('1 234,56')).toBe(1234.56);
  });

  it('parses simple EU decimal (comma)', () => {
    expect(parseAmount('15,99')).toBe(15.99);
  });

  // Edge cases
  it('parses negative amounts', () => {
    expect(parseAmount('-15.99')).toBe(-15.99);
  });

  it('parses negative EU amounts', () => {
    expect(parseAmount('-1.234,56')).toBe(-1234.56);
  });

  it('parses integer without decimals', () => {
    expect(parseAmount('100')).toBe(100);
  });

  it('parses zero', () => {
    expect(parseAmount('0')).toBe(0);
    expect(parseAmount('0.00')).toBe(0);
    expect(parseAmount('0,00')).toBe(0);
  });

  it('strips currency symbols', () => {
    expect(parseAmount('$15.99')).toBe(15.99);
    expect(parseAmount('€1.234,56')).toBe(1234.56);
    expect(parseAmount('15.99 CZK')).toBe(15.99);
    expect(parseAmount('Kč 1 234,56')).toBe(1234.56);
  });

  it('handles whitespace', () => {
    expect(parseAmount('  15.99  ')).toBe(15.99);
  });

  it('returns NaN for invalid input', () => {
    expect(parseAmount('abc')).toBeNaN();
    expect(parseAmount('')).toBeNaN();
  });
});

// ============================================================
// parseDate — handle various date formats
// ============================================================
describe('parseDate', () => {
  it('parses ISO format (YYYY-MM-DD)', () => {
    const date = parseDate('2026-04-15');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(3); // 0-indexed
    expect(date.getDate()).toBe(15);
  });

  it('parses EU format (DD.MM.YYYY)', () => {
    const date = parseDate('15.04.2026');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(3);
    expect(date.getDate()).toBe(15);
  });

  it('parses EU format with slashes (DD/MM/YYYY)', () => {
    const date = parseDate('15/04/2026');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(3);
    expect(date.getDate()).toBe(15);
  });

  it('parses US format (MM/DD/YYYY)', () => {
    const date = parseDate('04/15/2026', 'us');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(3);
    expect(date.getDate()).toBe(15);
  });

  it('parses compact format (YYYYMMDD)', () => {
    const date = parseDate('20260415');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(3);
    expect(date.getDate()).toBe(15);
  });

  it('handles datetime strings (takes date part)', () => {
    const date = parseDate('2026-04-15T10:30:00');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getDate()).toBe(15);
  });

  it('returns Invalid Date for garbage', () => {
    const date = parseDate('not-a-date');
    expect(isNaN(date.getTime())).toBe(true);
  });
});

// ============================================================
// cleanMerchantName — normalize bank transaction descriptions
// ============================================================
describe('cleanMerchantName', () => {
  it('removes payment prefixes', () => {
    expect(cleanMerchantName('PAYMENT TO NETFLIX')).toBe('NETFLIX');
  });

  it('removes card transaction markers', () => {
    expect(cleanMerchantName('CARD PURCHASE SPOTIFY')).toBe('SPOTIFY');
  });

  it('removes POS markers', () => {
    expect(cleanMerchantName('POS DEBIT ADOBE SYSTEMS')).toBe('ADOBE SYSTEMS');
  });

  it('removes long numbers (transaction IDs)', () => {
    expect(cleanMerchantName('NETFLIX 123456789')).toBe('NETFLIX');
  });

  it('removes trailing country codes', () => {
    expect(cleanMerchantName('SPOTIFY AB SE')).toBe('SPOTIFY AB');
  });

  it('trims whitespace', () => {
    expect(cleanMerchantName('  NETFLIX  ')).toBe('NETFLIX');
  });

  it('collapses multiple spaces', () => {
    expect(cleanMerchantName('ADOBE   SYSTEMS   INC')).toBe('ADOBE SYSTEMS INC');
  });

  it('handles already clean names', () => {
    expect(cleanMerchantName('Netflix')).toBe('Netflix');
  });

  it('removes ONLINE prefix', () => {
    expect(cleanMerchantName('ONLINE PURCHASE GITHUB')).toBe('GITHUB');
  });
});

// ============================================================
// detectEncoding — identify file encoding
// ============================================================
describe('detectEncoding', () => {
  it('detects UTF-8 BOM', () => {
    const buffer = new Uint8Array([0xEF, 0xBB, 0xBF, 0x48, 0x65, 0x6C, 0x6C, 0x6F]);
    expect(detectEncoding(buffer)).toBe('utf-8');
  });

  it('detects UTF-16 LE BOM', () => {
    const buffer = new Uint8Array([0xFF, 0xFE, 0x48, 0x00]);
    expect(detectEncoding(buffer)).toBe('utf-16le');
  });

  it('detects Windows-1250 Czech characters', () => {
    // 0x9A = š, 0x9E = ž in Windows-1250
    const buffer = new Uint8Array([0x44, 0x61, 0x74, 0x75, 0x6D, 0x9A, 0x9E]);
    expect(detectEncoding(buffer)).toBe('windows-1250');
  });

  it('defaults to utf-8 for plain ASCII', () => {
    const buffer = new Uint8Array([0x48, 0x65, 0x6C, 0x6C, 0x6F]);
    expect(detectEncoding(buffer)).toBe('utf-8');
  });
});
