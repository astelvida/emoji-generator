import { EmojiForm } from "@/components/emoji-form";
import { EmojiCount } from "@/components/emoji-count";
import { EmojisGrid, EmojisGridSkeleton } from "@/components/emoji-grid";
import { Suspense } from "react";

export default async function HomePage() {
  return (
    <>
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">AI Emojis Generator</h1>
        <EmojiCount />
      </div>
      <section className="mb-6">
        <EmojiForm />
      </section>

      <section className="mt-4">
        <h2 className="text-2xl font-semibold mb-6">Recent Emojis</h2>
        <Suspense fallback={<EmojisGridSkeleton />}>
          <EmojisGrid />
        </Suspense>
      </section>
    </>
  );
}
