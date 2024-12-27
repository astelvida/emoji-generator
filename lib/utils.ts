import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  10
);

export function nFormatter(num: number, digits?: number) {
  if (!num) return "0";
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
    : "0";
}

export function generateUniqueString(length: number = 12): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueString += characters[randomIndex];
  }
  return uniqueString;
}

export function roundBy(x: number, decimals: number = 1) {
  if (isNaN(Number(x))) return 0;
  return (
    Math.round(Number(x) * Math.pow(10, decimals)) / Math.pow(10, decimals)
  );
}

export const getAspectRatioClass = (ratio: string) => {
  if (ratio === "1:1") return "aspect-square";
  if (ratio === "16:9") return "aspect-video";
  if (ratio === "9:16") return "aspect-[9/16]";

  return "aspect-square";
};

export type Scale = 1 | 2 | 4 | 8 | 10;
export const baseSize = 768;

export const getDimensionsByRatio = (ratio: string, scale: Scale = 1) => {
  const [w, h] = ratio.split(":").map(Number);
  const shadcnClass = `${w} / ${h}`;
  const twClass = shadcnClass.replace(/\s+/g, "");
  const aspectRatio = w / h;
  // const scaleFactor = baseSize * scale;
  return {
    shadcnClass,
    twClass,
    aspectRatio,
    twValuesClass: `w-[${baseSize * aspectRatio * scale}px] h-[${
      baseSize * scale
    }px]`,
  };
};

export const permittedTypes = ["webp", "png", "jpg", "jpeg"];

export function getFileType(url: string) {
  const index = permittedTypes.indexOf(url.toString().split(".").pop() || "");
  if (index === -1) {
    return "OOPS";
    // throw new Error("Invalid file type");
  }
  return permittedTypes[index];
}

export function getPercentageFromLine(line: string) {
  const match = line.trim().match(/^(\d+)%/);
  return match ? match[1] : null;
}

export function extractLatestPercentage(logs: string) {
  // Split the logs into individual lines
  const lastLine = logs.trim().split("\n").pop()?.trim();
  const lastPercentage = getPercentageFromLine(lastLine || "");
  return lastPercentage;
}

// export function normalizePrompt(input: string): string {
//   const cleanedInput = input
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, " ") // Collapse multiple spaces
//     .replace(/\bemoji\b/g, "") // Remove the word "emoji"
//     .replace(/\ba\b/g, "") // Remove the word "a"
//     .trim(); // Remove extra spaces at the start and end
//   return cleanedInput;
// }

export function extractPrompt(input: string): string {
  const regex = /^(?:a )?TOK emoji of (.*?),/i;
  const match = input.match(regex);
  return match ? match[1].trim() : "??EMOJI";
}
