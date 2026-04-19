"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mail, MessageCircle, Phone, X } from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";

const EMAIL = "nba@gmail.com";
const PHONE = "+972506543876";

type ContactSellerProps = {
  open: boolean;
  onClose: () => void;
};

export function ContactSeller({ open, onClose }: ContactSellerProps) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            aria-label={t("close")}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed start-1/2 top-1/2 z-[61] w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-zinc-950 to-black p-6 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.95)]"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-amber-400" aria-hidden />
                <h2
                  id="contact-title"
                  className="text-lg font-semibold tracking-tight text-amber-50"
                >
                  {t("contactSeller")}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200"
                aria-label={t("close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-zinc-400">
              {t("salesCta")}
            </p>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-zinc-900/50 px-4 py-3 text-sm text-amber-100 transition hover:border-amber-400/40 hover:bg-zinc-900"
                >
                  <Mail className="h-4 w-4 shrink-0 text-amber-500/90" />
                  <span>
                    <span className="block text-[11px] uppercase tracking-wider text-zinc-500">
                      {t("email")}
                    </span>
                    {EMAIL}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${PHONE.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-zinc-900/50 px-4 py-3 text-sm text-amber-100 transition hover:border-amber-400/40 hover:bg-zinc-900"
                >
                  <Phone className="h-4 w-4 shrink-0 text-amber-500/90" />
                  <span>
                    <span className="block text-[11px] uppercase tracking-wider text-zinc-500">
                      {t("phone")}
                    </span>
                    {PHONE}
                  </span>
                </a>
              </li>
            </ul>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export function FloatingContactButton({
  onOpen,
}: {
  onOpen: () => void;
}) {
  const { t } = useTranslation();
  return (
    <motion.button
      type="button"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={onOpen}
      className="fixed bottom-6 end-6 z-50 flex items-center gap-2 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-700/90 to-amber-600/90 px-5 py-3 text-sm font-semibold text-black shadow-[0_12px_40px_-8px_rgba(251,191,36,0.55)] backdrop-blur-sm"
    >
      <MessageCircle className="h-4 w-4" aria-hidden />
      {t("openContact")}
    </motion.button>
  );
}
