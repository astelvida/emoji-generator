"use server";

import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { config } from "dotenv";
config({ path: ".env" });

const openai = new OpenAI();

const EmojiInfo = z.object({
  description: z.string(),
  caption: z.string(),
  categories: z.array(z.string()),
  keywords: z.array(z.string()),
});

const systemPrompt = `Given an image of an emoji, and the prompt used to generate it, generate a concise description, a descriptive caption and relevant categories and keywords that could be used to search for the emoji. 
If the prompt does not make sense, ignore it. 
Some category examples: "smileys", "emotion", "people", "body", "animals", "nature", "food", "drink", "travel", "places", "activities", "objects", etc.
Some keyword examples: "jewelry", "eyes", "beach", "plant", "pink" "sad", "laughing", "smile", "crying", "frog", "soccer", etc.
Keep category and keywords simple and use only lower case letters.
`;

export async function generateEmojiInfo(imageUrl: string, prompt: string) {
  if (!imageUrl) throw new Error("Image URL is required");
  if (!prompt) throw new Error("Prompt is required");

  console.log("GEBERATE EMOJI INFO:", prompt);

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: imageUrl },
          },
          {
            type: "text",
            text: prompt,
          },
        ],
      },
    ],
    response_format: zodResponseFormat(EmojiInfo, "emoji_info"),
  });

  const parsed = completion.choices[0].message.parsed;
  return parsed;
}

export async function generateEmojiNames(
  category?: string,
  total: number = 40
) {
  if (!category) throw new Error("Category is required");

  const prompt = `
Generate ${total} new emoji names in the category: ${
    category || "any category"
  }.
Be descriptive and combine current emoji names. Add details such as color, mood, activity, etc.
Return only the names lowercase, no other text.
Examples: "woman with curly hair with baby", "two girls eating aubergine", "poodle with sad smile and big eyes".
output a json object containing the following information:
{
  emojiNames: string[] // Array of emoji names
}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: prompt,
      },
    ],
    response_format: {
      type: "json_object",
    },
  });

  const parsed = completion.choices[0].message.content;
  // console.log(JSON.parse(parsed)?.emojiNames);
  return JSON.parse(parsed)?.emojiNames;
}

// const  caption_system_prompt =`
// Your goal is to generate short, descriptive captions for images of ai generated emojis.
// You will be provided with an emoji image and the name of that emoji. If the name does not make sense, ignore it.
// Your generated caption should be short (1 sentence), and include only the most important information about the emoji.
// The most important information could be: the type of item, the style (if mentioned), the material or color if especially relevant and/or any distinctive features, emotion if relevant.
// `

// const imageUrl = "https://i.imgur.com/564234.png";
// const prompt = "a cat";
// generateEmojiDetails(imageUrl, prompt);

// const research_paper = completion.choices[0].message.parsed;

// categorize_system_prompt = '''
// Your goal is to extract movie categories from movie descriptions, as well as a 1-sentence summary for these movies.
// You will be provided with a movie description, and you will output a json object containing the following information:

// {
//     categories: string[] // Array¯ of categories based on the movie description,
//     summary: string // 1-sentence summary of the movie based on the movie description
// }

// Categories refer to the genre or type of the movie, like "action", "romance", "comedy", etc. Keep category names simple and use only lower case letters.
// Movies can have several categories, but try to keep it under 3-4. Only mention the categories that are the most obvious based on the description.
// '''

// def get_categories(description):
//     response = client.chat.completions.create(
//     model="gpt-4o-mini",
//     temperature=0.1,
//     # This is to enable JSON mode, making sure responses are valid json objects
//     response_format={
//         "type": "json_object"
//     },
//     messages=[
//         {
//             "role": "system",
//             "content": categorize_system_prompt
//         },
//         {
//             "role": "user",
//             "content": description
//         }
//     ],
//     )

//     return response.choices[0].message.conten

// // def get_caption(img_url, title):
// //     response = client.chat.completions.create(
// //     model="gpt-4o-mini",
// //     temperature=0.2,
// //     max_tokens=300,
// //     messages=[
// //         {
// //             "role": "system",
// //             "content": caption_system_prompt
// //         },
// //         {
// //             "role": "user",
// //             "content": [
// //                 {
// //                     "type": "text",
// //                     "text": title
// //                 },
// //                 # The content type should be "image_url" to use gpt-4-turbo's vision capabilities
// //                 {
// //                     "type": "image_url",
// //                     "image_url": {
// //                         "url": img_url
// //                     }
// //                 },
// //             ],
// //         }
// //     ]
// //     )

// //     return response.choices[0].message.content
