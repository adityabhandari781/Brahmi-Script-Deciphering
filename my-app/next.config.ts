import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: false,
  images: {
    remotePatterns : [{
      hostname: "wdwggctkfqlllckrbnta.supabase.co"
    }]
  }
};

export default nextConfig;
