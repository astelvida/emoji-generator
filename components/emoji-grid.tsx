import { getRecentEmojis, getUserLikedEmojis } from "@/db/queries";
import { Skeleton } from "./ui/skeleton";
import EmojiCardList from "./emoji-card-list";
import { currentUser } from "@clerk/nextjs";

interface EmojisGridProps {
  emojiId?: string | undefined;
}

export async function EmojisGrid({ emojiId }: EmojisGridProps) {
  const title = "Recent emojis";
  const [emojis, likedEmojis] = await Promise.all([
    getRecentEmojis(),
    getUserLikedEmojis(),
  ]);

  // Extract just the emoji IDs that the user has liked
  const likedEmojiIds = new Set(likedEmojis.map(({ emoji }) => emoji.id));

  return (
    <section className="mt-4">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {emojis.map((emoji) => (
          <EmojiCardList
            emoji={emoji}
            key={emoji.id}
            isLiked={likedEmojiIds.has(emoji.id)}
          />
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
