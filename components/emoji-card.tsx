import { EmojiCardUser } from "@/components/emoji-card-user";
import { EmojiCardImage } from "@/components/emoji-card-image";
import { EmojiCardDropdown } from "@/components/emoji-card-dropdown";
import { EmojiCardActionButtons } from "@/components/emoji-card-action-buttons";
import { Emoji } from "@/db/schema";

type EmojiCardProps = {
  emoji: Emoji & { isFavorite: boolean };
};

export async function EmojiCard({ emoji }: EmojiCardProps) {
  // const emoji = await getEmoji(id);

  const { id, slug, imageUrl, prompt, createdAt, isFavorite } = emoji;
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col flex-nowrap justify-center space-y-2">
      <div className="flex items-center justify-between">
        <EmojiCardUser />
        <EmojiCardDropdown id={id} imageUrl={imageUrl} slug={slug} isFavorite={isFavorite} />
      </div>
      <div className="flex flex-row flex-nowrap items-start justify-between">
        <h1 className="text-2xl font-bold">{prompt}</h1>
      </div>
      <EmojiCardImage id={id} imageUrl={imageUrl} prompt={prompt} createdAt={createdAt} />
      <EmojiCardActionButtons imageUrl={imageUrl} prompt={prompt} />
    </div>
  );
}
