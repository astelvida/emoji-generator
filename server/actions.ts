"use server";

import { createEmoji } from "@/db/queries";
import { nanoid } from "@/lib/utils";
import { generateEmoji } from "./replicate";
import slugify from "slugify";

export async function generateStart(prompt: string) {
  const id = nanoid();
  const slug = slugify(prompt + "-" + id);

  try {
    await Promise.all([createEmoji({ id, prompt, slug }), generateEmoji({ id, prompt, slug })]);
  } catch (error) {
    console.error("Error generating emoji:", error);
    throw new Error("Error generating emoji!!!");
  }

  return id;
}
