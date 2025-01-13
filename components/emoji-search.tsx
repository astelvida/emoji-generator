"use client";

import { SearchIcon } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";
import { useRef, useTransition } from "react";

export function EmojiSearch({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    startTransition(() => {
      if (pathname === "/search") {
        router.replace(`/search?${params.toString()}`, { scroll: false });
      } else {
        router.push(`/search?${params.toString()}`, { scroll: false });
      }
    });
  }, 300);

  return (
    <div className="relative px-4 pb-4">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <Input
        ref={searchInputRef}
        id="search"
        defaultValue={searchParams.get("q")?.toString()}
        type="search"
        name="q"
        className="pl-10 h-12 text-lg rounded-lg border-muted-foreground/20"
        placeholder={placeholder}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (pathname === "/search") {
            handleSearch(e.target.value.trim());
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (pathname === "/search") return;
            e.preventDefault();
            handleSearch(e.currentTarget.value.trim());
          }
        }}
      />
      <SearchIcon className="absolute left-7 top-3 size-5 text-muted-foreground" />
    </div>
  );
}
