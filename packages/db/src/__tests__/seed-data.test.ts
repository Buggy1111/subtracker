import { describe, it, expect } from 'vitest';
import { DEFAULT_CATEGORIES, POPULAR_SERVICES } from '../seed-data';

// ============================================================
// Seed data integrity tests
// ============================================================

describe('DEFAULT_CATEGORIES', () => {
  it('has 12 categories', () => {
    expect(DEFAULT_CATEGORIES).toHaveLength(12);
  });

  it('every category has required fields', () => {
    for (const cat of DEFAULT_CATEGORIES) {
      expect(cat.name).toBeTruthy();
      expect(cat.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(cat.icon).toBeTruthy();
      expect(typeof cat.sortOrder).toBe('number');
    }
  });

  it('has unique names', () => {
    const names = DEFAULT_CATEGORIES.map((c) => c.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('has sequential sort order', () => {
    DEFAULT_CATEGORIES.forEach((cat, i) => {
      expect(cat.sortOrder).toBe(i);
    });
  });

  it('includes "Other" as last category', () => {
    expect(DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1].name).toBe('Other');
  });
});

describe('POPULAR_SERVICES', () => {
  it('has at least 30 services', () => {
    expect(POPULAR_SERVICES.length).toBeGreaterThanOrEqual(30);
  });

  it('every service has required fields', () => {
    for (const svc of POPULAR_SERVICES) {
      expect(svc.name).toBeTruthy();
      expect(svc.category).toBeTruthy();
      expect(svc.defaultPrice).toBeGreaterThan(0);
      expect(svc.cycle).toBeTruthy();
      expect(svc.logo).toBeTruthy();
      expect(svc.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('every service references an existing category', () => {
    const categoryNames = DEFAULT_CATEGORIES.map((c) => c.name);
    for (const svc of POPULAR_SERVICES) {
      expect(categoryNames).toContain(svc.category);
    }
  });

  it('has unique service names', () => {
    const names = POPULAR_SERVICES.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
