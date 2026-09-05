import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-store";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTransition } from "@/components/PageTransition";
import { SITE_NAME, SITE_URL, absolute } from "@/lib/site";

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
    images: [{ url: "/products/millenium/noir/lifestyle.webp", width: 1400, height: 1750, alt: "ORBIS MILLENIUM Noir" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ORBIS — Luxury watches from another world",
    description: "MILLENIUM, the first ORBIS collection. Five dials. One orbit.",
    images: ["/products/millenium/noir/lifestyle.webp"],
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
      <body>
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
