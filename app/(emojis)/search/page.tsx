import { SearchEmojisGrid } from "@/components/search-emojis";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string; page: number }>;
}) {
  const { query } = await searchParams;

  return <SearchEmojisGrid query={query} key={query} />;
}
