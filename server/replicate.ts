"use server";

import { EMOJI_SIZE } from "@/lib/constants";
import { WEBHOOK_URL } from "@/lib/constants";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  // useFileOutput: false,
});



function normalizePrompt(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .replace(/\bemoji\b/gi, "") // Remove the word "emoji" (case insensitive)
    .replace(/^a\s+/i, "") // Remove "a" only if it's at the start
    .trim(); // Final trim to remove any remaining spaces
}

export async function generateEmoji({
  id,
  prompt,
}: {
  id: string;
  prompt: string;
}) {
  const webhook = new URL(`${WEBHOOK_URL}/api/webhooks/remove-bg`);
  webhook.searchParams.set("id", id);

  const cleanedInput = normalizePrompt(prompt);

  const inputPrompt = `A TOK emoji of ${cleanedInput}, white background`;

  console.log("inputPrompt\n", inputPrompt);
  return replicate.predictions.create({
    version: "dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
    input: {
      width: EMOJI_SIZE,
      height: EMOJI_SIZE,
      prompt: inputPrompt,
      num_outputs: 1,
      disable_safety_checker: true,
      // negative_prompt: "soft, blurry, low quality, underexposed, realistic",

    },
    webhook: webhook.toString(),
    webhook_events_filter: ["completed"],
  });
}
