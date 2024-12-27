import { EmojiDisplayUser } from "@/components/emoji-display-user";
import { EmojiDisplayImage } from "@/components/emoji-display-image";
import { EmojiDisplayButtons } from "./emoji-display-buttons";
import { EmojiActionButtons } from "./emoji-action-buttons";
import { Emoji } from "@/db/schema";

type EmojiCard = {
  id: string;
};

export async function EmojiCard({
  emoji,
  isLiked,
}: {
  emoji: Emoji;
  isLiked: boolean;
}) {
  // const emoji = await getEmoji(id);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col flex-nowrap justify-center space-y-2">
      <div className="flex items-center justify-between">
        <EmojiDisplayUser />
        <EmojiDisplayButtons
          userId={emoji.userId}
          isLikedByUser={isLiked}
          imageUrl={emoji.imageUrl}
          id={emoji.id}
          slug={emoji.slug ?? ""}
        />
      </div>
      <div className="flex flex-row flex-nowrap items-start justify-between">
        <h1 className="text-2xl font-bold">{emoji?.prompt}</h1>
      </div>
      <EmojiDisplayImage imageUrl={emoji.imageUrl} prompt={emoji.prompt} />
      <EmojiActionButtons
        userId={emoji.userId}
        imageUrl={emoji.imageUrl}
        prompt={emoji.prompt}
        id={emoji.id}
      />
    </div>
  );
}
