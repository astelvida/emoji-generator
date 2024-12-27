"use server";

import { eq, desc, sql, isNull, or, and, ne } from "drizzle-orm";
import { users, emojis, User, Emoji, likes } from "./schema";
import { db } from ".";
import { currentUser } from "@clerk/nextjs/server";
import { cache } from "react";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getUser() {
  const currUser = await currentUser();
  if (!currUser) throw new Error("User not found");
  const [user] = await db.select().from(users).where(eq(users.id, currUser.id));
  return user;
}

export const getUserById = async (id: string): Promise<User | undefined> => {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
};

// User queries
export const createUser = async (user: User): Promise<User> => {
  const [newUser] = await db
    .insert(users)
    .values(user)
    .onConflictDoUpdate({ target: users.id, set: user })
    .returning();
  return newUser;
};

export const getEmoji = async (id: string): Promise<Emoji | undefined> => {
  const [emoji] = await db.select().from(emojis).where(eq(emojis.id, id));
  return emoji;
};

// Emoji queries
export const createEmoji = async (emoji: Partial<Emoji>): Promise<Emoji> => {
  const user = await currentUser();
  if (!user) throw new Error("User not found");

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

export const getEmojiCount = async (): Promise<number> => {
  const [count] = await db
    .select({ count: sql<number>`count(*)` })
    .from(emojis);
  return count.count;
};

export const getPopularEmojis = cache(
  async (limit: number = 200, offset: number = 0): Promise<Emoji[]> => {
    return db
      .select()
      .from(emojis)
      .orderBy(desc(emojis.favoriteCount), desc(emojis.createdAt))
      .limit(limit)
      .offset(offset);
  }
);

export const getRecentEmojis = cache(
  async (limit: number = 200, offset: number = 0): Promise<Emoji[]> => {
    return db
      .select()
      .from(emojis)
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

export const searchEmojis = async (
  query: string,
  limit: number = 200,
  offset: number = 0
) => {
  const searchQuery = query
    .trim()
    .split(/\s+/)
    .map((term) => term.replace(/[^\w\s]/g, "")) // Remove special characters
    .filter(Boolean) // Remove empty strings
    .map((term) => `${term}:*`) // Add prefix matching
    .join(" | "); // Use AND operation

  console.log("searchQuery", searchQuery);

  if (!searchQuery) return [];

  const searchVector = sql`
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

  return db
    .select()
    .from(emojis)
    .where(sql`${searchVector} @@ to_tsquery('english', ${searchQuery})`)
    .orderBy(desc(emojis.createdAt))
    .limit(limit)
    .offset(offset);
};

export const getRelatedEmojis = async (
  emojiId: string,
  query: string,
  limit: number = 200,
  offset: number = 0
) => {
  // const searchQuery = query
  //   .trim()
  //   .split(/\s+/)
  //   .map((term) => `${term}:*`)
  //   .join(" | ");

  const searchQuery = query
    .trim()
    .split(/\s+/)
    .map((term) => term.replace(/[^\w\s]/g, "")) // Remove special characters
    .filter(Boolean) // Remove empty strings
    .map((term) => `${term}:*`) // Add prefix matching
    .join(" | "); // Use AND operation

  console.log("RELEVANT QUERY§", searchQuery);

  if (!searchQuery) return [];

  const searchVector = sql`to_tsvector('english',  coalesce(${emojis.prompt}, '') || ' ')
 `;
  return db
    .select()
    .from(emojis)
    .where(
      and(
        sql`${searchVector} @@ to_tsquery('english', ${searchQuery})`,
        ne(emojis.id, emojiId)
      )
    )
    .orderBy(desc(emojis.createdAt))
    .limit(limit)
    .offset(offset);
};

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
export const getUserLikedEmojis = cache(async () => {
  const user = await currentUser();
  const userId = user?.id;

  if (!userId) return [];

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
