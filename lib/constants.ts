export const SITEMAP_PAGE_SIZE = 50_000;
export const EMOJI_SIZE = 512;

export const WEBHOOK_URL =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : process.env.NGROK_URL;
