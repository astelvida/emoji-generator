import { relations } from "drizzle-orm";
import { text, timestamp, varchar, integer, pgTable, serial } from "drizzle-orm/pg-core";

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
    id: varchar("id").primaryKey().notNull(),
    prompt: text("prompt"),
    slug: text("slug"),
    imageUrl: text("image_url"),
    status: text("status").default("generating"),
    favoriteCount: integer("favorite_count").default(0),
    userId: varchar("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  emojiId: varchar("emoji_id")
    .references(() => emojis.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
