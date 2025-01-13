import { EmojiForm } from "@/components/emoji-form";
import { EmojiCount } from "@/components/emoji-count";
import { EmojisGrid, EmojisGridSkeleton } from "@/components/emoji-grid";
import { currentUser } from "@clerk/nextjs/server";
import { createUser } from "@/db/queries";
import { getUserById, getUserLikedEmojis } from "@/db/queries";
import { Suspense } from "react";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { emojis } from "@/db/schema";

export default async function HomePage() {
  const currUser = await currentUser();
  const user = await getUserById(currUser?.id || "");
  // db.execute(sql`CREATE INDEX "search_index" ON "emojis" USING gin (
  //   setweight(to_tsvector('english', coalesce(${emojis.prompt}, '')), 'A') ||
  //   setweight(to_tsvector('english', coalesce(${emojis.description}, '')), 'B')
  // )`);

  if (!user && currUser) {
    console.log("user not found");
    console.log("currUser:", currUser);
    const newUser = await createUser({
      id: currUser?.id,
      name:
        `${currUser?.firstName || ""} ${currUser?.lastName || ""}`.trim() ||
        "Horse With No Name",
      email: currUser?.emailAddresses[0]?.emailAddress,
      username: currUser?.username,
      imageUrl: currUser?.imageUrl,
    });
    console.log("CREATE NEW USER:", newUser.id, newUser.name, newUser.email);
    console.log("user found");
  }

  return (
    <>
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">AI Emojis Generator</h1>
        <EmojiCount />
      </div>
      <section className="mb-6">
        <EmojiForm />
      </section>

      <section className="mt-4">
        <h2 className="text-2xl font-semibold mb-6">Recent Emojis</h2>
        <Suspense fallback={<EmojisGridSkeleton />}>
          <EmojisGrid />
        </Suspense>
      </section>
    </>
  );
}
