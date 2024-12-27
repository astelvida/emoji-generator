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

export function extractPrompt(input: string): string {
  const regex = /^(?:a )?TOK emoji of (.*?),/i;
  const match = input.match(regex);
  return match ? match[1].trim() : "??EMOJI";
}
