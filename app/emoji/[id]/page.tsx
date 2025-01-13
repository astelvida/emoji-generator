import { EmojiCard } from "@/components/emoji-card";
import { EmojiGrid, EmojiGridSkeleton } from "@/components/emoji-grid";
import { getEmojiWithLikeStatus } from "@/db/queries";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type EmojiPage = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: EmojiPage) {
  const { id } = await params;
  const { emoji } = await getEmojiWithLikeStatus(id);

  if (!emoji) {
    return notFound();
  }

  return (
    <>
      <EmojiCard emoji={emoji} />

      <section className="mt-4">
        <h2 className="text-2xl font-semibold mb-6">Related Emojis</h2>
        <Suspense fallback={<EmojiGridSkeleton />}>
          <EmojiGrid emojiId={id} query={emoji.prompt} />
        </Suspense>
      </section>
    </>
  );
}
