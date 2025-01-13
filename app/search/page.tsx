import { EmojisGrid, EmojisGridSkeleton } from "@/components/emoji-grid";
import { Suspense } from "react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string; page: number }>;
}) {
  const { q } = await searchParams;

  return (
    <section className="mt-4">
      <Suspense fallback={<EmojisGridSkeleton />}>
        <EmojisGrid query={q} />
      </Suspense>
    </section>
  );
}
