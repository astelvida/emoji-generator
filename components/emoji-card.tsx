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
    <div className="mx-auto flex w-full max-w-2xl flex-col flex-nowrap space-y-4">
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
      <p className="text-3xl font-bold">{emoji?.prompt}</p>
      {/* <div className="flex flex-row justify-between space-x-4"> */}
      <EmojiDisplayImage imageUrl={emoji.imageUrl} prompt={emoji.prompt} />
      {/* </div> */}
      <EmojiActionButtons
        userId={emoji.userId}
        imageUrl={emoji.imageUrl}
        prompt={emoji.prompt}
        id={emoji.id}
      />
    </div>
  );
}
