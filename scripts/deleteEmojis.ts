import { db } from "@/db";
import { emojis } from "@/db/schema";
import { eq } from "drizzle-orm";

async function deleteEmojis() {
  await db.delete(emojis).where(eq(emojis.status, "generating"));
}

deleteEmojis();
