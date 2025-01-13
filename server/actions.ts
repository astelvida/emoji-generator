"use server";

import { createEmoji } from "@/db/queries";
import { nanoid } from "@/lib/utils";
import { generateEmoji } from "./replicate";

export async function generateStart(prompt: string) {
  const id = nanoid();

  try {
    const [createdEmoji, generatedEmoji] = await Promise.all([
      createEmoji({ id, prompt }),
      generateEmoji({ id, prompt }),
    ]);


    console.log("createdEmoji %O", createdEmoji);
    console.log("generatedEmoji %O", generatedEmoji);

    // return { createdEmoji, generatedEmoji };
  } catch (error) {
    console.error("Error generating emoji:", error);
    throw new Error("Error generating emoji!!!" );
  }

  return id
  
  // return id;
  // redirect(`/emoji/${id}`);  
}
