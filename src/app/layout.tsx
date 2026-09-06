import type { CSSProperties } from "react";
import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-store";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTransition } from "@/components/PageTransition";
import { SITE_NAME, SITE_URL, absolute, asset } from "@/lib/site";

// Variable, so the optical-size axis is available: .u-display sets opsz by hand
// rather than letting the browser scale one static cut to every size.
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bodoni",
  axes: ["opsz"],
});

const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
  // 400 for body, 500 for buttons and eyebrows. 300 is unused.
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: {
    default: "ORBIS — Luxury watches from another world",
    template: "%s · ORBIS",
  },
  description:
    "ORBIS builds mechanical objects for people who look up. MILLENIUM, the first collection: one cushion case, five readings of the same orb.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_GB",
    url: "/",
    title: "ORBIS — Luxury watches from another world",
    description: "MILLENIUM, the first ORBIS collection. Five dials. One orbit.",
    images: [{ url: "/products/millenium/onyx/lifestyle.webp", width: 1400, height: 1750, alt: "ORBIS MILLENIUM Onyx" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ORBIS — Luxury watches from another world",
    description: "MILLENIUM, the first ORBIS collection. Five dials. One orbit.",
    images: ["/products/millenium/onyx/lifestyle.webp"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodoni.variable} ${jost.variable}`}>
      <body style={{ "--plate": `url("${asset("/world/orbit-plate.webp")}")` } as CSSProperties}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
              logo: absolute("/icon.svg"),
              description:
                "ORBIS builds mechanical objects for people who look up. MILLENIUM is the first collection.",
            }),
          }}
        />
        <CartProvider>
          <a
            href="#main"
            className="u-focus sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-2 focus:text-sm focus:text-void"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main">
            <PageTransition>{children}</PageTransition>
          </main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
