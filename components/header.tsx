import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";
import Github from "@/components/icons/Github";
import { EmojiSearch } from "@/components/emoji-search";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background mx-auto ">
      <div className="rounded-xl bg-background shadow-lg">
        <div className="flex h-16 items-center gap-4 px-4">
          <nav className="ml-4 flex items-center gap-4">
            <Link href="/" className="font-medium hover:text-primary">
              Emoji Generator
            </Link>
          
            <Link href="/search" className="font-medium hover:text-primary">
              Search
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-6">
            <ModeToggle />
            <Github />
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        <EmojiSearch placeholder="Search and download AI emojis" />
      </div>
    </header>
  );
}
