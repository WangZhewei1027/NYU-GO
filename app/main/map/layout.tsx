import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Shuttle Route Map",
  description:
    "Explore NYU Shanghai shuttle routes and stops on an interactive map with color-coded lines and live bus overlays.",
  path: "/main/map",
});

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
