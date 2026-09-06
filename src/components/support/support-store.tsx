"use client";

import { createContext, useContext, useMemo, useState } from "react";

/**
 * Whether the support panel is open.
 *
 * The button that opens it sits in the header and the panel itself sits beside
 * the footer, so the two cannot pass a prop between them. This is the smallest
 * thing that lets them agree.
 */
interface SupportApi {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const Ctx = createContext<SupportApi | null>(null);

export function SupportProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSupport() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSupport must be used inside SupportProvider");
  return ctx;
}
