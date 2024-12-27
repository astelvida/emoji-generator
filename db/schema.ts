import { relations } from "drizzle-orm";
import {
  text,
  timestamp,
  varchar,
  integer,
  json,
  pgTable,
  uuid,
  index,
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
export const emojis = pgTable("emojis", {
  id: varchar("id").primaryKey(),
  
  prompt: text("prompt").notNull(),
  slug: text("slug"),
  originalUrl: text("original_url"),
  imageUrl: text("image_url"),

  caption: text("caption"),
  description: text("description"),
  categories: json("categories").$type<string[]>().default([]),
  keywords: json("keywords").$type<string[]>().default([]),

  status: text("status").default("generating"),
  favoriteCount: integer("favorite_count").default(0),


  userId: varchar("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// .where(sql`to_tsvector('english', ${posts.title}) @@ to_tsquery('english', ${title})`);

// prettier-ignore
// Likes table
export const likes = pgTable(
  "likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    

    userId: varchar("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    emojiId: varchar("emoji_id")
      .references(() => emojis.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdEmojiIdIdx: index("likes_userId_emojiId_idx").on(
      table.userId,
      table.emojiId
    ),
  })
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  emojis: many(emojis),
  likes: many(likes),
}));

export const emojisRelations = relations(emojis, ({ one, many }) => ({
  user: one(users, {
    fields: [emojis.userId],
    references: [users.id],
  }),
  likes: many(likes),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  emoji: one(emojis, {
    fields: [likes.emojiId],
    references: [emojis.id],
  }),
}));
// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Emoji = typeof emojis.$inferSelect;
export type NewEmoji = typeof emojis.$inferInsert;
export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;
