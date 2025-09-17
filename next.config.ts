import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kfkobbtzhqtdfankjtqt.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  devIndicators: false,
};

export default nextConfig;
