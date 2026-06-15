import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "NYU GO — Real-time NYU Shanghai Shuttle Tracking",
  description:
    "Plan your NYU Shanghai campus commute with live shuttle locations, smart ETAs, and beautiful route maps. Fast, installable PWA built for students.",
  path: "/landing",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does NYU GO work on both iOS and Android?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. It's a progressive web app designed for Safari and Chrome. Add to Home Screen for the best experience.",
      },
    },
    {
      "@type": "Question",
      name: "Are the ETAs accurate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ETAs are updated every few seconds using live vehicle telemetry and route data. Network conditions may affect precision.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Key assets and your last viewed map are cached. Real-time features require connectivity.",
      },
    },
  ],
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
