import type { Metadata } from "next";

/**
 * Central SEO configuration for NYU GO.
 *
 * The canonical site URL is read from NEXT_PUBLIC_SITE_URL so it can differ
 * between preview and production deployments. Set this in your Vercel project
 * (and .env.local) to the real production origin, e.g. https://nyugo.app
 */
export const siteConfig = {
  name: "NYU GO",
  shortName: "NYU GO",
  // Update NEXT_PUBLIC_SITE_URL in your env to the real production domain.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nyu-go.com/").replace(
    /\/$/,
    "",
  ),
  description:
    "NYU GO is a real-time NYU shuttle tracker. Follow live bus locations, smart ETAs, route maps, and schedules on a fast, installable PWA built for students.",
  locale: "en_US",
  keywords: [
    "NYU GO",
    "NYU shuttle",
    "NYU Shanghai shuttle",
    "NYU shuttle tracker",
    "real-time bus tracking",
    "shuttle ETA",
    "campus bus map",
    "NYU Shanghai transportation",
    "live bus locations",
    "shuttle schedule",
  ],
  authors: [{ name: "David Zhewei Wang" }, { name: "Chanel Shuya Feng" }],
  ogImage: "/landing/phone-hero.png",
};

/** Absolute URL helper for canonical/OG links. */
export const absoluteUrl = (path = "/") =>
  `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Build a per-page Metadata object that inherits sane SEO defaults.
 * `path` is used for the canonical URL and OpenGraph URL.
 */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  keywords,
}: {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    keywords: keywords ?? siteConfig.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: siteConfig.ogImage, alt: `${siteConfig.name} preview` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage],
    },
  };
}
