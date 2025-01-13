import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getUser } from "@/db/queries";

export async function EmojiCardUser() {
  const creator = await getUser();

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={creator?.imageUrl || ""} alt={creator?.name || ""} />
        <AvatarFallback>{creator?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">@{creator?.name}</span>
    </div>
  );
}

export function EmojiCardUserSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}
