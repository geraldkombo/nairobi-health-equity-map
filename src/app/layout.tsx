import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Kenya Health Equity Map",
  description:
    "A map based civic intelligence platform visualising health access inequities across Kenya's 47 counties using transparent open data.",
  openGraph: {
    title: "Kenya Health Equity Map",
    description:
      "Visualise health-access inequities across Kenya's 47 counties using transparent open data.",
    url: "https://ke-health-equity.netlify.app",
    locale: "en_KE",
    siteName: "Kenya Health Equity Map",
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
