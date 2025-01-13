"use server";

import { auth } from "@clerk/nextjs/server";
import { eq, desc, sql, and } from "drizzle-orm";
import { db } from "@/db";
import { users, emojis, User, Emoji, likes } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// User queries
export const getUser = async (): Promise<User | null> => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("GET USER FAILED: User not authenticated");

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return user;
  } catch (error) {
    console.error("GET USER FAILED: ", error);
    throw new Error("GET USER FAILED: " + error);
  }
};

export const createUser = async (data: Partial<User>) => {
  const [user] = await db.insert(users).values(data).returning();
  return user;
};

// Emoji queries
export const getEmoji = async (id: string): Promise<Emoji | undefined> => {
  try {
    const [emoji] = await db.select().from(emojis).where(eq(emojis.id, id));
    return emoji;
  } catch (error) {
    console.error("GET EMOJI FAILED: ", error);
    throw new Error("GET EMOJI FAILED: " + error);
  }
};

export const createEmoji = async (emoji: Partial<Emoji>): Promise<Emoji> => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("CREATE EMOJI FAILED: User not authenticated");

    await db.insert(emojis).values({ ...emoji, userId });
  } catch (error) {
    console.error("CREATE EMOJI FAILED: ", error);
    throw new Error("CREATE EMOJI FAILED: " + error);
  }
};

export const updateEmoji = async (id: string, data: Partial<Emoji>): Promise<Emoji> => {
  try {
    const [emoji] = await db.update(emojis).set(data).where(eq(emojis.id, id)).returning();
    return emoji;
  } catch (error) {
    throw new Error("UPDATE EMOJI FAILED: " + error);
  }
};

export const deleteEmoji = async (id: string): Promise<void> => {
  const { userId } = await auth();
  if (!userId) throw new Error("DELETE EMOJI FAILED: User not authenticated");

  const myHeaders = await headers();
  const currentPath = new URL(myHeaders.get("referer") || "/");
  const pathname = currentPath.pathname;

  await db.delete(emojis).where(eq(emojis.id, id));

  revalidatePath(`/`);
  if (pathname === `/emoji/${id}`) {
    redirect("/");
  }
};

export const getEmojis = async (limit: number = 50, offset: number = 0): Promise<Emoji[]> => {
  try {
    const emojisData = await db
      .select()
      .from(emojis)
      .orderBy(desc(emojis.createdAt))
      .offset(offset)
      .limit(limit);

    return emojisData;
  } catch (error) {
    console.error("GET EMOJIS FAILED: ", error);
    throw new Error("GET EMOJIS FAILED: " + error);
  }
};

// Like/Unlike emoji
export const toggleLike = async (emojiId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");
  const existingLike = await db
    .select()
    .from(likes)
    .where(and(eq(likes.userId, userId), eq(likes.emojiId, emojiId)))
    .limit(1);

  if (existingLike.length > 0) {
    // Unlike
    await db.delete(likes).where(and(eq(likes.userId, userId), eq(likes.emojiId, emojiId)));
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

export const getEmojiWithLikeStatus = async (emojiId: string): Promise<{ emoji: Emoji }> => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const [emoji] = await db.select().from(emojis).where(eq(emojis.id, emojiId)).limit(1);
    const [like] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.emojiId, emojiId), eq(likes.userId, userId)))
      .limit(1);

    return {
      emoji: { ...emoji, isFavorite: !!like },
    };
  } catch (error) {
    console.error("GET EMOJI WITH LIKE STATUS FAILED: ", error);
    throw new Error("GET EMOJI WITH LIKE STATUS FAILED: " + error);
  }
};

export const getEmojiCount = async (): Promise<number> => {
  const [count] = await db.select({ count: sql<number>`count(*)` }).from(emojis);
  return count.count;
};
