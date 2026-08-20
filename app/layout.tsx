import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://enthusiastreview.com"),
  title: {
    default: "EnthusiastReview — PC Hardware Buying Guides",
    template: "%s | EnthusiastReview",
  },
  description:
    "Tested, compared, and ranked PC hardware buying guides — CPU coolers, GPUs, PSUs, cases, RAM, and motherboards.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
