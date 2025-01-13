CREATE INDEX "search_index" ON "emojis" USING gin (
(
  setweight(to_tsvector('english', coalesce("prompt", '')), 'A') ||
  setweight(to_tsvector('english', coalesce("description", '')), 'B') ||
  setweight(to_tsvector('english', coalesce("caption", '')), 'C')
));