import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import Link from "next/link";
import { deleteEmoji } from "@/db/queries";
import { Emoji } from "@/db/schema";

export default function EmojiCardList({ emoji }: { emoji: Emoji }) {
  return (
    <div className="relative">
      <Link href={`/emoji/${emoji.id}`}>
        <img
          src={emoji.imageUrl}
          alt={emoji.prompt}
          width={200}
          height={200}
          className="w-full h-full object-contain rounded-xl"
          loading="lazy"
        />
      </Link>
      <p className="absolute bottom-2 left-2 text-xs text-muted-foreground">{emoji.prompt}</p>
      <form>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2"
          formAction={async () => {
            "use server";
            await deleteEmoji(emoji.id);
          }}
          disabled={!emoji.imageUrl}
        >
          <Trash className="h-5 w-5" />
          <span className="sr-only">Delete</span>
        </Button>
      </form>
    </div>
  );
}
