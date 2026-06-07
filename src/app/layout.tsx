import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { siteConfig } from "@/lib/site";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.nameWithYear,
    template: `%s | ${siteConfig.nameWithYear}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.nameWithYear,
    description: siteConfig.ogDescription,
    url: siteConfig.url,
    locale: "en_KE",
    siteName: siteConfig.nameWithYear,
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.nameWithYear,
    description: siteConfig.twitterDescription,
    images: ["/og-image.svg"],
  },
  robots: { index: true, follow: true },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Health Equity KE",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="manifest" href={`${BASE}/manifest.json`} />
        <link rel="apple-touch-icon" href={`${BASE}/icons/icon-192.png`} />
      </head>
      <body className="min-h-[100svh] bg-stone-50 text-stone-800">
        <Header />
        <main>{children}</main>
        <script
          dangerouslySetInnerHTML={{
            __html: `if("serviceWorker"in navigator){window.addEventListener("load",()=>{navigator.serviceWorker.register("${BASE}/sw.js").catch(()=>{})})}`,
          }}
        />
      </body>
    </html>
  );
}
