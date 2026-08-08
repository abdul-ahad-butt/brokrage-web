import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { LegalFooter } from "../components/ui/LegalFooter";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FreightBridge — Freight Marketplace",
    template: "%s | FreightBridge",
  },
  description:
    "FreightBridge connects shippers with vetted carriers through a transparent freight marketplace. Post loads, compare bids, and book with confidence.",
  keywords: ["freight", "shipping", "load board", "carrier", "logistics", "freight broker"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "FreightBridge",
    title: "FreightBridge — Freight Marketplace",
    description:
      "Post loads, vet carriers, and book freight shipments through FreightBridge — the transparent, compliance-first freight marketplace.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col antialiased" suppressHydrationWarning>
        {children}
        {/* LegalFooter is rendered on EVERY page including portals and error pages */}
        <LegalFooter />
      </body>
    </html>
  );
}
