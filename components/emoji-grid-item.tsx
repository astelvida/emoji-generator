import { Button } from "./ui/button";
import { Trash, Heart } from "lucide-react";
import Link from "next/link";
import { deleteEmoji, toggleLike } from "@/db/queries";
import { Emoji } from "@/db/schema";
import Image from "next/image";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
interface EmojiGridItemProps {
  emoji: Emoji & { isFavorite: boolean };
}

// export const dynamic = "force-dynamic";

export async function EmojiGridItem({
  emoji: { id, imageUrl, prompt, favoriteCount, isFavorite },
}: EmojiGridItemProps) {
  return (
    <li className="relative isolate hover:bg-muted/50 transition-colors ease-out duration-300 rounded-xl overflow-hidden select-none">
      {imageUrl && (
        <Link href={`/emoji/${id}`}>
          <Image
            src={imageUrl || ""}
            alt={prompt || ""}
            width={200}
            height={200}
            className="w-full h-full object-contain rounded-xl"
            loading="lazy"
          />
        </Link>
      )}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{prompt}</p>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">{favoriteCount || 0}</span>
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
              await deleteEmoji(id);
            }}
            disabled={!imageUrl}
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
              const newIsLiked = await toggleLike(id);

              // revalidatePath("/");
              // revalidatePath(`/emoji/${id}`);
              const jar = await cookies();
              jar.set("isFavorite", JSON.stringify(id + newIsLiked.toString()));
            }}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-primary text-primary" : ""}`} />
            <span className="sr-only">{isFavorite ? "Unlike" : "Like"}</span>
          </Button>
        </form>
      </div>
    </li>
  );
}
