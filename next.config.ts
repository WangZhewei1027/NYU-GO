import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/main/track",
        permanent: true,
      },
    ];
  },
  images: {
    domains: ["picsum.photos"],
  },
  reactStrictMode: false,
};

export default nextConfig;
