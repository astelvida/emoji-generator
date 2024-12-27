import { updateEmoji } from "@/db/queries";
import { Response } from "@/server/utils";
import Replicate from "replicate";
import { extractPrompt, retrievePrompt } from "@/lib/utils";
import slugify from "slugify";
import { put } from "@vercel/blob";
import { generateEmojiInfo } from "@/server/openai";

// import { UTApi } from "uploadthing/server";
// const utapi = new UTApi();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  // useFileOutput: false,
});

export async function POST(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const id = searchParams.get("id") as string;

    // get output from Replicate
    const body = await req.json();
    const {
      output,
      input: { prompt },
    } = body;

    if (!output) return Response.badRequest("Missing output");

    const rmbgOutput = await replicate.run(
      "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
      // "lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1",
      { input: { image: output[0] } }
    );

    const cleanedPrompt = extractPrompt(prompt);
    const slug = slugify(cleanedPrompt) + "-" + id;

    // convert output to a blob object
    async function uploadOriginal() {
      const originalFile = await fetch(output[0]).then((res) => res.blob());
      const { url: originalUrl } = await put(
        `${slug}-original.png`,
        originalFile,
        {
          access: "public",
        }
      );
      return originalUrl;
    }

    async function uploadNoBackground() {
      const noBackgroundFile = await fetch(rmbgOutput.toString()).then((res) =>
        res.blob()
      );
      const { url: noBackgroundUrl } = await put(
        `${slug}-no-background.png`,
        noBackgroundFile,
        {
          access: "public",
        }
      );
      return noBackgroundUrl;
    }

    const [originalUrl, noBackgroundUrl] = await Promise.all([
      uploadOriginal(),
      uploadNoBackground(),
    ]);

    const emojiInfo = await generateEmojiInfo(noBackgroundUrl, cleanedPrompt);

    // update emoji
    const finalEmoji = await updateEmoji(id, {
      slug,
      originalUrl,
      imageUrl: noBackgroundUrl,
      ...emojiInfo,
      status: "generated",
    });

    // console.log("finalEmoji %O", finalEmoji.prompt);

    return Response.success();
  } catch (error) {
    console.error(error);
    return Response.internalServerError();
  }
}

// const files = [
//   { url: output[0], name: `${slug}-${id}-original.${imageType}` },
//   { url: rmbgOutput.url(), name: `${slug}-${id}-no-background.${imageType}` },
// ];
// // / console.log("files %O", files);
// //     // console.log("rmbgOutput %O", process.env.UPLOADTHING_TOKEN);
//     // const uploads = await utapi.uploadFilesFromUrl(files);
//     // if (uploads.some((upload) => upload.error)) {
//     //   console.error("Error uploading files", uploads[0].error);
//     //   return Response.internalServerError();
//     // }
//     // const [originalUpload, noBackgroundUpload] = uploads;

//     // console.log("finalEmoji %O", finalEmoji);
