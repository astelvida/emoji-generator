import { EmojiCard } from "@/components/emoji-card";
import { RelevantEmojisGrid } from "@/components/relevant-emojis";

type EmojiPage = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: EmojiPage) {
  const { id } = await params;

  return (
    <>
      <EmojiCard id={id} />
      <RelevantEmojisGrid emojiId={id} />
    </>
  );
}
