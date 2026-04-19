"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "@/context/TranslationContext";

type ImageLightboxProps = {
  open: boolean;
  src: string;
  title?: string;
  onClose: () => void;
};

export function ImageLightbox({
  open,
  src,
  title,
  onClose,
}: ImageLightboxProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Client-only: portal target must exist after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {open && src ? (
        <motion.div
          key={src}
          role="dialog"
          aria-modal="true"
          aria-label={title ?? t("tapToExpand")}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            aria-label={t("close")}
            className="absolute inset-0 bg-black/88 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative z-10 flex max-h-[100dvh] w-full max-w-[min(100vw-1.5rem,1200px)] flex-col items-center justify-center"
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex w-full max-w-full items-start justify-between gap-3 px-0.5 sm:px-0">
              {title ? (
                <p className="min-w-0 flex-1 truncate ps-1 text-center text-sm font-medium text-amber-100/95 sm:text-base">
                  {title}
                </p>
              ) : (
                <span className="flex-1" />
              )}
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full border border-amber-500/35 bg-zinc-950/90 p-2 text-amber-100 shadow-lg transition hover:bg-zinc-900"
                aria-label={t("close")}
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="max-h-[min(82dvh,82svh)] w-auto max-w-full rounded-xl border border-amber-500/25 object-contain shadow-[0_20px_80px_-20px_rgba(0,0,0,0.95)]"
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
