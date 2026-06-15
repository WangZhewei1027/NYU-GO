import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LocationUpdater from "@/components/LocationUpdater";
import Script from "next/script";
import Initialization from "@/components/Initialization";
import AIChatWidget from "@/components/AIChat/AIChatWidget";
import UpdatePopup from "@/components/UpdatePopup";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig, absoluteUrl } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "NYU GO — Real-time NYU Shanghai Shuttle Tracker",
    template: "%s · NYU GO",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: "David Zhewei Wang",
  category: "travel",
  alternates: { canonical: "/" },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    title: "NYU GO — Real-time NYU Shanghai Shuttle Tracker",
    description: siteConfig.description,
    locale: siteConfig.locale,
    images: [
      {
        url: siteConfig.ogImage,
        alt: "NYU GO app preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NYU GO — Real-time NYU Shanghai Shuttle Tracker",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#57068c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    applicationCategory: "TravelApplication",
    operatingSystem: "iOS, Android, Web",
    browserRequirements: "Requires JavaScript. Works in Safari and Chrome.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: siteConfig.authors.map((a) => ({
      "@type": "Person",
      name: a.name,
    })),
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          id="ld-webapplication"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SpeedInsights />
        <Analytics />
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-3F9SX1ZT04"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3F9SX1ZT04');
          `,
          }}
        />
        <LocationUpdater />
        <Initialization />
        <AIChatWidget />
        <UpdatePopup />
        {children}
      </body>
    </html>
  );
}
