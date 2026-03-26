import { describe, it, expect } from 'vitest';
import { detectSubscriptions } from '../subscription-detector';
import type { ParsedTransaction } from '../types';

function tx(overrides: Partial<ParsedTransaction> & { date: Date; amount: number; description: string }): ParsedTransaction {
  return {
    type: 'debit',
    counterparty: overrides.description,
    rawRow: {},
    ...overrides,
  };
}

function monthlyDates(merchant: string, amount: number, count: number, startYear = 2025, startMonth = 1): ParsedTransaction[] {
  return Array.from({ length: count }, (_, i) =>
    tx({
      date: new Date(startYear, startMonth + i, 15),
      amount,
      description: merchant,
    })
  );
}

// ============================================================
// detectSubscriptions
// ============================================================
describe('detectSubscriptions', () => {
  it('detects a monthly subscription with consistent amounts', () => {
    const transactions = monthlyDates('NETFLIX', 15.99, 6);
    const result = detectSubscriptions(transactions);

    expect(result).toHaveLength(1);
    expect(result[0].name).toContain('NETFLIX');
    expect(result[0].estimatedCycle).toBe('monthly');
    expect(result[0].amount).toBe(15.99);
    expect(result[0].confidence).toBeGreaterThanOrEqual(50);
  });

  it('detects multiple subscriptions', () => {
    const transactions = [
      ...monthlyDates('NETFLIX', 15.99, 4),
      ...monthlyDates('SPOTIFY', 10.99, 4),
    ];
    const result = detectSubscriptions(transactions);

    expect(result).toHaveLength(2);
    const names = result.map(s => s.name);
    expect(names.some(n => n.includes('NETFLIX'))).toBe(true);
    expect(names.some(n => n.includes('SPOTIFY'))).toBe(true);
  });

  it('detects yearly subscriptions', () => {
    const transactions = [
      tx({ date: new Date(2024, 0, 15), amount: 99.99, description: 'AMAZON PRIME YEARLY' }),
      tx({ date: new Date(2025, 0, 14), amount: 99.99, description: 'AMAZON PRIME YEARLY' }),
      tx({ date: new Date(2026, 0, 15), amount: 99.99, description: 'AMAZON PRIME YEARLY' }),
    ];
    const result = detectSubscriptions(transactions);

    expect(result).toHaveLength(1);
    expect(result[0].estimatedCycle).toBe('yearly');
  });

  it('ignores one-off transactions (single occurrence)', () => {
    const transactions = [
      tx({ date: new Date(2025, 3, 10), amount: 299.99, description: 'BEST BUY ELECTRONICS' }),
    ];
    const result = detectSubscriptions(transactions);

    expect(result).toHaveLength(0);
  });

  it('ignores irregular transactions (no pattern)', () => {
    const transactions = [
      tx({ date: new Date(2025, 0, 5), amount: 42.50, description: 'RANDOM STORE' }),
      tx({ date: new Date(2025, 2, 20), amount: 42.50, description: 'RANDOM STORE' }),
      tx({ date: new Date(2025, 8, 1), amount: 42.50, description: 'RANDOM STORE' }),
    ];
    const result = detectSubscriptions(transactions);

    // Intervals are 74 and 165 days — too irregular for any cycle
    expect(result).toHaveLength(0);
  });

  it('lowers confidence when amounts vary', () => {
    const transactions = [
      tx({ date: new Date(2025, 0, 15), amount: 15.99, description: 'NETFLIX' }),
      tx({ date: new Date(2025, 1, 15), amount: 15.99, description: 'NETFLIX' }),
      tx({ date: new Date(2025, 2, 15), amount: 19.99, description: 'NETFLIX' }), // price change
      tx({ date: new Date(2025, 3, 15), amount: 19.99, description: 'NETFLIX' }),
    ];
    const result = detectSubscriptions(transactions);

    expect(result).toHaveLength(1);
    // Still detected but with lower confidence due to amount variance
    const consistentTxns = monthlyDates('SPOTIFY', 10.99, 4);
    const consistentResult = detectSubscriptions(consistentTxns);
    expect(result[0].confidence).toBeLessThanOrEqual(consistentResult[0].confidence);
  });

  it('returns results sorted by confidence (highest first)', () => {
    const transactions = [
      // Very consistent monthly
      ...monthlyDates('NETFLIX', 15.99, 6),
      // Less consistent (only 2 occurrences)
      tx({ date: new Date(2025, 1, 1), amount: 5.99, description: 'SOME APP' }),
      tx({ date: new Date(2025, 2, 1), amount: 5.99, description: 'SOME APP' }),
    ];
    const result = detectSubscriptions(transactions);

    if (result.length > 1) {
      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].confidence).toBeGreaterThanOrEqual(result[i].confidence);
      }
    }
  });

  it('groups by merchant name (normalized)', () => {
    const transactions = [
      tx({ date: new Date(2025, 0, 15), amount: 15.99, description: 'PAYMENT NETFLIX' }),
      tx({ date: new Date(2025, 1, 15), amount: 15.99, description: 'CARD PURCHASE NETFLIX' }),
      tx({ date: new Date(2025, 2, 15), amount: 15.99, description: 'NETFLIX 12345' }),
      tx({ date: new Date(2025, 3, 15), amount: 15.99, description: 'NETFLIX' }),
    ];
    const result = detectSubscriptions(transactions);

    // Should detect as one subscription, not four different merchants
    expect(result).toHaveLength(1);
  });

  it('handles empty input', () => {
    expect(detectSubscriptions([])).toHaveLength(0);
  });

  it('detects weekly subscriptions', () => {
    const transactions = Array.from({ length: 8 }, (_, i) =>
      tx({
        date: new Date(2025, 0, 1 + i * 7),
        amount: 4.99,
        description: 'WEEKLY SERVICE',
      })
    );
    const result = detectSubscriptions(transactions);

    expect(result).toHaveLength(1);
    expect(result[0].estimatedCycle).toBe('weekly');
  });

  it('uses average amount for varying prices', () => {
    const transactions = [
      tx({ date: new Date(2025, 0, 15), amount: 10.00, description: 'SERVICE' }),
      tx({ date: new Date(2025, 1, 15), amount: 10.00, description: 'SERVICE' }),
      tx({ date: new Date(2025, 2, 15), amount: 12.00, description: 'SERVICE' }),
      tx({ date: new Date(2025, 3, 15), amount: 12.00, description: 'SERVICE' }),
    ];
    const result = detectSubscriptions(transactions);

    expect(result).toHaveLength(1);
    expect(result[0].amount).toBe(11.00);
  });
});
