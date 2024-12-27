"use client";

import { useState } from "react";
import { Share2, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateStart } from "@/server/actions";
import type { Emoji } from "@/db/schema";

type EmojiActionButtonsProps = Partial<Emoji>;

export function EmojiActionButtons({ imageUrl, prompt, id }: EmojiActionButtonsProps) {
  const [isRemixing, setIsRemixing] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/emoji/${id}`;
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

  const handleRemix = async () => {
    if (!prompt) return;

    setIsRemixing(true);
    try {
      await generateStart(prompt);
    } catch (error) {
      console.error("Error remixing:", error);
      toast({
        title: "Remix failed",
        description: "Unable to create a new emoji. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRemixing(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 justify-center">
      <Button
        variant="secondary"
        className="w-full py-6 text-base font-medium"
        onClick={handleRemix}
        disabled={isRemixing || !imageUrl}
      >
        <Shuffle className="mr-2 h-5 w-5" />
        {isRemixing ? "Remixing..." : "Remix"}
      </Button>
      <Button
        variant="secondary"
        className="w-full py-6 text-base font-medium"
        onClick={handleShare}
        disabled={isRemixing || !imageUrl}
      >
        <Share2 className="mr-2 h-5 w-5" />
        Share
      </Button>
    </div>
  );
}
