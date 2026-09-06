"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState,
} from "react";
import type { Localized } from "@/lib/i18n";

export interface CartLine {
  id: string;
  collectionSlug: string;
  productSlug: string;
  name: string;
  collectionName: string;
  subtitle: Localized;
  reference: string;
  priceCents: number;
  image: string;
  qty: number;
}

type Action =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; line: Omit<CartLine, "qty">; qty: number }
  | { type: "setQty"; id: string; qty: number }
  | { type: "remove"; id: string }
  | { type: "clear" };

/*
 * v2: a line's subtitle used to be one string and is now a pair, one reading
 * per language. A v1 bag left in a browser would render an object where the
 * subtitle goes, so the key moves rather than trying to migrate it — an
 * abandoned bag is a smaller loss than a broken one.
 */
const STORAGE_KEY = "orbis.cart.v2";

/** Ten per reference. Small series, and a guard against a stuck key. */
export const MAX_QTY = 10;

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "hydrate":
      return action.lines;
    case "add": {
      const existing = state.find((l) => l.id === action.line.id);
      if (existing) {
        return state.map((l) =>
          l.id === action.line.id ? { ...l, qty: Math.min(MAX_QTY, l.qty + action.qty) } : l
        );
      }
      return [...state, { ...action.line, qty: action.qty }];
    }
    case "setQty":
      return action.qty <= 0
        ? state.filter((l) => l.id !== action.id)
        : state.map((l) => (l.id === action.id ? { ...l, qty: Math.min(MAX_QTY, action.qty) } : l));
    case "remove":
      return state.filter((l) => l.id !== action.id);
    case "clear":
      return [];
  }
}

interface CartApi {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  /** VAT already contained in the subtotal, at the German rate. */
  vatCents: number;
  atMax: boolean;
  ready: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  // Rehydrate after paint so the server and client markup match.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) dispatch({ type: "hydrate", lines: parsed });
        }
      } catch {
        /* A blocked or corrupt store just means an empty cart. */
      }
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* Storage may be unavailable; the cart still works for this session. */
    }
  }, [lines, ready]);

  const add = useCallback((line: Omit<CartLine, "qty">, qty = 1) => {
    dispatch({ type: "add", line, qty });
    setOpen(true);
  }, []);

  const value = useMemo<CartApi>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotalCents = lines.reduce((n, l) => n + l.qty * l.priceCents, 0);
    return {
      lines,
      count,
      subtotalCents,
      // Prices are quoted inclusive, so this is the share already in them.
      vatCents: Math.round((subtotalCents * 19) / 119),
      atMax: lines.some((l) => l.qty >= MAX_QTY),
      ready,
      open,
      setOpen,
      add,
      setQty: (id, qty) => dispatch({ type: "setQty", id, qty }),
      remove: (id) => dispatch({ type: "remove", id }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [lines, ready, open, add]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
