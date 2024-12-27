import {
  getRecentEmojis,
  getRelatedEmojis,
  getUserLikedEmojis,
  searchEmojis,
} from "@/db/queries";
import { Skeleton } from "./ui/skeleton";
import EmojiCardList from "./emoji-card-list";

interface EmojisGridProps {
  emojiId?: string | undefined;
  query?: string | undefined;
}

export async function EmojisGrid({ emojiId, query }: EmojisGridProps) {
  const [emojis, likedEmojis] = await Promise.all([
    query && emojiId
      ? getRelatedEmojis(emojiId, query)
      : query
      ? searchEmojis(query)
      : getRecentEmojis(),
    getUserLikedEmojis(),
  ]);

  // Extract just the emoji IDs that the user has liked
  const likedEmojiIds = new Set(likedEmojis.map(({ emoji }) => emoji.id));

  return (
    <>
      <h2> LENGHT {emojis.length}</h2>
      <ul className="grid w-full auto-rows-max place-content-stretch justify-items-stretch grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {emojis.map((emoji, index) => (
          <EmojiCardList
            index={index}
            emoji={emoji}
            key={emoji.id}
            isLiked={likedEmojiIds.has(emoji.id)}
          />
        ))}
      </ul>
    </>
  );
}

export function EmojisGridSkeleton() {
  return (
    <div className="grid w-full auto-rows-max place-content-stretch justify-items-stretch grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="aspect-square rounded-2xl bg-muted/30 flex items-center justify-center "
        >
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}
