"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";

import { Input } from "@/components/ui/input";

export const SearchQ = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  const [debouncedCallback] = useDebounce((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    router.push(`/q?${params.toString()}`);
  }, 500);

  const handleSearch = useCallback(
    (value: string) => {
      setValue(value);
      debouncedCallback(value);
    },
    [debouncedCallback]
  );

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search emojis..."
        className="pl-9"
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
};
