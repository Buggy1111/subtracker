import type { ParsedTransaction, DetectedSubscription } from './types';
import { cleanMerchantName } from './utils';

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function standardDeviation(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = mean(values);
  const squareDiffs = values.map(v => (v - avg) ** 2);
  return Math.sqrt(mean(squareDiffs));
}

function roundToTwo(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Normalize a merchant name for grouping purposes.
 * More aggressive than cleanMerchantName — lowercased and stripped further.
 */
function normalizeMerchant(raw: string): string {
  return cleanMerchantName(raw).toLowerCase().trim();
}

/**
 * Group transactions by normalized merchant name.
 */
function groupByMerchant(transactions: ParsedTransaction[]): Map<string, ParsedTransaction[]> {
  const groups = new Map<string, ParsedTransaction[]>();

  for (const tx of transactions) {
    const key = normalizeMerchant(tx.counterparty || tx.description);
    if (!key) continue;

    const existing = groups.get(key);
    if (existing) {
      existing.push(tx);
    } else {
      groups.set(key, [tx]);
    }
  }

  return groups;
}

/**
 * Calculate intervals (in days) between sorted transactions.
 */
function calculateIntervals(transactions: ParsedTransaction[]): number[] {
  const sorted = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime());
  const intervals: number[] = [];

  for (let i = 1; i < sorted.length; i++) {
    const diffMs = sorted[i].date.getTime() - sorted[i - 1].date.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    intervals.push(diffDays);
  }

  return intervals;
}

/**
 * Detect recurring subscriptions from a list of bank transactions.
 */
export function detectSubscriptions(
  transactions: ParsedTransaction[],
  _existingSubscriptions?: { id: string; name: string }[],
): DetectedSubscription[] {
  if (transactions.length === 0) return [];

  // Only consider outgoing payments — salary, refunds, and top-ups look
  // recurring but aren't subscriptions.
  const debits = transactions.filter((t) => t.type === "debit");

  const grouped = groupByMerchant(debits);
  const detected: DetectedSubscription[] = [];

  for (const [, txns] of grouped) {
    // Require 3+ occurrences so one-off pairs (e.g. two trips to the same
    // shop a month apart) don't get flagged as monthly subscriptions.
    if (txns.length < 3) continue;

    const intervals = calculateIntervals(txns);
    if (intervals.length === 0) continue;

    const avgInterval = mean(intervals);
    const stdDev = standardDeviation(intervals);

    let cycle: DetectedSubscription['estimatedCycle'] | null = null;
    let confidence = 0;

    if (avgInterval >= 5 && avgInterval <= 9 && stdDev < 2) {
      cycle = 'weekly';
      confidence = 85 - stdDev * 10;
    } else if (avgInterval >= 25 && avgInterval <= 35 && stdDev < 5) {
      cycle = 'monthly';
      confidence = 90 - stdDev * 5;
    } else if (avgInterval >= 85 && avgInterval <= 100 && stdDev < 10) {
      cycle = 'quarterly';
      confidence = 80 - stdDev * 3;
    } else if (avgInterval >= 350 && avgInterval <= 380 && stdDev < 15) {
      cycle = 'yearly';
      confidence = 85 - stdDev * 2;
    }

    if (!cycle || confidence < 50) continue;

    // Check amount consistency
    const amounts = txns.map(t => t.amount);
    const avgAmount = mean(amounts);
    const amountStdDev = standardDeviation(amounts);

    if (avgAmount > 0 && amountStdDev / avgAmount > 0.10) {
      confidence -= 20;
    }

    if (confidence < 50) continue;

    // Use the original description (not normalized) for the display name
    const displayName = cleanMerchantName(txns[0].counterparty || txns[0].description);

    detected.push({
      name: displayName,
      amount: roundToTwo(avgAmount),
      currency: txns[0].currency || 'USD',
      estimatedCycle: cycle,
      occurrences: txns,
      confidence: Math.round(Math.max(0, Math.min(100, confidence))),
    });
  }

  return detected.sort((a, b) => b.confidence - a.confidence);
}
