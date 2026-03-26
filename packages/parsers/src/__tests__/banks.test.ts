import { describe, it, expect } from 'vitest';
import { fioParser } from '../banks/fio';
import { revolutParser } from '../banks/revolut';
import { wiseParser } from '../banks/wise';
import { genericParser } from '../banks/generic';
import { detectBank } from '../detect';

// ============================================================
// Fio Banka Parser
// ============================================================
describe('fioParser', () => {
  const fioHeaders = ['ID operace', 'Datum', 'Objem', 'Měna', 'Protiúčet', 'Název protiúčtu', 'Kód banky', 'BIC', 'ID pokynu', 'Komentář', 'Typ', 'Upřesnění', 'Zpráva pro příjemce'];

  it('detects Fio bank format with high confidence', () => {
    const confidence = fioParser.detect(fioHeaders, []);
    expect(confidence).toBeGreaterThanOrEqual(80);
  });

  it('does not detect non-Fio format', () => {
    const confidence = fioParser.detect(['Date', 'Amount', 'Description'], []);
    expect(confidence).toBeLessThan(50);
  });

  it('parses Fio CSV rows correctly', () => {
    const rows = [
      ['12345', '15.03.2026', '-299,00', 'CZK', '123456789/0800', 'Netflix', '0800', '', '99999', '', 'Platba kartou', '', 'NETFLIX.COM'],
      ['12346', '15.03.2026', '25000,00', 'CZK', '987654321/0100', 'Zamestnavatel', '0100', '', '99998', '', 'Bezhotovostní příjem', '', 'Mzda'],
    ];

    const result = fioParser.parse(fioHeaders, rows);

    expect(result).toHaveLength(2);

    // First: debit (Netflix)
    expect(result[0].amount).toBe(299);
    expect(result[0].type).toBe('debit');
    expect(result[0].date.getDate()).toBe(15);
    expect(result[0].date.getMonth()).toBe(2); // March
    expect(result[0].currency).toBe('CZK');
    expect(result[0].counterparty).toBe('Netflix');

    // Second: credit (salary)
    expect(result[1].amount).toBe(25000);
    expect(result[1].type).toBe('credit');
  });

  it('handles empty rows', () => {
    const result = fioParser.parse(fioHeaders, []);
    expect(result).toHaveLength(0);
  });
});

// ============================================================
// Revolut Parser
// ============================================================
describe('revolutParser', () => {
  const revHeaders = ['Type', 'Product', 'Started Date', 'Completed Date', 'Description', 'Amount', 'Fee', 'Currency', 'State', 'Balance'];

  it('detects Revolut format with high confidence', () => {
    const confidence = revolutParser.detect(revHeaders, []);
    expect(confidence).toBeGreaterThanOrEqual(80);
  });

  it('does not detect non-Revolut format', () => {
    const confidence = revolutParser.detect(['Datum', 'Objem', 'Měna'], []);
    expect(confidence).toBeLessThan(50);
  });

  it('parses Revolut CSV rows correctly', () => {
    const rows = [
      ['CARD_PAYMENT', 'Current', '2026-03-15 10:30:00', '2026-03-15 10:30:00', 'Spotify', '-10.99', '0.00', 'EUR', 'COMPLETED', '500.00'],
      ['TOPUP', 'Current', '2026-03-01 08:00:00', '2026-03-01 08:00:00', 'Top-Up by *1234', '500.00', '0.00', 'EUR', 'COMPLETED', '510.99'],
    ];

    const result = revolutParser.parse(revHeaders, rows);

    expect(result).toHaveLength(2);
    expect(result[0].amount).toBe(10.99);
    expect(result[0].type).toBe('debit');
    expect(result[0].description).toBe('Spotify');
    expect(result[0].currency).toBe('EUR');
    expect(result[1].type).toBe('credit');
  });
});

// ============================================================
// Wise Parser
// ============================================================
describe('wiseParser', () => {
  const wiseHeaders = ['TransferWise ID', 'Date', 'Amount', 'Currency', 'Description', 'Payment Reference', 'Running Balance', 'Exchange From', 'Exchange To'];

  it('detects Wise format with high confidence', () => {
    const confidence = wiseParser.detect(wiseHeaders, []);
    expect(confidence).toBeGreaterThanOrEqual(80);
  });

  it('parses Wise CSV rows correctly', () => {
    const rows = [
      ['TW-123456', '2026-03-15', '-15.99', 'USD', 'Netflix subscription', 'REF123', '984.01', '', ''],
      ['TW-123457', '2026-03-01', '2000.00', 'USD', 'Payment from client', 'REF124', '1000.00', '', ''],
    ];

    const result = wiseParser.parse(wiseHeaders, rows);

    expect(result).toHaveLength(2);
    expect(result[0].amount).toBe(15.99);
    expect(result[0].type).toBe('debit');
    expect(result[0].currency).toBe('USD');
    expect(result[1].type).toBe('credit');
  });
});

// ============================================================
// Generic Parser (fallback)
// ============================================================
describe('genericParser', () => {
  it('always matches with low confidence', () => {
    const confidence = genericParser.detect(['anything', 'at all'], []);
    expect(confidence).toBeGreaterThan(0);
    expect(confidence).toBeLessThanOrEqual(20);
  });

  it('parses CSV with common column names', () => {
    const headers = ['Date', 'Description', 'Amount'];
    const rows = [
      ['2026-03-15', 'Netflix', '-15.99'],
      ['2026-03-10', 'Salary', '3000.00'],
    ];

    const result = genericParser.parse(headers, rows);

    expect(result).toHaveLength(2);
    expect(result[0].description).toBe('Netflix');
    expect(result[0].amount).toBe(15.99);
  });

  it('handles unknown column names gracefully', () => {
    const headers = ['Col1', 'Col2', 'Col3'];
    const rows = [['2026-03-15', 'something', '100.00']];

    // Should not crash, even if parsing is imperfect
    expect(() => genericParser.parse(headers, rows)).not.toThrow();
  });
});

// ============================================================
// Bank Auto-Detection
// ============================================================
describe('detectBank', () => {
  it('detects Fio from headers', () => {
    const headers = ['ID operace', 'Datum', 'Objem', 'Měna', 'Protiúčet', 'Název protiúčtu'];
    const result = detectBank(headers, []);
    expect(result.id).toBe('fio');
  });

  it('detects Revolut from headers', () => {
    const headers = ['Type', 'Product', 'Started Date', 'Completed Date', 'Description', 'Amount', 'Fee', 'Currency', 'State', 'Balance'];
    const result = detectBank(headers, []);
    expect(result.id).toBe('revolut');
  });

  it('detects Wise from headers', () => {
    const headers = ['TransferWise ID', 'Date', 'Amount', 'Currency', 'Description'];
    const result = detectBank(headers, []);
    expect(result.id).toBe('wise');
  });

  it('falls back to generic for unknown format', () => {
    const headers = ['Foo', 'Bar', 'Baz'];
    const result = detectBank(headers, []);
    expect(result.id).toBe('generic');
  });
});
