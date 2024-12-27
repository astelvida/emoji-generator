import { getEmojiCount } from "@/db/queries";
import { Suspense } from "react";

export const CountDisplay = ({ count }: { count?: number }) => {
  return (
    <p className="text-gray-500 mb-12 text-base animate-in fade-in slide-in-from-bottom-4 duration-1200 ease-in-out">
      {count || "..."} emojis generated and counting!
    </p>
  );
};

export async function AsyncEmojiCount() {
  const count = await getEmojiCount();
  return <CountDisplay count={count} />;
}

export async function EmojiCount() {
  return (
    <Suspense fallback={<CountDisplay />}>
      <AsyncEmojiCount />
    </Suspense>
  );
}
