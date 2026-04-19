export const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
  { value: "amount-desc", label: "Amount (high to low)" },
  { value: "amount-asc", label: "Amount (low to high)" },
  { value: "next-asc", label: "Next billing (soonest)" },
  { value: "next-desc", label: "Next billing (latest)" },
  { value: "created-desc", label: "Date added (newest)" },
  { value: "created-asc", label: "Date added (oldest)" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export interface FilterableSubscription {
  id: string;
  name: string;
  amount: string;
  currency: string;
  billingCycle: string;
  status: string;
  nextBillingDate: string;
  createdAt: Date | string;
  category?: { id: string; name: string; color: string } | null;
}

export function filterAndSortSubscriptions<T extends FilterableSubscription>(
  subs: T[],
  query: string,
  sort: SortKey,
): T[] {
  const q = query.trim().toLowerCase();

  const filtered = q
    ? subs.filter((s) => {
        if (s.name.toLowerCase().includes(q)) return true;
        if (s.category && s.category.name.toLowerCase().includes(q)) return true;
        return false;
      })
    : [...subs];

  switch (sort) {
    case "name-asc":
      return filtered.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return filtered.sort((a, b) => b.name.localeCompare(a.name));
    case "amount-asc":
      return filtered.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    case "amount-desc":
      return filtered.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    case "next-asc":
      return filtered.sort((a, b) => a.nextBillingDate.localeCompare(b.nextBillingDate));
    case "next-desc":
      return filtered.sort((a, b) => b.nextBillingDate.localeCompare(a.nextBillingDate));
    case "created-desc":
      return filtered.sort((a, b) => dateVal(b.createdAt) - dateVal(a.createdAt));
    case "created-asc":
      return filtered.sort((a, b) => dateVal(a.createdAt) - dateVal(b.createdAt));
  }
}

function dateVal(d: Date | string): number {
  return d instanceof Date ? d.getTime() : new Date(d).getTime();
}
