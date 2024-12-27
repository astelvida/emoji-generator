import { EmojiCard } from "@/components/emoji-card";
import { EmojisGrid } from "@/components/emoji-grid";
import { getEmoji, getEmojiWithLikeStatus } from "@/db/queries";
import { notFound } from "next/navigation";

type EmojiPage = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: EmojiPage) {
  const { id } = await params;

  const { emoji, isLiked } = await getEmojiWithLikeStatus(id);

  if (!emoji) {
    return notFound();
  }

  return (
    <>
      <EmojiCard emoji={emoji} isLiked={isLiked} />
      <EmojisGrid />
    </>
  );
}
