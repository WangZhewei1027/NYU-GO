import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // output: "export", // Disabled for Server Actions support
  // async redirects() {
  //   return [
  //     {
  //       source: "/",
  //       destination: "/main/track",
  //       permanent: true,
  //     },
  //   ];
  // },
  images: {
    domains: ["picsum.photos"],
    unoptimized: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
