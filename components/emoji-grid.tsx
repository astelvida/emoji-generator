import { getEmojis } from "@/db/queries";
import { Skeleton } from "./ui/skeleton";
import { EmojiGridItem } from "@/components/emoji-grid-item";
import { getSearchResults } from "@/db/getSearchResults";
import { Emoji, emojis } from "@/db/schema";

interface EmojiGridProps {
  emojiId?: string | undefined;
  query?: string | undefined;
  userId?: string | undefined;
}

export async function fetchSearchResults(query: string | undefined) {
  try {
    let emojis: Emoji[] | (Emoji & { isFavorite: boolean }[]) = [];
    if (query) {
      emojis = await getSearchResults(query);
    } else {
      emojis = await getEmojis();
    }
    return emojis;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return {
      error: "Error fetching search results",
      message: typeof error === "string" ? error : error?.message || "NO MESSAGE",
    };
  }
}

export async function EmojiGrid({ emojiId, query }: EmojiGridProps) {
  const emojis = await fetchSearchResults(query);

  console.log("emojis: ", emojis);

  if (emojis?.error) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        {emojis.error} + MESSAGE: {emojis.message}
      </div>
    );
  }

  return (
    <ul className="grid w-full auto-rows-max place-content-stretch justify-items-stretch grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {emojis.map((emoji) => (
        <EmojiGridItem key={emoji.id} emoji={emoji} />
      ))}
    </ul>
  );
}

export function EmojiGridSkeleton() {
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
