import { describe, it, expect } from 'vitest';
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
  createCategorySchema,
  updateProfileSchema,
  confirmImportSchema,
  billingCycleEnum,
  statusEnum,
} from '../validators';

// ============================================================
// Billing Cycle Enum
// ============================================================
describe('billingCycleEnum', () => {
  it('accepts valid billing cycles', () => {
    expect(billingCycleEnum.parse('monthly')).toBe('monthly');
    expect(billingCycleEnum.parse('yearly')).toBe('yearly');
    expect(billingCycleEnum.parse('weekly')).toBe('weekly');
    expect(billingCycleEnum.parse('quarterly')).toBe('quarterly');
  });

  it('rejects invalid billing cycles', () => {
    expect(() => billingCycleEnum.parse('daily')).toThrow();
    expect(() => billingCycleEnum.parse('')).toThrow();
    expect(() => billingCycleEnum.parse('MONTHLY')).toThrow();
  });
});

// ============================================================
// Status Enum
// ============================================================
describe('statusEnum', () => {
  it('accepts valid statuses', () => {
    expect(statusEnum.parse('active')).toBe('active');
    expect(statusEnum.parse('paused')).toBe('paused');
    expect(statusEnum.parse('cancelled')).toBe('cancelled');
    expect(statusEnum.parse('trial')).toBe('trial');
  });

  it('rejects invalid statuses', () => {
    expect(() => statusEnum.parse('deleted')).toThrow();
    expect(() => statusEnum.parse('')).toThrow();
  });
});

// ============================================================
// Create Subscription Schema
// ============================================================
describe('createSubscriptionSchema', () => {
  const validSubscription = {
    name: 'Netflix',
    amount: 15.99,
    billingCycle: 'monthly' as const,
    nextBillingDate: '2026-04-15',
  };

  it('accepts a minimal valid subscription', () => {
    const result = createSubscriptionSchema.parse(validSubscription);
    expect(result.name).toBe('Netflix');
    expect(result.amount).toBe(15.99);
    expect(result.billingCycle).toBe('monthly');
    expect(result.nextBillingDate).toBe('2026-04-15');
  });

  it('applies defaults correctly', () => {
    const result = createSubscriptionSchema.parse(validSubscription);
    expect(result.currency).toBe('USD');
    expect(result.status).toBe('active');
    expect(result.notify).toBe(true);
  });

  it('accepts a fully populated subscription', () => {
    const full = {
      ...validSubscription,
      description: 'Streaming service',
      currency: 'CZK',
      billingDay: 15,
      startDate: '2024-01-01',
      categoryId: 'cat_123',
      status: 'trial' as const,
      trialEndsAt: '2026-05-01',
      url: 'https://netflix.com',
      logo: 'netflix',
      color: '#E50914',
      cancellationUrl: 'https://netflix.com/cancel',
      notify: false,
      notes: 'Family plan',
    };
    const result = createSubscriptionSchema.parse(full);
    expect(result.description).toBe('Streaming service');
    expect(result.currency).toBe('CZK');
    expect(result.color).toBe('#E50914');
  });

  // --- Validation failures ---

  it('rejects empty name', () => {
    expect(() => createSubscriptionSchema.parse({
      ...validSubscription,
      name: '',
    })).toThrow();
  });

  it('rejects name over 100 chars', () => {
    expect(() => createSubscriptionSchema.parse({
      ...validSubscription,
      name: 'x'.repeat(101),
    })).toThrow();
  });

  it('rejects zero amount', () => {
    expect(() => createSubscriptionSchema.parse({
      ...validSubscription,
      amount: 0,
    })).toThrow();
  });

  it('rejects negative amount', () => {
    expect(() => createSubscriptionSchema.parse({
      ...validSubscription,
      amount: -5,
    })).toThrow();
  });

  it('rejects amount over 99999.99', () => {
    expect(() => createSubscriptionSchema.parse({
      ...validSubscription,
      amount: 100000,
    })).toThrow();
  });

  it('rejects invalid billing cycle', () => {
    expect(() => createSubscriptionSchema.parse({
      ...validSubscription,
      billingCycle: 'biweekly',
    })).toThrow();
  });

  it('rejects invalid date format', () => {
    expect(() => createSubscriptionSchema.parse({
      ...validSubscription,
      nextBillingDate: '15/04/2026',
    })).toThrow();
  });

  it('rejects invalid hex color', () => {
    expect(() => createSubscriptionSchema.parse({
      ...validSubscription,
      color: 'red',
    })).toThrow();
    expect(() => createSubscriptionSchema.parse({
      ...validSubscription,
      color: '#GGG',
    })).toThrow();
  });

  it('rejects invalid URL', () => {
    expect(() => createSubscriptionSchema.parse({
      ...validSubscription,
      url: 'not-a-url',
    })).toThrow();
  });

  it('allows empty string for optional URL fields', () => {
    const result = createSubscriptionSchema.parse({
      ...validSubscription,
      url: '',
      cancellationUrl: '',
    });
    expect(result.url).toBe('');
  });

  it('rejects billingDay out of range', () => {
    expect(() => createSubscriptionSchema.parse({
      ...validSubscription,
      billingDay: 0,
    })).toThrow();
    expect(() => createSubscriptionSchema.parse({
      ...validSubscription,
      billingDay: 32,
    })).toThrow();
  });

  it('rejects notes over 1000 chars', () => {
    expect(() => createSubscriptionSchema.parse({
      ...validSubscription,
      notes: 'x'.repeat(1001),
    })).toThrow();
  });

  it('rejects currency not 3 chars', () => {
    expect(() => createSubscriptionSchema.parse({
      ...validSubscription,
      currency: 'US',
    })).toThrow();
    expect(() => createSubscriptionSchema.parse({
      ...validSubscription,
      currency: 'USDD',
    })).toThrow();
  });
});

