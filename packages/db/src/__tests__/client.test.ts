import { describe, it, expect, vi, beforeEach } from 'vitest';

// ============================================================
// DB Client module tests
// ============================================================

describe('db client module', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('exports createDb function', async () => {
    const mod = await import('../client');
    expect(mod.createDb).toBeDefined();
    expect(typeof mod.createDb).toBe('function');
  });

  it('exports schema object', async () => {
    const mod = await import('../client');
    expect(mod.schema).toBeDefined();
    expect(mod.schema.users).toBeDefined();
    expect(mod.schema.subscriptions).toBeDefined();
    expect(mod.schema.categories).toBeDefined();
    expect(mod.schema.payments).toBeDefined();
    expect(mod.schema.reminders).toBeDefined();
    expect(mod.schema.imports).toBeDefined();
    expect(mod.schema.pushSubscriptions).toBeDefined();
  });

  it('createDb requires DATABASE_URL', async () => {
    const { createDb } = await import('../client');
    expect(() => createDb('')).toThrow('DATABASE_URL');
  });

  it('createDb returns drizzle instance when given valid URL', async () => {
    const mod = await import('../client');
    const db = mod.createDb('postgresql://test:test@localhost:5432/test');
    expect(db).toBeDefined();
    expect(typeof db.select).toBe('function');
    expect(typeof db.insert).toBe('function');
    expect(typeof db.update).toBe('function');
    expect(typeof db.delete).toBe('function');
  });
});
