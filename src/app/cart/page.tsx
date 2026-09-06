import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Bag",
  description: "Your ORBIS bag.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/cart" },
};

export default function CartPage() {
  return (
    <div className="u-gutter pb-24 pt-32 lg:pt-40">
      <h1 className="u-display text-[clamp(2.5rem,8vw,5.5rem)]">Bag</h1>
      <CartView />
    </div>
  );
}
