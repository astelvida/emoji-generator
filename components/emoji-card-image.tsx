"use client";

import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Emoji } from "@/db/schema";
import confetti from "canvas-confetti";
import clsx from "clsx";
import useSWR from "swr";
import { useRouter } from "next/navigation";

type EmojiCardImageProps = Partial<Emoji>;

export function EmojiCardImage({ id, imageUrl, prompt, createdAt }: EmojiCardImageProps) {
  const [isFirstLoad, setIsFirstLoad] = useState(false);

  const router = useRouter();

  // console.log(data);
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

  // const [isLoadingImage, setIsLoadingImage] = useState(false);
  // const src = data?.imageUrl || imageUrl;
  // const showImageTag = !!src; // don't render image tag if no src
  // const showImagePlaceholder = isLoadingEmoji || isLoadingImage || !showImageTag;

  return (
    <>
      <div className="relative aspect-square w-full flex-1 self-center rounded-lg">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={prompt || ""}
            width={512}
            height={512}
            className="aspect-square object-contain"
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
            <span className="text-balance text-center text-xl font-medium">Generating...</span>
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
