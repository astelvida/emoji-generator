import { EmojiForm } from "@/components/emoji-form";
import { EmojiCount } from "@/components/emoji-count";
import { ExploreEmojisGrid } from "@/components/explore-emojis";
import { currentUser } from "@clerk/nextjs/server";
import { createUser } from "@/db/queries";
import { getUserById } from "@/db/queries";

export default async function HomePage() {
  const currUser = await currentUser();
  const user = await getUserById(currUser?.id || "");

  if (!user) {
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

      <ExploreEmojisGrid />
    </>
  );
}
