import { describe, it, expect, vi, beforeEach } from 'vitest';

// ============================================================
// Auth configuration tests
// ============================================================

// Mock next-auth to avoid actual provider initialization
vi.mock('next-auth', () => ({
  default: vi.fn((config: Record<string, unknown>) => {
    return {
      handlers: {},
      auth: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      _config: config,
    };
  }),
}));

// Mock the drizzle adapter
vi.mock('@auth/drizzle-adapter', () => ({
  DrizzleAdapter: vi.fn((db: unknown) => ({ db, type: 'drizzle' })),
}));

// Mock the DB client
vi.mock('@subtracker/db/client', () => ({
  createDb: vi.fn(() => ({ select: vi.fn(), insert: vi.fn() })),
  schema: { users: {}, accounts: {}, sessions: {}, verificationTokens: {} },
}));

describe('auth configuration', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('exports auth, signIn, signOut, handlers', async () => {
    vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test');
    const mod = await import('../../src/lib/auth');
    expect(mod.auth).toBeDefined();
    expect(mod.signIn).toBeDefined();
    expect(mod.signOut).toBeDefined();
    expect(mod.handlers).toBeDefined();
  });

  it('uses DrizzleAdapter when DATABASE_URL is a real connection', async () => {
    vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test');

    vi.resetModules();
    const { DrizzleAdapter } = await import('@auth/drizzle-adapter');
    await import('../../src/lib/auth');

    expect(DrizzleAdapter).toHaveBeenCalled();
  });

  it('uses JWT strategy when DATABASE_URL is missing or dummy', async () => {
    vi.stubEnv('DATABASE_URL', 'postgresql://dummy:dummy@dummy:5432/dummy');

    vi.resetModules();
    const NextAuth = (await import('next-auth')).default;
    await import('../../src/lib/auth');

    const lastCall = vi.mocked(NextAuth).mock.lastCall;
    expect(lastCall).toBeDefined();
    const config = lastCall![0] as unknown as { session?: { strategy: string } };
    expect(config.session?.strategy).toBe('jwt');
  });
});
