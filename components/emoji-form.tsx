"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowUpRight, Loader2, Shuffle } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { generateStart } from "@/server/actions";
import React from "react";
import { emojiPrompts } from "./data";
import { generateEmojiNames } from "@/server/openai";

export function EmojiForm() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [sampleEmojiPrompts, setSampleEmojiPrompts] = useState<string[]>([]);

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
    const randomIndex = Math.floor(Math.random() * sampleEmojiPrompts.length);
    const randomPrompt = sampleEmojiPrompts[randomIndex];
    updatePrompt(randomPrompt);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form
        className="relative"
        action={async (formData) => {
          const prompt = formData.get("prompt")?.toString().trim();
          if (!prompt) return;
          await generateStart(prompt);
        }}
      >
        <Textarea
          ref={textareaRef}
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
          <SubmitButton />
        </div>
      </form>
      <Button
        variant="outline"
        onClick={async () => {
          const emojiNames = await generateEmojiNames("animals");
          emojiNames?.forEach(async (prompt: string) => generateStart(prompt));
        }}
      >
        Generate new emojis
      </Button>
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

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      size="icon"
      variant="outline"
      type="submit"
      className="h-8 w-8 rounded-full"
      disabled={pending}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ArrowRight className="h-4 w-4" />
      )}
      <span className="sr-only">Generate</span>
    </Button>
  );
};
