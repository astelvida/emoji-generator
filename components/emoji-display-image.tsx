"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { Emoji } from "@/db/schema";
import confetti from "canvas-confetti";

type EmojiDisplayImageProps = Partial<Emoji>;

export function EmojiDisplayImage({ imageUrl, prompt }: EmojiDisplayImageProps) {
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
      <div className="relative w-[400px] h-[400px] overflow-hidden rounded-2xl">
        {!imageUrl ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-lg font-semibold" />
            </div>
          </div>
        ) : (
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
