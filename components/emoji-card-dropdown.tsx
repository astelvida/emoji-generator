"use client";

import { Heart, MoreHorizontal, Download, Copy, Flag, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadImageWithFilename } from "@/lib/browser-utils";
import { copyToClipboard } from "@/lib/browser-utils";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteEmoji, toggleLike } from "@/db/queries";
import { useState } from "react";
import { Emoji } from "@/db/schema";

export function EmojiCardDropdown({
  imageUrl,
  id,
  slug,
  isFavorite,
}: Pick<Emoji, "imageUrl" | "id" | "slug"> & { isFavorite: boolean }) {
  const { toast } = useToast();
  const [isFavoriteState, setIsFavoriteState] = useState(isFavorite);

  const handleLike = async () => {
    setIsFavoriteState(!isFavoriteState);
    await toggleLike(id);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        variant="ghost"
        className={`rounded-full ${isFavoriteState ? "text-red-500" : ""}`}
        onClick={handleLike}
        disabled={!imageUrl}
      >
        <Heart className="h-5 w-5" fill={isFavoriteState ? "currentColor" : "none"} />
        <span className="sr-only">Like</span>
      </Button>

      <Button size="icon" variant="ghost" onClick={() => deleteEmoji(id)} disabled={!imageUrl}>
        <Trash className="h-5 w-5" />
        <span className="sr-only">Delete</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger disabled={!imageUrl} asChild>
          <Button size="icon" variant="ghost" className="rounded-full">
            <MoreHorizontal className="h-5 w-5" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            disabled={!imageUrl}
            onClick={() =>
              downloadImageWithFilename(imageUrl, `${slug}.png`)
                .then(() => toast({ description: "Emoji downloaded!" }))
                .catch(() => toast({ description: "Emoji download failed :(" }))
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!imageUrl}
            onClick={() =>
              copyToClipboard(imageUrl)
                .then(() => toast({ description: "Emoji copied to clipboard!" }))
                .catch(() => toast({ description: "Emoji copy failed :(" }))
            }
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Flag className="mr-2 h-4 w-4" />
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function EmojiDisplayButtonsSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  );
}
