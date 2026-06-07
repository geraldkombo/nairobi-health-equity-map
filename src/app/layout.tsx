import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL("https://geraldkombo.github.io/kenya-health-equity-map"),
  title: {
    default: "Kenya Health Equity Map",
    template: "%s | Kenya Health Equity Map",
  },
  description:
    "A map based civic intelligence platform visualising health access inequities across Kenya's 47 counties using transparent open data.",
  openGraph: {
    title: "Kenya Health Equity Map",
    description:
      "Visualise health-access inequities across Kenya's 47 counties using transparent open data.",
    url: "https://geraldkombo.github.io/kenya-health-equity-map",
    locale: "en_KE",
    siteName: "Kenya Health Equity Map",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenya Health Equity Map",
    description: "Visualise health-access inequities across Kenya's 47 counties.",
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
