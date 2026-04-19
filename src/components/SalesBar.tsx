"use client";

import { motion } from "framer-motion";
import { Award, Package, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";

const iconClass = "h-4 w-4 shrink-0 text-amber-400/90";

export function SalesBar() {
  const { t } = useTranslation();

  const items = [
    { key: "mintCondition" as const, icon: Sparkles },
    { key: "carefullyPreserved" as const, icon: Package },
    { key: "authenticityGuaranteed" as const, icon: ShieldCheck },
  ];

  return (
    <motion.div
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="sticky top-0 z-40 border-b border-amber-500/15 bg-[linear-gradient(90deg,rgba(12,10,8,0.92),rgba(24,18,12,0.92),rgba(12,10,8,0.92))] backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-start">
          {items.map(({ key, icon: Icon }, i) => (
            <motion.span
              key={key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/90 sm:text-[11px]"
            >
              <Icon className={iconClass} aria-hidden />
              {t(key)}
            </motion.span>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 text-center sm:justify-end">
          <Award className="h-4 w-4 text-amber-500/80" aria-hidden />
          <p className="max-w-xl text-xs leading-snug text-zinc-300 sm:text-right sm:text-[13px]">
            {t("bulkDiscount")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
