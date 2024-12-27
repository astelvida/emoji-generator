"use server";

import { createEmoji } from "@/db/queries";
import { nanoid } from "@/lib/utils";
import { generateEmoji } from "./replicate";
import { redirect } from "next/navigation";

export async function generateStart(prompt: string) {
  const id = nanoid();

  try {
    await Promise.all([
      createEmoji({ id, prompt }),
      generateEmoji({ id, prompt }),
    ]);
  } catch (error) {
    console.error("Error generating emoji:", error);
    throw error;
  }

  // return id;
  redirect(`/emoji/${id}`);
}
