import { describe, it, expect } from "vitest";
import { parseImportPayload } from "@/lib/json-import";

describe("parseImportPayload — SubTracker native format", () => {
  it("parses a v1 SubTracker export", () => {
    const input = {
      version: 1,
      source: "subtracker",
      exportedAt: "2026-04-19T00:00:00Z",
      userCategories: [{ name: "Custom", color: "#abc" }],
      subscriptions: [
        {
          name: "Netflix",
          amount: "13.49",
          currency: "EUR",
          billingCycle: "monthly",
          nextBillingDate: "2026-05-19",
          category: "Streaming",
          status: "active",
          notes: null,
        },
      ],
    };

    const result = parseImportPayload(input);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.source).toBe("subtracker");
    expect(result.subscriptions).toHaveLength(1);
    expect(result.subscriptions[0]).toMatchObject({
      name: "Netflix",
      amount: 13.49,
      currency: "EUR",
      billingCycle: "monthly",
      nextBillingDate: "2026-05-19",
      categoryName: "Streaming",
    });
    expect(result.categories).toEqual([{ name: "Custom", color: "#abc" }]);
  });

  it("accepts amount as number, string, or missing decimal", () => {
    const input = {
      version: 1,
      subscriptions: [
        { name: "A", amount: 10, currency: "USD", billingCycle: "monthly", nextBillingDate: "2026-05-01" },
        { name: "B", amount: "7.5", currency: "USD", billingCycle: "monthly", nextBillingDate: "2026-05-01" },
      ],
    };

    const result = parseImportPayload(input);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.subscriptions[0].amount).toBe(10);
    expect(result.subscriptions[1].amount).toBe(7.5);
  });
});

describe("parseImportPayload — Wallos format", () => {
  it("detects and converts a Wallos export with numeric cycle", () => {
    const input = {
      version: "2.x",
      subscriptions: [
        {
          name: "Spotify",
          price: 9.99,
          currency_id: 1,
          cycle: 3, // monthly in Wallos
          frequency: 1,
          next_payment: "2026-05-01",
          url: "https://spotify.com",
          notes: "Family plan",
          category_id: 2,
        },
        {
          name: "1Password",
          price: "2.99",
          cycle: 6, // yearly in Wallos
          next_payment: "2026-12-01",
        },
      ],
      categories: [{ id: 2, name: "Music" }],
    };

    const result = parseImportPayload(input);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.source).toBe("wallos");
    expect(result.subscriptions[0]).toMatchObject({
      name: "Spotify",
      amount: 9.99,
      billingCycle: "monthly",
      nextBillingDate: "2026-05-01",
      url: "https://spotify.com",
      notes: "Family plan",
      categoryName: "Music",
    });
    expect(result.subscriptions[1].billingCycle).toBe("yearly");
  });

  it("maps Wallos weekly (cycle=2) and quarterly (cycle=4)", () => {
    const input = {
      subscriptions: [
        { name: "W", price: 5, cycle: 2, next_payment: "2026-05-01" },
        { name: "Q", price: 30, cycle: 4, next_payment: "2026-05-01" },
        { name: "Semi", price: 60, cycle: 5, next_payment: "2026-05-01" },
      ],
    };

    const result = parseImportPayload(input);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.subscriptions[0].billingCycle).toBe("weekly");
    expect(result.subscriptions[1].billingCycle).toBe("quarterly");
    // Semi-annual collapses to yearly (our schema has no semi-annual)
    expect(result.subscriptions[2].billingCycle).toBe("yearly");
  });
});

describe("parseImportPayload — validation / edge cases", () => {
  it("rejects non-JSON-object input", () => {
    expect(parseImportPayload(null).success).toBe(false);
    expect(parseImportPayload("garbage").success).toBe(false);
    expect(parseImportPayload(42).success).toBe(false);
  });

  it("rejects empty subscription arrays", () => {
    const result = parseImportPayload({ subscriptions: [] });
    expect(result.success).toBe(false);
  });

  it("rejects file with no recognizable subscription list", () => {
    const result = parseImportPayload({ foo: "bar" });
    expect(result.success).toBe(false);
  });

  it("skips subscriptions missing a name", () => {
    const input = {
      subscriptions: [
        { amount: 5, billingCycle: "monthly", nextBillingDate: "2026-05-01" },
        { name: "OK", amount: 5, billingCycle: "monthly", nextBillingDate: "2026-05-01" },
      ],
    };
    const result = parseImportPayload(input);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.subscriptions).toHaveLength(1);
    expect(result.subscriptions[0].name).toBe("OK");
  });

  it("defaults missing currency to USD and missing cycle to monthly", () => {
    const input = {
      subscriptions: [{ name: "Minimal", amount: 5, nextBillingDate: "2026-05-01" }],
    };
    const result = parseImportPayload(input);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.subscriptions[0].currency).toBe("USD");
    expect(result.subscriptions[0].billingCycle).toBe("monthly");
  });

  it("uses today as nextBillingDate when missing/invalid", () => {
    const input = {
      subscriptions: [{ name: "NoDate", amount: 5, billingCycle: "monthly" }],
    };
    const result = parseImportPayload(input);
    expect(result.success).toBe(true);
    if (!result.success) return;
    // Just verify it's a parseable ISO date
    expect(new Date(result.subscriptions[0].nextBillingDate).toString()).not.toBe("Invalid Date");
  });

  it("caps very large files so a malicious JSON can't DoS us", () => {
    const subs = Array.from({ length: 5000 }, (_, i) => ({
      name: `Sub ${i}`,
      amount: 1,
      billingCycle: "monthly",
      nextBillingDate: "2026-05-01",
    }));
    const result = parseImportPayload({ subscriptions: subs });
    expect(result.success).toBe(false);
  });

  it("trims overly long fields to schema limits", () => {
    const input = {
      subscriptions: [
        {
          name: "A".repeat(500),
          amount: 1,
          billingCycle: "monthly",
          nextBillingDate: "2026-05-01",
          notes: "N".repeat(10000),
        },
      ],
    };
    const result = parseImportPayload(input);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.subscriptions[0].name.length).toBeLessThanOrEqual(200);
    expect((result.subscriptions[0].notes ?? "").length).toBeLessThanOrEqual(2000);
  });
});
