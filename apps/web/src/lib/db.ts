import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@subtracker/db/schema";

function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url || url.includes("dummy")) {
    // Return a proxy that throws on actual usage but doesn't crash at import time
    return new Proxy({} as ReturnType<typeof drizzle>, {
      get(_, prop) {
        if (prop === "then" || prop === Symbol.toPrimitive) return undefined;
        return () => {
          throw new Error("DATABASE_URL is not configured");
        };
      },
    });
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

export const db = createDb();
