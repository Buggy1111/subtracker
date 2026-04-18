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

// Sanitize a user-provided file name:
// - strip null bytes and control characters
// - strip path separators and parent-directory references
// - limit length to prevent DB bloat / log flooding
const fileNameSchema = z
  .string()
  .trim()
  .min(1, "File name required")
  .max(200, "File name too long")
  .transform((s) =>
    s
      // drop control chars including NUL
      .replace(/[\u0000-\u001f\u007f]/g, "")
      // drop any path separators and drive prefixes
      .replace(/[\\/]/g, "_")
      // collapse ".." so directory escape is not possible
      .replace(/\.{2,}/g, "."),
  );

export const confirmImportSchema = z.object({
  fileName: fileNameSchema,
  bankDetected: z.string().max(64),
  totalRows: z.number().int().min(0).max(1_000_000),
  subscriptions: z
    .array(
      z.object({
        name: z.string().min(1).max(100),
        amount: z.number().positive().max(99_999.99),
        currency: currencySchema,
        billingCycle: billingCycleEnum,
        categoryId: z.string().optional(),
        existingId: z.string().optional(),
        include: z.boolean(),
      }),
    )
    .max(1000, "Too many subscriptions in a single import"),
});

export type ConfirmImportInput = z.infer<typeof confirmImportSchema>;
