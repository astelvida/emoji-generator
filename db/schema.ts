import { sql } from "drizzle-orm";
import {
  text,
  timestamp,
  varchar,
  integer,
  uniqueIndex,
  pgTable,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  name: text("name").notNull(),
  username: text("username"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// const status = pgEnum("status", ["generating", "generated"]);
// prettier-ignore
export const emojis = pgTable(
  "emojis",
  {
    id: varchar("id").primaryKey(),
    prompt: text("prompt").notNull(),
    slug: text("slug"),
    originalUrl: text("original_url"),
    imageUrl: text("image_url"),

    caption: text("caption"),
    description: text("description"),
    categories: text("categories")
      .array()
      .default(sql`ARRAY[]::text[]`),
    keywords: text("keywords")
      .array()
      .default(sql`ARRAY[]::text[]`),

    status: text("status").default("generating"),
    favoriteCount: integer("favorite_count").default(0),
    userId: varchar("user_id")
      .references(() => users.id)
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },

);

// .where(sql`to_tsvector('english', ${posts.title}) @@ to_tsquery('english', ${title})`);

// prettier-ignore
export const likes = pgTable(
  "likes",
  {
    id: varchar("id").primaryKey(),
    userId: varchar("user_id").references(() => users.id).notNull(),
    emojiId: varchar("emoji_id").references(() => emojis.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (likes) => ({
    userEmojiIndex: uniqueIndex("user_emoji_idx").on(likes.userId, likes.emojiId),
  })
);

export type User = typeof users.$inferSelect;
export type Emoji = typeof emojis.$inferSelect;
export type Like = typeof likes.$inferSelect;

export type NewUser = typeof users.$inferInsert;
export type NewEmoji = typeof emojis.$inferInsert;
export type NewLike = typeof likes.$inferInsert;
