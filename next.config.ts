import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "utfs.io", protocol: "https" },
      { hostname: "replicate.delivery", protocol: "https" }, //pathname: '/pbxt/**',
      { hostname: "replicate.com", protocol: "https" },
      { hostname: "vercel-storage.com", protocol: "https" },
      {
        hostname: "idvk613jhus86wua.public.blob.vercel-storage.com",
        protocol: "https",
      },
      {
        hostname: "aaah0mnbncqtinas.public.blob.vercel-storage.com",
        protocol: "https",
      },
      { hostname: "attic.sh", protocol: "https" },
      {
        hostname: "brs2jtovfindocko.public.blob.vercel-storage.com",
        protocol: "https",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
