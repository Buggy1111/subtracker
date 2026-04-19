import { describe, it, expect } from "vitest";
import { projectNextBilling } from "@/lib/billing-projection";

function iso(d: string) {
  return d;
}

describe("projectNextBilling", () => {
  const today = new Date("2026-04-19T12:00:00Z");

  it("projects monthly cycle +1 month when last was last month", () => {
    expect(projectNextBilling(iso("2026-03-20"), "monthly", today)).toBe("2026-04-20");
  });

  it("advances past today when last transaction is old", () => {
    // Last seen a year ago, monthly cycle → next must be >= today
    const next = projectNextBilling(iso("2025-04-10"), "monthly", today);
    expect(new Date(next).getTime()).toBeGreaterThanOrEqual(today.getTime());
    // And it must be within one month of today (not way in the future)
    const plus31 = new Date(today);
    plus31.setDate(plus31.getDate() + 31);
    expect(new Date(next).getTime()).toBeLessThan(plus31.getTime());
  });

  it("projects yearly cycle", () => {
    expect(projectNextBilling(iso("2025-12-01"), "yearly", today)).toBe("2026-12-01");
  });

  it("projects quarterly cycle", () => {
    expect(projectNextBilling(iso("2026-02-15"), "quarterly", today)).toBe("2026-05-15");
  });

  it("projects weekly cycle across the 'is it today yet?' boundary", () => {
    // Last seen April 15, weekly cycle, today is April 19.
    // +7 = April 22 (next week)
    expect(projectNextBilling(iso("2026-04-15"), "weekly", today)).toBe("2026-04-22");
  });

  it("handles the case where last tx is already in the future", () => {
    expect(projectNextBilling(iso("2026-05-01"), "monthly", today)).toBe("2026-06-01");
  });

  it("falls back to today+1 cycle when lastObserved is not a valid date", () => {
    const result = projectNextBilling(iso("not-a-date"), "monthly", today);
    expect(result).toBe("2026-05-19");
  });

  it("iterates multiple periods for weekly + old date", () => {
    // 6 weeks ago, weekly cycle → should land on the next upcoming Wednesday-ish
    const sixWeeksAgo = new Date(today);
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42);
    const next = projectNextBilling(sixWeeksAgo.toISOString().split("T")[0], "weekly", today);
    expect(new Date(next).getTime()).toBeGreaterThanOrEqual(today.getTime());
    const plus8 = new Date(today);
    plus8.setDate(plus8.getDate() + 8);
    expect(new Date(next).getTime()).toBeLessThan(plus8.getTime());
  });
});
