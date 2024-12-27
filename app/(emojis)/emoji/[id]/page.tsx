import { EmojiCard } from "@/components/emoji-card";
import { EmojisGrid, EmojisGridSkeleton } from "@/components/emoji-grid";
import { getEmojiWithLikeStatus } from "@/db/queries";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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

      <Suspense fallback={<EmojisGridSkeleton />}>
        <EmojisGrid emojiId={id} query={emoji.prompt} />
      </Suspense>
    </>
  );
}
