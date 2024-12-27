import { getEmoji } from "@/db/queries";
import { EmojiDisplayUser, EmojiDisplayUserSkeleton } from "@/components/emoji-display-user";
import { EmojiDisplayImage } from "@/components/emoji-display-image";
import { notFound } from "next/navigation";
import { EmojiDisplayButtons } from "./emoji-display-buttons";
import { EmojiActionButtons } from "./emoji-action-buttons";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";

type EmojiCard = {
  id: string;
};

export async function EmojiCard({ id }: EmojiCard) {
  const emoji = await getEmoji(id);

  if (!emoji) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col flex-nowrap space-y-4">
      <div className="flex items-center justify-between">
        <Suspense fallback={<EmojiDisplayUserSkeleton />}>
          <EmojiDisplayUser />
        </Suspense>
        <EmojiDisplayButtons imageUrl={emoji.imageUrl} id={emoji.id} slug={emoji.slug} />
      </div>
      <p className="text-3xl font-bold">{emoji?.prompt}</p>
      {/* <div className="flex flex-row justify-between space-x-4"> */}
      <EmojiDisplayImage imageUrl={emoji.imageUrl} prompt={emoji.prompt} />
      {/* </div> */}
      <EmojiActionButtons imageUrl={emoji.imageUrl} prompt={emoji.prompt} id={emoji.id} />
    </div>
  );
}
