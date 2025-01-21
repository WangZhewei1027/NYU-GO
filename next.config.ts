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
};

export default nextConfig;
