import { getEmojiWithLikeStatus } from "@/db/queries";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(request: Request, { params }) {
  const { id } = await params;
  try {
    const { emoji, isFavorite } = await getEmojiWithLikeStatus(id);

    return NextResponse.json({ ...emoji, isFavorite }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "GET /api/emojis/[id] server error" }, { status: 500 });
  }
}
