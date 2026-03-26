import { z } from 'zod';

// ============================================================
// Enums
// ============================================================

export const billingCycleEnum = z.enum(['monthly', 'yearly', 'weekly', 'quarterly']);
export type BillingCycle = z.infer<typeof billingCycleEnum>;

export const statusEnum = z.enum(['active', 'paused', 'cancelled', 'trial']);
export type SubscriptionStatus = z.infer<typeof statusEnum>;

const currencySchema = z.string().length(3).toUpperCase();

// ============================================================
// Subscription Schemas
// ============================================================

export const createSubscriptionSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  amount: z.number().positive().max(99999.99),
  currency: currencySchema.default('USD'),
  billingCycle: billingCycleEnum,
  billingDay: z.number().int().min(1).max(31).optional(),
  startDate: z.string().date().optional(),
  nextBillingDate: z.string().date(),
  categoryId: z.string().optional(),
  status: statusEnum.default('active'),
  trialEndsAt: z.string().date().optional(),
  url: z.string().url().optional().or(z.literal('')),
  logo: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  cancellationUrl: z.string().url().optional().or(z.literal('')),
  notify: z.boolean().default(true),
  notes: z.string().max(1000).optional(),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;

export const updateSubscriptionSchema = createSubscriptionSchema.partial();
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;

// ============================================================
// Category Schemas
// ============================================================

export const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  icon: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

// ============================================================
// Profile Schema
// ============================================================

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  currency: currencySchema.optional(),
  locale: z.string().optional(),
  monthlyBudget: z.number().positive().optional().nullable(),
  reminderDays: z.number().int().min(1).max(30).optional(),
  reminderTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  weeklyDigest: z.boolean().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ============================================================
// Import Schema
// ============================================================

export const confirmImportSchema = z.object({
  importId: z.string(),
  subscriptions: z.array(z.object({
    name: z.string(),
    amount: z.number().positive(),
    currency: z.string(),
    billingCycle: billingCycleEnum,
    categoryId: z.string().optional(),
    existingId: z.string().optional(),
    include: z.boolean(),
  })),
});

export type ConfirmImportInput = z.infer<typeof confirmImportSchema>;
