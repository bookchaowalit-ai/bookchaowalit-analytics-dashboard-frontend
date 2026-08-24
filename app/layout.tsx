import type { Metadata } from "next";
import { DM_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });
const dmMono = DM_Mono({ variable: "--font-dm-mono", weight: ["400", "500"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Signal Ledger — bookchaowalit",
  description: "An honest analytics dashboard shell with data provenance in view.",
  keywords: ["analytics dashboard", "bookchaowalit", "data visualization"],
  authors: [{ name: "bookchaowalit", url: "https://bookchaowalit.com" }],
  creator: "bookchaowalit",
  metadataBase: new URL("https://bookchaowalit.com"),
  alternates: { canonical: "https://bookchaowalit.com" },
  openGraph: { type: "website", locale: "en_US", url: "https://bookchaowalit.com", title: "Signal Ledger — bookchaowalit", description: "An honest analytics dashboard shell with data provenance in view.", siteName: "Signal Ledger", images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Signal Ledger" }] },
  twitter: { card: "summary_large_image", title: "Signal Ledger — bookchaowalit", description: "An honest analytics dashboard shell with data provenance in view.", images: ["/og-image.svg"], creator: "@bookchaowalit" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${spaceGrotesk.variable} ${dmMono.variable}`}>{children}</body></html>;
}
