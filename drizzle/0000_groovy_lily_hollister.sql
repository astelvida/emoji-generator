CREATE TABLE "emojis" (
	"id" varchar PRIMARY KEY NOT NULL,
	"prompt" text NOT NULL,
	"slug" text,
	"original_url" text,
	"image_url" text,
	"caption" text,
	"description" text,
	"categories" json DEFAULT '[]'::json,
	"keywords" json DEFAULT '[]'::json,
	"status" text DEFAULT 'generating',
	"favorite_count" integer DEFAULT 0,
	"user_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"emoji_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" text NOT NULL,
	"username" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "emojis" ADD CONSTRAINT "emojis_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_emoji_id_emojis_id_fk" FOREIGN KEY ("emoji_id") REFERENCES "public"."emojis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "search_index" ON "emojis" USING gin ((
          setweight(to_tsvector('english', "prompt"), 'A') ||
          setweight(to_tsvector('english', "description"), 'B') ||
          setweight(to_tsvector('english', "caption"), 'C')
      ));--> statement-breakpoint
CREATE INDEX "likes_userId_emojiId_idx" ON "likes" USING btree ("user_id","emoji_id");