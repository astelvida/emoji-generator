import { updateEmoji } from "@/db/queries";
import Replicate from "replicate";
import { put } from "@vercel/blob";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const id = searchParams.get("id") as string;

    // get output from Replicate
    const body = await req.json();
    const { output } = body;

    if (!output) return Response.json({ error: "No output" }, { status: 400 });

    const rmbgOutput = await replicate.run(
      "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
      // "lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1",
      { input: { image: output[0] } }
    );

    // convert output to a blob object
    const noBgFile = await fetch(rmbgOutput.toString()).then((res) => res.blob());
    const { url } = await put(`${id}.png`, noBgFile, { access: "public" });
    // update emoji
    await updateEmoji(id, {
      imageUrl: url,
      status: "generated",
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false }, { status: 500 });
  }
}
