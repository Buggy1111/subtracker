export type BudgetState = "under" | "near" | "over";

export interface BudgetStatus {
  budget: number;
  spend: number;
  /** Raw percentage (can exceed 100 when over budget). */
  percent: number;
  /** Percentage clamped to [0, 100] for progress-bar widths. */
  displayPercent: number;
  /** Amount left in the budget. Negative when over. */
  remaining: number;
  state: BudgetState;
}

const NEAR_THRESHOLD = 80;

export function budgetStatus(
  spend: number,
  budget: number | null | undefined,
): BudgetStatus | null {
  if (budget == null) return null;
  if (!isFinite(budget) || budget <= 0) return null;

  const safeSpend = Math.max(0, spend);
  const pctRaw = (safeSpend / budget) * 100;
  const percent = Math.round(pctRaw * 10) / 10;
  const displayPercent = Math.min(100, Math.max(0, percent));
  const remaining = Math.round((budget - safeSpend) * 100) / 100;

  let state: BudgetState = "under";
  if (percent > 100) state = "over";
  else if (percent >= NEAR_THRESHOLD) state = "near";

  return { budget, spend: safeSpend, percent, displayPercent, remaining, state };
}
