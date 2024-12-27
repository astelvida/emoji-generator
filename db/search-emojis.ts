"use server";

import { desc, sql, getTableColumns } from "drizzle-orm";
import { emojis, Emoji } from "./schema";
import { db } from ".";
import { cache } from "react";

export const searchEmojis = cache(
  async (
    query: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<Emoji[]> => {
    // Convert the search query into a valid tsquery format
    const searchQuery = query
      .trim()
      .split(/\s+/)
      .map((term) => term.replace(/[^\w\s]/g, "")) // Remove special characters
      .filter(Boolean) // Remove empty strings
      .map((term) => `${term}:*`) // Add prefix matching
      .join(" | "); // Use AND operation

    if (!searchQuery) {
      return [];
    }

    console.log("searchQuery", searchQuery);
    const matchQuery = sql`(
    setweight(to_tsvector('english', coalesce(${emojis.prompt}, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(${emojis.description}, '')), 'B')
  ), to_tsquery('english', ${searchQuery})`; // Use to_tsquery for safety

    const results = await db
      .select({
        ...getTableColumns(emojis),
        rank: sql`ts_rank(${matchQuery})`,
        rankCd: sql`ts_rank_cd(${matchQuery})`,
      })
      .from(emojis)
      .where(
        sql`(
            setweight(to_tsvector('english', coalesce(${emojis.prompt}, '')), 'A') ||
            setweight(to_tsvector('english', coalesce(${emojis.description}, '')), 'B')
          ) @@ to_tsquery('english', ${searchQuery})`
      )
      .orderBy((t) => desc(t.rank))
      .limit(limit)
      .offset(offset);

    return results;
  }
);

export async function runSearch(query: string) {
  const searchQuery = query
    .trim()
    .split(/\s+/)
    .map((term) => term.replace(/[^\w\s]/g, "")) // Remove special characters
    .filter(Boolean) // Remove empty strings
    .map((term) => `${term}:*`) // Add prefix matching
    .join(" | "); // Use AND operation

  console.log("searchQuery", searchQuery);
  const results = await db.select().from(emojis).where(sql`(
      setweight(to_tsvector('english', ${emojis.prompt}), 'A') ||
      setweight(to_tsvector('english', ${emojis.description}), 'B') ||
      setweight(to_tsvector('english', ${emojis.caption}), 'C'))
      @@ to_tsquery('english', ${searchQuery}
    )`);

  // console.log(results);
  return results;
}

// runSearch("cats dogs");
