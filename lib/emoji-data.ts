export interface EmojiData {
  slug: string;
  id: string;
  imageUrl: string;
  prompt: string;
  creator?: {
    username: string;
    avatarUrl: string;
  };
}

export const emojiData: EmojiData[] = [
  {
    slug: "hug-blonde-and-brunette-girls-R2PNOYLRxR",
    id: "R2PNOYLRxR",
    imageUrl: "https://attic.sh/mhrnrvy34alchn82gg6to857glm7",
    prompt: "hug blonde and brunette girls",
    creator: {
      username: "emojiartist",
      avatarUrl: "/placeholder.svg",
    },
  },
  {
    slug: "hug-blonde-and-brunette-girls-nX9BCiDqiX",
    id: "nX9BCiDqiX",
    imageUrl: "https://attic.sh/yfg18znyfkygnau11ko0mydbkw7s",
    prompt: "hug blonde and brunette girls",
    creator: {
      username: "emojicreator",
      avatarUrl: "/placeholder.svg",
    },
  },
  {
    slug: "pregnant-woman-IyTd1ueFQ5U",
    id: "gid://851/Emojis::Emoji/IyTd1ueFQ5U",
    imageUrl: "https://attic.sh/9yuuw3n9bxrc6vnozjig2ms0wtlk",
    prompt: "Pregnant woman",
    creator: {
      username: "emojicreator",
      avatarUrl: "/placeholder.svg",
    },
  },
  {
    slug: "brunette-sister-and-blonde-sister-YSy5mpGoBlS",
    id: "YSy5mpGoBlS",
    imageUrl: "https://attic.sh/y96yd7kl2i1xz9gxkv95ujn8y4et",
    prompt: "Brunette sister and blonde sister ",
    creator: {
      username: "emojicreator",
      avatarUrl: "/placeholder.svg",
    },
  },
  {
    slug: "orange-icing-birthday-cake-with-candles-in-a-circle-aZd0KZJ0Qhw",
    id: "aZd0KZJ0Qhw",
    imageUrl: "https://attic.sh/ue5iawjk1sz520maw7ib1unx1t8j",
    prompt: "orange icing birthday cake with candles in a circle",
    creator: {
      username: "emojicreator",
      avatarUrl: "/placeholder.svg",
    },
  },
  {
    slug: "amsterdam-city-wbsNexsR2Y2",
    id: "wbsNexsR2Y2",
    imageUrl: "https://attic.sh/bko11iien1led3e6gxxcnadjrt00",
    prompt: "Amsterdam City ",
    creator: {
      username: "emojicreator",
      avatarUrl: "/placeholder.svg",
    },
  },
  {
    slug: "glitter-pumpkin-tPomcbj8YeV",
    id: "tPomcbj8YeV",
    imageUrl: "https://attic.sh/nkxp266847lw4je38aofjaqo8cuy",
    prompt: "glitter pumpkin",
    creator: {
      username: "emojicreator",
      avatarUrl: "/placeholder.svg",
    },
  },
  // ... (include all other emoji data here)
];
