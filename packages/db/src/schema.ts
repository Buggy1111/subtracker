import { pgTable, text, numeric, integer, boolean, timestamp, date, primaryKey, index } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// ============================================================
// Auth.js Tables
// ============================================================

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  currency: text('currency').notNull().default('USD'),
  locale: text('locale').notNull().default('en'),
  monthlyBudget: numeric('monthly_budget', { precision: 10, scale: 2 }),
  reminderDays: integer('reminder_days').notNull().default(3),
  reminderTime: text('reminder_time').notNull().default('09:00'),
  weeklyDigest: boolean('weekly_digest').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
});

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (table) => [
  primaryKey({ columns: [table.identifier, table.token] }),
]);

// ============================================================
// App Tables
// ============================================================

export const categories = pgTable('categories', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  color: text('color').notNull(),
  icon: text('icon'),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  billingCycle: text('billing_cycle').notNull(),
  billingDay: integer('billing_day'),
  startDate: date('start_date'),
  nextBillingDate: date('next_billing_date').notNull(),
  categoryId: text('category_id').references(() => categories.id),
  status: text('status').notNull().default('active'),
  trialEndsAt: date('trial_ends_at'),
  url: text('url'),
  logo: text('logo'),
  color: text('color'),
  cancellationUrl: text('cancellation_url'),
  cancellationDifficulty: integer('cancellation_difficulty'),
  importSource: text('import_source').notNull().default('manual'),
  importRef: text('import_ref'),
  notify: boolean('notify').notNull().default(true),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('sub_user_status_idx').on(table.userId, table.status),
  index('sub_user_next_billing_idx').on(table.userId, table.nextBillingDate),
  index('sub_user_category_idx').on(table.userId, table.categoryId),
]);

export const payments = pgTable('payments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  subscriptionId: text('subscription_id').notNull().references(() => subscriptions.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull(),
  date: date('date').notNull(),
  source: text('source').notNull().default('auto'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  index('pay_user_date_idx').on(table.userId, table.date),
  index('pay_sub_date_idx').on(table.subscriptionId, table.date),
]);

export const reminders = pgTable('reminders', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  subscriptionId: text('subscription_id').notNull().references(() => subscriptions.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  scheduledFor: timestamp('scheduled_for').notNull(),
  sentAt: timestamp('sent_at'),
  channel: text('channel').notNull().default('email'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => [
  index('rem_pending_idx').on(table.sentAt, table.scheduledFor),
]);

export const imports = pgTable('imports', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(),
  bankDetected: text('bank_detected'),
  rowCount: integer('row_count').notNull(),
  matchedCount: integer('matched_count').notNull(),
  importedCount: integer('imported_count').notNull(),
  status: text('status').notNull().default('completed'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const pushSubscriptions = pgTable('push_subscriptions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  endpoint: text('endpoint').notNull(),
  p256dh: text('p256dh').notNull(),
  auth: text('auth').notNull(),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
