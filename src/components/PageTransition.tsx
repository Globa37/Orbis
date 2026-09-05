"use client";

import { usePathname } from "next/navigation";

/**
 * A short cross-fade between routes. Keyed on the pathname so each page enters
 * cleanly; the CSS animation is disabled under prefers-reduced-motion.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="u-page">
      {children}
    </div>
  );
}
