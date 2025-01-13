"use client";

import { useState } from "react";
import { Loader2, Share2, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateStart } from "@/server/actions";
import type { Emoji } from "@/db/schema";
import { usePathname } from "next/navigation";

type EmojiCardActionButtonsProps = Partial<Emoji>;

export function EmojiCardActionButtons({ imageUrl, prompt }: EmojiCardActionButtonsProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Emoji: "${prompt}"`,
          text: `Check out this awesome emoji: ${prompt}`,
          url: shareUrl,
        });
        toast({
          title: "Shared successfully!",
          description: "The emoji has been shared.",
        });
      } catch (error) {
        toast({
          title: "Sharing failed",
          description: "Unable to share or copy the link. Please try again.",
          variant: "destructive",
        });
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          toast({
            title: "Link copied!",
            description: "The emoji link has been copied to your clipboard.",
          });
        })
        .catch((error) => {
          console.error("Error copying to clipboard:", error);
          toast({
            title: "Sharing failed",
            description: "Unable to share or copy the link. Please try again.",
            variant: "destructive",
          });
        });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 justify-center">
      <form className="relative">
        <Button
          variant="secondary"
          className="w-full py-6 text-base font-medium"
          disabled={!imageUrl}
          formAction={async () => {
            await generateStart(prompt || "");
          }}
        >
          {!imageUrl ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Shuffle className="mr-2 h-5 w-5" />
          )}
          {!imageUrl ? "Generating..." : "Remix"}
        </Button>
      </form>
      <Button
        variant="secondary"
        className="w-full py-6 text-base font-medium"
        onClick={handleShare}
        disabled={!imageUrl}
      >
        <Share2 className="mr-2 h-5 w-5" />
        Share
      </Button>
    </div>
  );
}
