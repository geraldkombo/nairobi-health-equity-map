import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
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
        <footer className="border-t border-stone-200 py-6 px-4 print:hidden">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs text-stone-400 leading-relaxed">
              <span className="inline-flex items-center gap-1.5"><svg className="w-3.5 h-3.5 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg></span>
              No account needed &middot; No data collected
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
