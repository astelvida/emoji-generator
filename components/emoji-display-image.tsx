"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { Emoji } from "@/db/schema";
import confetti from "canvas-confetti";
import clsx from "clsx";

type EmojiDisplayImageProps = Partial<Emoji>;

export function EmojiDisplayImage({
  imageUrl,
  prompt,
}: EmojiDisplayImageProps) {
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!imageUrl) {
      setIsFirstLoad(true);
      interval = setInterval(() => {
        router.refresh();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [imageUrl, router]);

  return (
    <>
      <div className="relative aspect-square w-full flex-1 self-center rounded-lg">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={prompt}
            width={768}
            height={768}
            className="aspect-square object-contain"
            // priority
            onLoad={() => {
              if (isFirstLoad) {
                setIsFirstLoad(false);
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 },
                });
              }
            }}
          />
        )}

        <div
          className={clsx(
            "absolute inset-0 z-10 flex flex-row items-center justify-center gap-2 rounded-lg border bg-gray-200 p-3 transition-opacity duration-200 ease-out opacity-0",
            !imageUrl ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="flex items-center space-x-2">
            <span className="text-balance text-center text-xl font-medium">
              Generating...
            </span>
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        </div>
      </div>
    </>
  );
}

export function EmojiDisplayImageSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="w-[400px] h-[400px] mx-auto rounded-2xl" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="w-full h-[52px] rounded-lg" />
        <Skeleton className="w-full h-[52px] rounded-lg" />
      </div>
    </div>
  );
}