// ============================================================
// Update Subscription Schema (partial)
// ============================================================
describe('updateSubscriptionSchema', () => {
  it('accepts partial updates', () => {
    const result = updateSubscriptionSchema.parse({ name: 'Spotify' });
    expect(result.name).toBe('Spotify');
    expect(result.amount).toBeUndefined();
  });

  it('accepts empty object (no changes)', () => {
    const result = updateSubscriptionSchema.parse({});
    expect(Object.keys(result)).toHaveLength(0);
  });

  it('still validates provided fields', () => {
    expect(() => updateSubscriptionSchema.parse({
      amount: -1,
    })).toThrow();
  });
});

// ============================================================
// Create Category Schema
// ============================================================
describe('createCategorySchema', () => {
  it('accepts valid category', () => {
    const result = createCategorySchema.parse({
      name: 'Entertainment',
      color: '#8B5CF6',
    });
    expect(result.name).toBe('Entertainment');
    expect(result.color).toBe('#8B5CF6');
  });

  it('accepts category with icon', () => {
    const result = createCategorySchema.parse({
      name: 'Gaming',
      color: '#EF4444',
      icon: 'gamepad-2',
    });
    expect(result.icon).toBe('gamepad-2');
  });

  it('rejects empty name', () => {
    expect(() => createCategorySchema.parse({
      name: '',
      color: '#000000',
    })).toThrow();
  });

  it('rejects name over 50 chars', () => {
    expect(() => createCategorySchema.parse({
      name: 'x'.repeat(51),
      color: '#000000',
    })).toThrow();
  });

  it('rejects invalid hex color', () => {
    expect(() => createCategorySchema.parse({
      name: 'Test',
      color: 'blue',
    })).toThrow();
  });
});

// ============================================================
// Update Profile Schema
// ============================================================
describe('updateProfileSchema', () => {
  it('accepts valid profile update', () => {
    const result = updateProfileSchema.parse({
      name: 'Michal',
      currency: 'CZK',
      monthlyBudget: 5000,
      reminderDays: 7,
      reminderTime: '08:00',
      weeklyDigest: true,
    });
    expect(result.name).toBe('Michal');
    expect(result.currency).toBe('CZK');
  });

  it('accepts partial update', () => {
    const result = updateProfileSchema.parse({ weeklyDigest: false });
    expect(result.weeklyDigest).toBe(false);
  });

  it('allows null monthlyBudget (remove budget)', () => {
    const result = updateProfileSchema.parse({ monthlyBudget: null });
    expect(result.monthlyBudget).toBeNull();
  });

  it('rejects reminderDays out of range', () => {
    expect(() => updateProfileSchema.parse({ reminderDays: 0 })).toThrow();
    expect(() => updateProfileSchema.parse({ reminderDays: 31 })).toThrow();
  });

  it('rejects invalid reminderTime format', () => {
    expect(() => updateProfileSchema.parse({ reminderTime: '8am' })).toThrow();
    expect(() => updateProfileSchema.parse({ reminderTime: '800' })).toThrow();
  });

  it('rejects negative budget', () => {
    expect(() => updateProfileSchema.parse({ monthlyBudget: -100 })).toThrow();
  });
});

// ============================================================
// Confirm Import Schema
// ============================================================
describe('confirmImportSchema', () => {
  it('accepts valid import confirmation', () => {
    const result = confirmImportSchema.parse({
      importId: 'imp_123',
      subscriptions: [
        {
          name: 'Netflix',
          amount: 15.99,
          currency: 'USD',
          billingCycle: 'monthly',
          include: true,
        },
        {
          name: 'Spotify',
          amount: 10.99,
          currency: 'USD',
          billingCycle: 'monthly',
          categoryId: 'cat_music',
          include: true,
        },
        {
          name: 'Random charge',
          amount: 5.00,
          currency: 'USD',
          billingCycle: 'monthly',
          include: false,
        },
      ],
    });
    expect(result.subscriptions).toHaveLength(3);
    expect(result.subscriptions[2].include).toBe(false);
  });

  it('accepts import with existingId mapping', () => {
    const result = confirmImportSchema.parse({
      importId: 'imp_456',
      subscriptions: [
        {
          name: 'Netflix',
          amount: 15.99,
          currency: 'USD',
          billingCycle: 'monthly',
          existingId: 'sub_existing_123',
          include: true,
        },
      ],
    });
    expect(result.subscriptions[0].existingId).toBe('sub_existing_123');
  });

  it('rejects missing importId', () => {
    expect(() => confirmImportSchema.parse({
      subscriptions: [],
    })).toThrow();
  });

  it('rejects subscription with invalid billingCycle', () => {
    expect(() => confirmImportSchema.parse({
      importId: 'imp_789',
      subscriptions: [{
        name: 'Test',
        amount: 5,
        currency: 'USD',
        billingCycle: 'biweekly',
        include: true,
      }],
    })).toThrow();
  });
});
