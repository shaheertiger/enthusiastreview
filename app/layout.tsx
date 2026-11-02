import type { Metadata, Viewport } from "next";
import "@fontsource/archivo/latin-400.css";
import "@fontsource/archivo/latin-600.css";
import "@fontsource/archivo/latin-800.css";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/data";
import "./globals.css";

const verificationOther: Record<string, string> = {};
if (process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION) verificationOther["msvalidate.01"] = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "GPU Bottleneck Finder: Best GPU for Your CPU | enthusiastreview", template: "%s | enthusiastreview" },
  description:
    "Find the best graphics card for your CPU without a bottleneck. Pick your processor, resolution, refresh rate and budget to get a matched GPU with FPS estimates.",
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: SITE.name, locale: "en_US", url: "/" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: verificationOther,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#ec3013", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
