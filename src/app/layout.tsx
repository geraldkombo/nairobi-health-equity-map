import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL("https://ke-health-equity.netlify.app"),
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
    url: "https://ke-health-equity.netlify.app",
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-[100svh] bg-stone-50 text-stone-800">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
