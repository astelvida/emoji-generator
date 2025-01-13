"use server";

import { eq, desc, sql, isNull, or, and, ne, isNotNull } from "drizzle-orm";
import { users, emojis, User, Emoji, likes } from "./schema";
import { db } from ".";
import { currentUser } from "@clerk/nextjs/server";
import { cache } from "react";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// Common query builder for emoji selection with like status
const buildEmojiQuery = (userId: string | undefined) => {
  return {
    ...emojis,
    isFavorite: isNotNull(likes.id),
  };
};

// Common join for likes
const withLikesJoin = (query: any, userId: string | undefined) => {
  return query.leftJoin(
    likes,
    and(eq(emojis.id, likes.emojiId), eq(likes.userId, userId))
  );
};

// User queries
export const getUser = cache(async () => {
  const currUser = await currentUser();
  if (!currUser) throw new Error("User not authenticated");
  const [user] = await db.select().from(users).where(eq(users.id, currUser.id));
  return user;
});

export const getUserById = cache(
  async (id: string): Promise<User | undefined> => {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
);

export const createUser = async (user: User): Promise<User> => {
  const [newUser] = await db
    .insert(users)
    .values(user)
    .onConflictDoUpdate({ target: users.id, set: user })
    .returning();
  return newUser;
};

// Emoji queries
export const getEmoji = cache(
  async (id: string): Promise<Emoji | undefined> => {
    const [emoji] = await db.select().from(emojis).where(eq(emojis.id, id));
    return emoji;
  }
);

export const createEmoji = async (emoji: Partial<Emoji>): Promise<Emoji> => {
  const user = await currentUser();
  if (!user) throw new Error("User not authenticated");

  const [newEmoji] = await db
    .insert(emojis)
    .values({ ...emoji, userId: user.id })
    .returning();
  return newEmoji;
};

export const updateEmoji = async (
  id: string,
  data: Partial<Emoji>
): Promise<Emoji> => {
  const [emoji] = await db
    .update(emojis)
    .set(data)
    .where(eq(emojis.id, id))
    .returning();
  return emoji;
};

export const getEmojiCount = cache(async (): Promise<number> => {
  const [count] = await db
    .select({ count: sql<number>`count(*)` })
    .from(emojis);
  return count.count;
});

export const getPopularEmojis = cache(
  async (limit: number = 50, offset: number = 0): Promise<Emoji[]> => {
    const user = await currentUser();
    const query = db.select(buildEmojiQuery(user?.id)).from(emojis);
    return withLikesJoin(query, user?.id)
      .orderBy(desc(emojis.favoriteCount), desc(emojis.createdAt))
      .limit(limit)
      .offset(offset);
  }
);

export const getRecentEmojis = cache(
  async (limit: number = 50, offset: number = 0): Promise<Emoji[]> => {
    const user = await currentUser();
    const query = db.select(buildEmojiQuery(user?.id)).from(emojis);
    return withLikesJoin(query, user?.id)
      .orderBy(desc(emojis.createdAt))
      .limit(limit)
      .offset(offset);
  }
);

export const deleteEmoji = async (id: string): Promise<void> => {
  const myHeaders = await headers();
  const currentPath = new URL(myHeaders.get("referer") || "/  ");
  const pathname = currentPath.pathname;

  await db.delete(emojis).where(eq(emojis.id, id));

  revalidatePath(`/`);
  if (pathname === `/emoji/${id}`) {
    redirect("/");
  }
};
// const result = await db.select({ count: sql<number>`count(*)` }).from(emojis);
export const deleteEmojisWithNoURL = async () => {
  await db
    .delete(emojis)
    .where(or(isNull(emojis.description), isNull(emojis.imageUrl)));
};

// Search functionality
export const searchEmojis = cache(
  async (query: string, limit: number = 50, offset: number = 0) => {
    const user = await currentUser();
    const searchQuery = formatSearchQuery(query);
    if (!searchQuery) return [];

    const searchVector = buildSearchVector();
    const baseQuery = db.select(buildEmojiQuery(user?.id)).from(emojis);

    return withLikesJoin(baseQuery, user?.id)
      .where(sql`${searchVector} @@ to_tsquery('english', ${searchQuery})`)
      .orderBy(desc(emojis.createdAt))
      .limit(limit)
      .offset(offset);
  }
);

// Helper functions
const formatSearchQuery = (query: string): string => {
  return query
    .trim()
    .split(/\s+/)
    .map((term) => term.replace(/[^\w\s]/g, ""))
    .filter(Boolean)
    .map((term) => `${term}:*`)
    .join(" | ");
};

const buildSearchVector = () => {
  return sql`
    to_tsvector('english', 
      coalesce(${emojis.prompt}, '') || ' ' || 
      coalesce(${emojis.description}, '') || ' ' || 
      coalesce((
        select string_agg(value::text, ' ')
        from jsonb_array_elements_text(${emojis.categories}::jsonb)
      ), '') || ' ' || 
      coalesce((
        select string_agg(value::text, ' ')
        from jsonb_array_elements_text(${emojis.keywords}::jsonb)
      ), '')
    )
  `;
};

export const getRelatedEmojis = cache(
  async (
    emojiId: string,
    query: string,
    limit: number = 50,
    offset: number = 0
  ) => {
    const user = await currentUser();
    const userId = user?.id;

    const searchQuery = query
      .trim()
      .split(/\s+/)
      .map((term) => term.replace(/[^\w\s]/g, "")) // Remove special characters
      .filter(Boolean) // Remove empty strings
      .map((term) => `${term}:*`) // Add prefix matching
      .join(" | "); // Use AND operation

    console.log("RELEVANT QUERY§", searchQuery);

    const searchVector = sql`to_tsvector('english',  coalesce(${emojis.prompt}, '') || ' ')`;
    return db
      .select({
        ...emojis,
        isFavorite: isNotNull(likes.id), // Check if the like exists
      })
      .from(emojis)
      .where(
        and(
          sql`${searchVector} @@ to_tsquery('english', ${searchQuery})`,
          ne(emojis.id, emojiId)
        )
      )
      .leftJoin(
        likes,
        and(eq(emojis.id, likes.emojiId), eq(likes.userId, userId))
      )
      .orderBy(desc(emojis.createdAt))
      .limit(limit)
      .offset(offset);
  }
);

// Like/Unlike emoji
export const toggleLike = async (userId: string, emojiId: string) => {
  const existingLike = await db
    .select()
    .from(likes)
    .where(and(eq(likes.userId, userId), eq(likes.emojiId, emojiId)))
    .limit(1);

  if (existingLike.length > 0) {
    // Unlike
    await db
      .delete(likes)
      .where(and(eq(likes.userId, userId), eq(likes.emojiId, emojiId)));
    await db
      .update(emojis)
      .set({ favoriteCount: sql`${emojis.favoriteCount} - 1` })
      .where(eq(emojis.id, emojiId));
    return false;
  } else {
    // Like
    await db.insert(likes).values({ userId, emojiId });
    await db
      .update(emojis)
      .set({ favoriteCount: sql`${emojis.favoriteCount} + 1` })
      .where(eq(emojis.id, emojiId));
    return true;
  }
};

// Get user's liked emojis
export const getUserLikedEmojis = cache(async (userId: string) => {
  return db
    .select({
      emoji: emojis,
    })
    .from(likes)
    .innerJoin(emojis, eq(likes.emojiId, emojis.id))
    .where(eq(likes.userId, userId))
    .orderBy(desc(likes.createdAt));
});

export const getEmojiWithLikeStatus = cache(
  async (
    emojiId: string
  ): Promise<{ emoji: Emoji | undefined; isLiked: boolean }> => {
    const user = await currentUser();
    const userId = user?.id;

    const [emoji] = await db
      .select()
      .from(emojis)
      .where(eq(emojis.id, emojiId));

    if (!emoji || !userId) {
      return { emoji, isLiked: false };
    }

    const [like] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.emojiId, emojiId), eq(likes.userId, userId)))
      .limit(1);

    return {
      emoji,
      isLiked: !!like,
    };
  }
);

export async function getEmojisWithFavorites(userId: string) {
  console.log("userId %O", userId);
  const emojisWithIsFavorite = await db
    .select({
      ...emojis,
      isFavorite: isNotNull(likes.id), // Check if the like exists
    })
    .from(emojis)
    .leftJoin(
      likes,
      and(eq(emojis.id, likes.emojiId), eq(likes.userId, userId))
    )
    .orderBy(desc(emojis.createdAt))
    .limit(3);

  // console.log("emojisWithIsFavoriteYOFODFOF", emojisWithIsFavorite);

  return emojisWithIsFavorite;
}
