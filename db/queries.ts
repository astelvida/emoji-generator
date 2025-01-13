"use server";

import { eq, desc, sql, isNull, or, and, ne, isNotNull } from "drizzle-orm";
import { users, emojis, User, Emoji, likes } from "./schema";
import { db } from ".";
import { auth, currentUser } from "@clerk/nextjs/server";
import { cache } from "react";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// User queries
export const getUser = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return user;
};

export const createUser = async (data: Partial<User>) => {
  const [user] = await db.insert(users).values(data).returning();
  return user;
};    

// Emoji queries
export const getEmoji = async (id: string): Promise<Emoji | undefined> => {
  const [emoji] = await db.select().from(emojis).where(eq(emojis.id, id));
  return emoji;
};

export const createEmoji = async (emoji: Partial<Emoji>): Promise<Emoji> => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const [newEmoji] = await db
    .insert(emojis)
    .values({ ...emoji, userId })
    .returning();
  return newEmoji;
};

export const updateEmoji = async (
  id: string,
  data: Partial<Emoji>
): Promise<Emoji> => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

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


export const deleteEmoji = async (id: string): Promise<void> => {
  const myHeaders = await headers();
  const currentPath = new URL(myHeaders.get("referer") || "/");
  const pathname = currentPath.pathname;

  await db.delete(emojis).where(eq(emojis.id, id)); 

  revalidatePath(`/`);
  if (pathname === `/emoji/${id}`) {
    redirect("/");
  }
};

export const getEmojis = async (): Promise<Emoji[]> => {
  const emojisData = await db.select().from(emojis).orderBy(desc(emojis.createdAt)).limit(50);
  return emojisData;
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


export const getEmojiWithLikeStatus = async (
  emojiId: string
): Promise<{ emoji: Emoji | undefined; isLiked: boolean }> => {
    const user = await currentUser(); 
    const userId = user?.id;

    const [emoji] = await db
      .select()
      .from(emojis)
      .where(eq(emojis.id, emojiId))

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
};

