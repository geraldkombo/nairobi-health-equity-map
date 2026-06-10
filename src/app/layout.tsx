import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import InstallPrompt from "@/components/InstallPrompt";
import { siteConfig } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
});

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
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "KHEM",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} antialiased`}>
      <head>
        <link rel="manifest" href={`${BASE}/manifest.json`} />
      </head>
      <body className="min-w-[320px] overflow-x-hidden min-h-[100svh] bg-stone-50 text-stone-800">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:p-4 focus:bg-white focus:z-50 focus:text-accent-600 focus:outline-none min-h-[44px] flex items-center">
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <InstallPrompt />
        <script
          dangerouslySetInnerHTML={{
            __html: `if("serviceWorker"in navigator){window.addEventListener("load",()=>{navigator.serviceWorker.register("${BASE}/sw.js").catch(()=>{})})}`,
          }}
        />
      </body>
    </html>
  );
}
