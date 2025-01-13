"use server";

import { db } from "@/db";
import { emojis, likes } from "@/db/schema";
import { sql, ilike, eq, desc, isNotNull } from "drizzle-orm";

export const getSearchResults = async (
  searchTerm: string,
  limit: number = 30,
  offset: number = 0
) => {
  console.log("searchTerm: ", searchTerm);
  let results;

  // do we really need to do this hybrid search pattern?

  if (searchTerm.length <= 1) {
    // If the search term is short (e.g., "W"), use ILIKE for prefix matching
    results = await db
      .select({
        id: emojis.id,
        prompt: emojis.prompt,
        imageUrl: emojis.imageUrl,
        slug: emojis.slug,
        favoriteCount: emojis.favoriteCount,
        isFavorite: isNotNull(likes.userId),
      })
      .from(emojis)
      .where(ilike(emojis.prompt, `%${searchTerm}%`))
      .orderBy(emojis.slug)
      .limit(limit)
      .offset(offset)
      .leftJoin(likes, eq(emojis.id, likes.emojiId));
    // .orderBy(desc(emojis.favoriteCount));
  } else {
    // For longer search terms, use full-text search with tsquery
    const formattedSearchTerm = searchTerm
      .trim()
      .split(" ")
      .filter((term) => term.trim() !== "") // Filter out empty terms
      .map((term) => `${term}:*`)
      .join(" & ");

    console.log("formattedSearchTerm:", JSON.stringify(formattedSearchTerm));

    results = await db
      .select({
        id: emojis.id,
        prompt: emojis.prompt,
        imageUrl: emojis.imageUrl,
        slug: emojis.slug,
        favoriteCount: emojis.favoriteCount,
        isFavorite: isNotNull(likes.userId),
      })
      .from(emojis)
      .where(
        sql`to_tsvector('english', ${emojis.prompt}) @@ to_tsquery('english', ${formattedSearchTerm})`
      )
      .orderBy(emojis.slug)
      .leftJoin(likes, eq(emojis.id, likes.emojiId))
      .limit(limit)
      .offset(offset);
  }
  // .innerJoin(likes, sql`${emojis.id} = ${likes.emojiId}`);
  console.log("results: ", results);

  return results || [];
};
