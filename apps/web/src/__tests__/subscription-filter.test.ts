import { describe, it, expect } from "vitest";
import {
  filterAndSortSubscriptions,
  SORT_OPTIONS,
  type SortKey,
} from "@/lib/subscription-filter";

type Sub = Parameters<typeof filterAndSortSubscriptions>[0][number];

function sub(partial: Partial<Sub>): Sub {
  return {
    id: "x",
    name: "Netflix",
    amount: "10.00",
    currency: "EUR",
    billingCycle: "monthly",
    status: "active",
    nextBillingDate: "2026-05-01",
    createdAt: new Date("2026-04-01"),
    category: null,
    ...partial,
  };
}

describe("filterAndSortSubscriptions", () => {
  const subs: Sub[] = [
    sub({ id: "1", name: "Netflix", amount: "13.49", nextBillingDate: "2026-05-20", createdAt: new Date("2026-01-01") }),
    sub({ id: "2", name: "Spotify", amount: "9.99", nextBillingDate: "2026-05-05", createdAt: new Date("2026-02-01") }),
    sub({ id: "3", name: "Disney Plus", amount: "8.99", nextBillingDate: "2026-05-15", createdAt: new Date("2026-03-01") }),
    sub({ id: "4", name: "GitHub", amount: "4.00", nextBillingDate: "2026-05-25", createdAt: new Date("2026-04-01"), category: { id: "c1", name: "Productivity", color: "#000" } }),
  ];

  it("returns all subs when query is empty", () => {
    const out = filterAndSortSubscriptions(subs, "", "name-asc");
    expect(out).toHaveLength(4);
  });

  it("filters by name case-insensitively", () => {
    const out = filterAndSortSubscriptions(subs, "netfl", "name-asc");
    expect(out).toHaveLength(1);
    expect(out[0].name).toBe("Netflix");
  });

  it("matches partial substrings", () => {
    const out = filterAndSortSubscriptions(subs, "plus", "name-asc");
    expect(out.map((s) => s.name)).toEqual(["Disney Plus"]);
  });

  it("trims whitespace from query", () => {
    const out = filterAndSortSubscriptions(subs, "   spotify  ", "name-asc");
    expect(out).toHaveLength(1);
  });

  it("matches by category name too", () => {
    const out = filterAndSortSubscriptions(subs, "productivity", "name-asc");
    expect(out.map((s) => s.name)).toEqual(["GitHub"]);
  });

  it("sorts by name A-Z", () => {
    const out = filterAndSortSubscriptions(subs, "", "name-asc");
    expect(out.map((s) => s.name)).toEqual(["Disney Plus", "GitHub", "Netflix", "Spotify"]);
  });

  it("sorts by amount (highest first)", () => {
    const out = filterAndSortSubscriptions(subs, "", "amount-desc");
    expect(out.map((s) => s.name)).toEqual(["Netflix", "Spotify", "Disney Plus", "GitHub"]);
  });

  it("sorts by amount (lowest first)", () => {
    const out = filterAndSortSubscriptions(subs, "", "amount-asc");
    expect(out.map((s) => s.name)).toEqual(["GitHub", "Disney Plus", "Spotify", "Netflix"]);
  });

  it("sorts by next billing date (soonest first)", () => {
    const out = filterAndSortSubscriptions(subs, "", "next-asc");
    expect(out.map((s) => s.name)).toEqual(["Spotify", "Disney Plus", "Netflix", "GitHub"]);
  });

  it("sorts by creation date (newest first)", () => {
    const out = filterAndSortSubscriptions(subs, "", "created-desc");
    expect(out.map((s) => s.name)).toEqual(["GitHub", "Disney Plus", "Spotify", "Netflix"]);
  });

  it("does not mutate the input array", () => {
    const original = subs.map((s) => s.id);
    filterAndSortSubscriptions(subs, "", "amount-desc");
    expect(subs.map((s) => s.id)).toEqual(original);
  });

  it("exposes a list of sort options for the UI", () => {
    expect(SORT_OPTIONS.length).toBeGreaterThan(3);
    expect(SORT_OPTIONS.every((o) => typeof o.value === "string" && typeof o.label === "string")).toBe(true);
    // All advertised values must be accepted by the sorter
    for (const opt of SORT_OPTIONS) {
      const typed = opt.value as SortKey;
      expect(() => filterAndSortSubscriptions(subs, "", typed)).not.toThrow();
    }
  });
});
