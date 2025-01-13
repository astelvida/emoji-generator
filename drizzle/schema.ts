import { pgTable, varchar, text, timestamp, foreignKey, json, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: varchar().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	name: text().notNull(),
	username: text(),
	imageUrl: text("image_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const emojis = pgTable("emojis", {
	id: varchar().primaryKey().notNull(),
	prompt: text().notNull(),
	slug: text(),
	originalUrl: text("original_url"),
	imageUrl: text("image_url"),
	caption: text(),
	description: text(),
	categories: json().default([]),
	keywords: json().default([]),
	status: text().default('generating'),
	favoriteCount: integer("favorite_count").default(0),
	userId: varchar("user_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "emojis_user_id_users_id_fk"
		}).onDelete("cascade"),
]);
