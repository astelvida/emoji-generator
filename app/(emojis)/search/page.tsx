import { EmojisGrid, EmojisGridSkeleton } from "@/components/emoji-grid";
import { Suspense } from "react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string; page: number }>;
}) {
  const { query } = await searchParams;

  return (
    <section className="mt-4">
      <Suspense fallback={<EmojisGridSkeleton />}>
        <EmojisGrid query={query} />
      </Suspense>
    </section>
  );
}
