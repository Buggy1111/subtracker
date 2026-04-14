import { describe, it, expect, vi, beforeEach } from 'vitest';

// ============================================================
// Subscription Server Actions tests
// ============================================================

// Mock Next.js server functions
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

// Mock auth
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(() => Promise.resolve({ user: { id: 'user-1', email: 'test@test.com' } })),
}));

// Mock DB
const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  returning: vi.fn(),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
};

vi.mock('@/lib/db', () => ({
  db: mockDb,
}));

vi.mock('@subtracker/db/schema', () => ({
  subscriptions: { id: 'id', userId: 'user_id', status: 'status', nextBillingDate: 'next_billing_date', name: 'name', createdAt: 'created_at' },
  categories: { id: 'id', userId: 'user_id' },
}));

// Mock drizzle operators
vi.mock('drizzle-orm', () => ({
  eq: vi.fn((...args: unknown[]) => ({ type: 'eq', args })),
  and: vi.fn((...args: unknown[]) => ({ type: 'and', args })),
  desc: vi.fn((col: unknown) => ({ type: 'desc', col })),
  asc: vi.fn((col: unknown) => ({ type: 'asc', col })),
}));

describe('subscription actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.returning.mockResolvedValue([{ id: 'sub-1', name: 'Netflix' }]);
  });

  it('getSubscriptions returns subscriptions for authenticated user', async () => {
    mockDb.orderBy.mockResolvedValueOnce([
      { id: 'sub-1', name: 'Netflix', amount: '15.99', status: 'active' },
    ]);

    const { getSubscriptions } = await import('../app/actions/subscriptions');
    const result = await getSubscriptions();

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.data![0].name).toBe('Netflix');
  });

  it('createSubscription validates input and inserts', async () => {
    const { createSubscription } = await import('../app/actions/subscriptions');
    const result = await createSubscription({
      name: 'Netflix',
      amount: 15.99,
      billingCycle: 'monthly',
      nextBillingDate: '2026-05-01',
    });

    expect(result.success).toBe(true);
    expect(mockDb.insert).toHaveBeenCalled();
  });

  it('createSubscription rejects invalid input', async () => {
    const { createSubscription } = await import('../app/actions/subscriptions');
    const result = await createSubscription({
      name: '',
      amount: -5,
      billingCycle: 'invalid' as 'monthly',
      nextBillingDate: 'bad-date',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('updateSubscription updates the correct subscription', async () => {
    mockDb.returning.mockResolvedValueOnce([{ id: 'sub-1', name: 'Spotify' }]);

    const { updateSubscription } = await import('../app/actions/subscriptions');
    const result = await updateSubscription('sub-1', { name: 'Spotify' });

    expect(result.success).toBe(true);
    expect(mockDb.update).toHaveBeenCalled();
  });

  it('deleteSubscription deletes the correct subscription', async () => {
    mockDb.returning.mockResolvedValueOnce([{ id: 'sub-1' }]);

    const { deleteSubscription } = await import('../app/actions/subscriptions');
    const result = await deleteSubscription('sub-1');

    expect(result.success).toBe(true);
    expect(mockDb.delete).toHaveBeenCalled();
  });

  it('returns error when not authenticated', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth).mockResolvedValueOnce(null);

    vi.resetModules();
    // Re-mock with null auth
    vi.doMock('@/lib/auth', () => ({
      auth: vi.fn(() => Promise.resolve(null)),
    }));

    const { getSubscriptions } = await import('../app/actions/subscriptions');
    const result = await getSubscriptions();

    expect(result.success).toBe(false);
    expect(result.error).toContain('auth');
  });
});
