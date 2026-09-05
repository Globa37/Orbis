import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-store";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bodoni",
  weight: ["400", "500"],
});

const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://orbis.watch"),
  title: {
    default: "ORBIS — Luxury watches from another world",
    template: "%s · ORBIS",
  },
  description:
    "ORBIS builds mechanical objects for people who look up. MILLENIUM, the first collection: one cushion case, five readings of the same orb.",
  openGraph: {
    type: "website",
    siteName: "ORBIS",
    title: "ORBIS — Luxury watches from another world",
    description: "MILLENIUM, the first ORBIS collection. Five dials. One orbit.",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodoni.variable} ${jost.variable}`}>
      <body>
        <CartProvider>
          <a
            href="#main"
            className="u-focus sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-2 focus:text-sm focus:text-void"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
