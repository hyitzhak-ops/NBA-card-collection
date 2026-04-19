"use client";

import { motion } from "framer-motion";
import { Languages } from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";
import type { Locale } from "@/lib/translations";

export function LanguageToggle() {
  const { locale, setLocale, t } = useTranslation();

  const options: { id: Locale; label: string }[] = [
    { id: "en", label: t("english") },
    { id: "he", label: t("hebrew") },
  ];

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4 text-amber-500/70" aria-hidden />
      <span className="sr-only">{t("language")}</span>
      <div
        className="flex rounded-full border border-amber-500/25 bg-black/50 p-0.5 backdrop-blur-sm"
        role="group"
        aria-label={t("language")}
      >
        {options.map(({ id, label }) => {
          const active = locale === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setLocale(id)}
              className={`relative rounded-full px-3 py-1.5 text-xs font-medium transition ${
                active ? "text-black" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {active ? (
                <motion.span
                  layoutId="lang-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              ) : null}
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
