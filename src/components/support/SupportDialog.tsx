"use client";

import { useEffect, useRef, useState } from "react";
import { translator, type Lang } from "@/lib/i18n";
import { useSupport } from "./support-store";

const ATELIER = "atelier@orbis.watch";

/**
 * Writing to the atelier, without a server to write to.
 *
 * This is the provisional wiring: the form validates what the visitor typed
 * and hands it to their own mail client, prefilled. Nothing is transmitted by
 * the site, which is why it says so rather than showing a "sent" state it
 * cannot honestly claim. Swapping the submit for a POST to a form endpoint is
 * the only change needed to make it real.
 */
export function SupportDialog({ lang }: { lang: Lang }) {
  const t = translator(lang);
  const { open, setOpen } = useSupport();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ email?: string; message?: string }>({});
  const [handedOver, setHandedOver] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const firstField = useRef<HTMLInputElement>(null);

  // Escape closes, and the page behind must not scroll while this is over it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstField.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, setOpen]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: { email?: string; message?: string } = {};
    const trimmed = email.trim();
    if (!trimmed) next.email = t("emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) next.email = t("emailInvalid");
    if (!message.trim()) next.message = t("messageRequired");
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const subject = lang === "de" ? "Anfrage über orbis.watch" : "Enquiry via orbis.watch";
    const body = `${message.trim()}\n\n— ${trimmed}`;
    // A link click rather than a location assignment: handing the draft to the
    // mail client is a navigation the browser should treat as one.
    const handoff = document.createElement("a");
    handoff.href = `mailto:${ATELIER}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    handoff.click();
    setHandedOver(true);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-title"
    >
      <button
        type="button"
        aria-label={t("closeSupport")}
        onClick={() => setOpen(false)}
        className="absolute inset-0 cursor-default bg-void/80 backdrop-blur-sm"
      />

      <div
        ref={panel}
        className="relative flex max-h-[92svh] w-full max-w-lg flex-col overflow-y-auto rounded-t-lg border border-line bg-ink p-6 sm:rounded-lg sm:p-8"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="u-eyebrow">{t("support")}</p>
            <h2 id="support-title" className="u-display mt-3 text-3xl">
              {t("writeToUs")}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("closeSupport")}
            className="u-focus -mr-1 -mt-1 rounded-full p-2 text-muted transition-colors duration-300 hover:text-text"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted">{t("supportIntro")}</p>

        <form onSubmit={submit} noValidate className="mt-7 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="support-email" className="u-eyebrow">
              {t("yourEmail")}
            </label>
            <input
              ref={firstField}
              id="support-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "support-email-error" : undefined}
              className="u-focus rounded-sm border border-line bg-surface px-4 py-3 text-sm text-text placeholder:text-faint"
            />
            {errors.email && (
              <p id="support-email-error" role="alert" className="text-xs text-[#E8927C]">
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="support-message" className="u-eyebrow">
              {t("yourMessage")}
            </label>
            <textarea
              id="support-message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("messagePlaceholder")}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? "support-message-error" : undefined}
              className="u-focus resize-y rounded-sm border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-text placeholder:text-faint"
            />
            {errors.message && (
              <p id="support-message-error" role="alert" className="text-xs text-[#E8927C]">
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="u-focus rounded-full bg-text px-6 py-4 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-void transition-colors duration-300 hover:bg-white"
          >
            {t("sendMessage")}
          </button>
        </form>

        {handedOver && (
          <p role="status" className="mt-5 text-xs leading-relaxed text-muted">
            {t("supportOpened")}{" "}
            <a href={`mailto:${ATELIER}`} className="u-focus u-link text-text">
              {ATELIER}
            </a>
            .
          </p>
        )}

        <p className="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-faint">
          {t("supportProvisional")}
        </p>
      </div>
    </div>
  );
}
