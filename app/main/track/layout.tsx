import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Live Shuttle Tracking",
  description:
    "Track NYU Shanghai shuttles in real time. See live bus positions, your nearest stop, and minute-by-minute ETAs.",
  path: "/main/track",
});

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
