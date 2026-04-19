type Cycle = "monthly" | "yearly" | "weekly" | "quarterly";

function advance(d: Date, cycle: Cycle): Date {
  // Work in UTC throughout so the projected date doesn't drift across
  // timezones (e.g. parsing "2026-02-15" as UTC midnight then advancing
  // with local getters can land on Feb 14 in negative-offset zones).
  const next = new Date(d);
  switch (cycle) {
    case "weekly":
      next.setUTCDate(next.getUTCDate() + 7);
      break;
    case "monthly":
      next.setUTCMonth(next.getUTCMonth() + 1);
      break;
    case "quarterly":
      next.setUTCMonth(next.getUTCMonth() + 3);
      break;
    case "yearly":
      next.setUTCFullYear(next.getUTCFullYear() + 1);
      break;
  }
  return next;
}

function toIsoDate(d: Date): string {
  // Use UTC-stable formatting to avoid timezone flakiness. The stored value
  // is a plain YYYY-MM-DD which Drizzle's date column expects.
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Given the last observed transaction date for a recurring payment, project
 * the next billing date by advancing one cycle at a time until the result is
 * at or after `today`. This keeps renewal dates accurate when a CSV covers
 * historical data stretching back several months.
 */
export function projectNextBilling(
  lastObservedIso: string,
  cycle: Cycle,
  today: Date = new Date(),
): string {
  const last = new Date(lastObservedIso);
  if (isNaN(last.getTime())) {
    return toIsoDate(advance(today, cycle));
  }

  let next = advance(last, cycle);
  // Step forward cycle by cycle until we're in the future. Capped at ~1000
  // iterations as a safety rail — should never actually hit that.
  let guard = 0;
  while (next.getTime() < today.getTime() && guard < 1000) {
    next = advance(next, cycle);
    guard++;
  }
  return toIsoDate(next);
}
