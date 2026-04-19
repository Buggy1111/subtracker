import { describe, it, expect } from "vitest";
import { budgetStatus } from "@/lib/budget";

describe("budgetStatus", () => {
  it("returns null when no budget is set", () => {
    expect(budgetStatus(50, null)).toBeNull();
    expect(budgetStatus(50, undefined)).toBeNull();
    expect(budgetStatus(50, 0)).toBeNull();
  });

  it("returns null for invalid/negative budgets", () => {
    expect(budgetStatus(50, -10)).toBeNull();
    expect(budgetStatus(50, NaN)).toBeNull();
  });

  it("marks state 'under' when well within budget", () => {
    const s = budgetStatus(30, 100);
    expect(s).not.toBeNull();
    expect(s!.state).toBe("under");
    expect(s!.percent).toBe(30);
    expect(s!.remaining).toBe(70);
  });

  it("marks state 'near' when approaching the limit (>= 80%)", () => {
    const s = budgetStatus(85, 100);
    expect(s!.state).toBe("near");
  });

  it("marks state 'over' when spend exceeds budget", () => {
    const s = budgetStatus(120, 100);
    expect(s!.state).toBe("over");
    expect(s!.percent).toBe(120);
    expect(s!.remaining).toBe(-20);
  });

  it("caps percent at 100 for display purposes via displayPercent", () => {
    const s = budgetStatus(150, 100);
    expect(s!.percent).toBe(150);
    expect(s!.displayPercent).toBe(100);
  });

  it("handles zero spend", () => {
    const s = budgetStatus(0, 100);
    expect(s!.state).toBe("under");
    expect(s!.percent).toBe(0);
    expect(s!.remaining).toBe(100);
  });

  it("rounds percent to 1 decimal place", () => {
    const s = budgetStatus(33.333, 100);
    expect(s!.percent).toBe(33.3);
  });
});
