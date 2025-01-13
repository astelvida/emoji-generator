ALTER TABLE "emojis" ALTER COLUMN "prompt" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "prompt_search_index" ON "emojis" USING gin (to_tsvector('english', "prompt"));--> statement-breakpoint
CREATE INDEX "slug_idx" ON "emojis" USING btree ("slug");