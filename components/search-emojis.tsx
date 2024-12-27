import { Skeleton } from "./ui/skeleton";
import EmojiCardList from "./emoji-card-list";
// import { searchEmojis } from "@/db/search-emojis";
import { getRecentEmojis, searchEmojis } from "@/db/queries";

interface EmojisGridProps {
  query?: string | undefined;
}

// Cache the data fetching functions

export async function SearchEmojisGrid({ query }: EmojisGridProps) {
  const emojis = query ? await searchEmojis(query) : await getRecentEmojis();

  return (
    <section className="mt-4">
      <h2 className="text-2xl font-semibold mb-6">
        {query ? `Search results for "${query}"` : "Search emojis"}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {emojis.map((emoji) => (
          <EmojiCardList emoji={emoji} key={emoji.id} />
        ))}
      </div>
    </section>
  );
}

export function EmojisGridSkeleton() {
  return (
    <section className="mt-4">
      <h2 className="text-2xl font-semibold mb-6">Loading emojis...</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square rounded-2xl bg-muted/30  flex items-center justify-center "
          >
            <Skeleton className="w-full h-full rounded-xl" />
          </div>
        ))}
      </div>
    </section>
  );
}
