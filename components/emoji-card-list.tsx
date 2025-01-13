import { Button } from "./ui/button";
import { Trash, Heart } from "lucide-react";
import Link from "next/link";
import { deleteEmoji, toggleLike } from "@/db/queries";
import { Emoji } from "@/db/schema";
import { revalidatePath } from "next/cache";
import Image from "next/image";
interface EmojiCardListProps {
  emoji: Emoji;
}

export default function EmojiCardList({ emoji }: EmojiCardListProps) {
  return (
    <li className="relative isolate hover:bg-muted/50 transition-colors ease-out duration-300 rounded-xl overflow-hidden select-none">
      {emoji.imageUrl && <Link href={`/emoji/${emoji.id}`}>
        <Image    
          src={emoji.imageUrl || ""}
          alt={emoji.prompt || ""}
          width={200}
          height={200}
          className="w-full h-full object-contain rounded-xl" 
          loading="lazy"
        />
      </Link>}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{emoji.prompt}</p>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">
            {emoji.favoriteCount || 0}
          </span>
        </div>
      </div>
      <div className="absolute top-2 right-2 flex">
        <form>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
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
        <form>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            formAction={async () => {
              "use server";

              const newIsLiked = await toggleLike(emoji.userId, emoji.id);
              console.log("newIsLiked %O", newIsLiked);

              revalidatePath("/");
              revalidatePath(`/emoji/${emoji.id}`);
              // return newIsLiked;
            }}
          >
            <Heart
              className={`h-5 w-5 ${
                emoji.isFavorite ? "fill-primary text-primary" : ""
              }`}
            />
            <span className="sr-only">
              {emoji.isFavorite ? "Unlike" : "Like"}
            </span>
          </Button>
        </form>
      </div>
    </li>
  );
}
