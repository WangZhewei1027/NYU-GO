import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Getting Started Guide",
  description:
    "A quick walkthrough of NYU GO — how to track live shuttles, read ETAs, browse routes, and add the app to your home screen.",
  path: "/guide",
});

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
