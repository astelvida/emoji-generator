"use server";

import { EMOJI_SIZE } from "@/lib/constants";
import { WEBHOOK_URL } from "@/lib/constants";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  // useFileOutput: false,
});

export async function captionEmoji(imageUrl: string, prompt: string) {
  const inputPrompt = `
Write a descriptive caption of this emoji with the prompt: "${prompt}". If you can't understand the prompt or it's not intelligible ignore the prompt.
Focus on the main subject and most relevant details. Include relevant keywords, category, color, and mood if applicable.`;
  const output = await replicate.run(
    "yorickvp/llava-13b:80537f9eead1a5bfa72d5ac6ea6414379be41d4d4f6679fd776e9535d1eb58bb",
    {
      input: {
        prompt: inputPrompt,
        image: imageUrl,
        top_p: 1,
        max_tokens: 1024,
        temperature: 0.2,
      },
    }
  );
  const result = output.join("").trim();
  // console.log("CAPTION", result);
  return result;
}

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

  const inputPrompt = `A TOK emoji of a ${cleanedInput}, white background`;

  console.log("inputPrompt\n", inputPrompt);
  return replicate.predictions.create({
    version: "dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
    input: {
      width: EMOJI_SIZE,
      height: EMOJI_SIZE,
      prompt: inputPrompt,
      // refine: "expert_ensemble_refiner",
      refine: "no_refiner",
      scheduler: "K_EULER",
      lora_scale: 0.6,
      num_outputs: 1,
      guidance_scale: 7.5,
      apply_watermark: false,
      high_noise_frac: 0.8,
      // negative_prompt: "soft, blurry, low quality, underexposed, realistic",
      prompt_strength: 0.8,
      num_inference_steps: 50,
      disable_safety_checker: true,
    },
    webhook: webhook.toString(),
    webhook_events_filter: ["completed"],
  });
}

// export async function removeBackground({ id, image }: { id: string; image: string }) {
//   const webhook = new URL(`${WEBHOOK_URL}/api/webhooks/save-emoji`);
//   webhook.searchParams.set("id", id);
//   // webhook.searchParams.set("secret", process.env.API_SECRET as string);

//   return replicate.predictions.create({
//     version: "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
//     input: {
//       image,
//     },
//     webhook: webhook.toString(),
//     webhook_events_filter: ["completed"],
//   });
// }
