"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize the search term from URL params
  useEffect(() => {
    const initialSearchTerm = searchParams.get("q") || "";
    setSearchTerm(initialSearchTerm);
  }, [searchParams]);

  // Update URL when search term changes
  const updateSearchParams = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set("q", term);
      } else {
        params.delete("q");
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateSearchParams(searchTerm);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    updateSearchParams(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="search"
          placeholder="Enter search term"
          value={searchTerm}
          onChange={handleInputChange}
          className="flex-grow"
          aria-label="Search term"
        />
        <button
          onClick={() => {
            setSearchTerm("WTFTFTFTFT MAN");
            updateSearchParams("WTFTFTFTFT MAN");
          }}
        >
          Set progrmaticallu
        </button>
        <Button type="submit">Search</Button>
      </form>
      <p className="mt-4">Current search term: {searchTerm || "None"}</p>
    </div>
  );
}
