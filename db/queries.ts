"use server";

import { eq, desc, sql, isNull, or } from "drizzle-orm";
import { users, emojis, User, Emoji } from "./schema";
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
  async (limit: number = 20, offset: number = 0): Promise<Emoji[]> => {
    return db
      .select()
      .from(emojis)
      .orderBy(desc(emojis.favoriteCount), desc(emojis.createdAt))
      .limit(limit)
      .offset(offset);
  }
);

export const getRecentEmojis = cache(
  async (limit: number = 20, offset: number = 0): Promise<Emoji[]> => {
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
