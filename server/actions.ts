"use server";

import { createEmoji } from "@/db/queries";
import { nanoid } from "@/lib/utils";
import { generateEmoji } from "./replicate";
import { redirect } from "next/navigation";

export async function generateStart(prompt: string) {
  const id = nanoid();

  await Promise.all([createEmoji({ id, prompt }), generateEmoji({ id, prompt })]);
  // return id;
  redirect(`/emoji/${id}`);
}
