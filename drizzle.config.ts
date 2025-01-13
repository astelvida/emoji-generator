// import { config } from "dotenv";
import "dotenv/config";
import { Config } from "drizzle-kit";

// config({ path: ".env" });

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // driver: "pglite",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
