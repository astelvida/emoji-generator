"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowUpRight, Loader2, Shuffle } from "lucide-react";
import { useRef, useEffect, useState, useTransition } from "react";
import { generateStart } from "@/server/actions";
import React from "react";
import { emojiPrompts } from "./data";
import { useRouter } from "next/navigation";

export function EmojiForm() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sampleEmojiPrompts, setSampleEmojiPrompts] = useState<string[]>([]);
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const randomPrompts = emojiPrompts
      .map((prompt) => prompt.toLowerCase())
      .sort(() => 0.5 - Math.random());

    setSampleEmojiPrompts(randomPrompts);
    updatePrompt(randomPrompts[21]);
  }, []);

  function updatePrompt(prompt: string) {
    if (textareaRef.current) {
      textareaRef.current.value = prompt;
      textareaRef.current.focus();
    }
  }

  const randomizePrompt = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const randomIndex = Math.floor(Math.random() * emojiPrompts.length);
    const randomPrompt = emojiPrompts[randomIndex];
    updatePrompt(randomPrompt);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          defaultValue={textareaRef.current?.value || ""}
          name="prompt"
          id="prompt"
          placeholder="Describe your emoji in detail..."
          className="min-h-[60px] pr-24 resize-none"
        />
        <div className="absolute right-2 top-2 flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full hover:bg-muted"
            onClick={randomizePrompt}
          >
            <Shuffle className="h-4 w-4" />
            <span className="sr-only">Randomize prompt</span>
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full"
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                const id = await generateStart(textareaRef.current?.value || "");
                router.push(`/emoji/${id}`);
              });
            }}
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            <span className="sr-only">Generate</span>
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {sampleEmojiPrompts.slice(0, 5).map((suggestion) => (
              <Button
                variant="outline"
                key={suggestion}
                className="text-sm h-8 truncate max-w-[300px]"
                onClick={(e) => {
                  e.preventDefault();
                  updatePrompt(suggestion);
                }}
              >
                {suggestion}
                <ArrowUpRight className="h-3 w-3" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
