import { EmojisGrid, EmojisGridSkeleton } from "@/components/emoji-grid";
import { SearchQ } from "@/components/search-q";
import { Suspense } from "react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string; page: number }>;
}) {
  const { q } = await searchParams;

  return (
    <div className="flex flex-col gap-4">
      <SearchQ />
      <section className="mt-4">
        <Suspense fallback={<EmojisGridSkeleton />}>
          <EmojisGrid query={q} />
        </Suspense>
      </section>
    </div>
  );
}
