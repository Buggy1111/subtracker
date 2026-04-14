import { createDb } from './client';
import { categories } from './schema';
import { DEFAULT_CATEGORIES } from './seed-data';
import { sql } from 'drizzle-orm';

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is required');
    process.exit(1);
  }

  const db = createDb(databaseUrl);

  console.log('Seeding default categories...');

  for (const cat of DEFAULT_CATEGORIES) {
    await db
      .insert(categories)
      .values({
        userId: null,
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
      })
      .onConflictDoNothing();
  }

  console.log(`Seeded ${DEFAULT_CATEGORIES.length} categories.`);
  console.log('Done.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
