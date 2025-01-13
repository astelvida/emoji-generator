import { EmojiGrid, EmojiGridSkeleton } from "@/components/emoji-grid";
import { Suspense } from "react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string; page: number }>;
}) {
  const { q } = await searchParams;

  return (
    <section className="mt-4">
      <Suspense fallback={<EmojiGridSkeleton />}>
        <EmojiGrid query={q} />
      </Suspense>
    </section>
  );
}
