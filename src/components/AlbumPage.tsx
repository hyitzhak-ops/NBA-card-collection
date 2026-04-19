"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";
import type { AlbumSheetItem } from "@/hooks/useLocalCollection";

type AlbumPageProps = {
  pages: AlbumSheetItem[];
  adminMode: boolean;
  onRemove?: (id: string) => void;
  onExpand?: (imageUrl: string) => void;
  current: number;
  onPrev: () => void;
  onNext: () => void;
};

export function AlbumPage({
  pages,
  adminMode,
  onRemove,
  onExpand,
  current,
  onPrev,
  onNext,
}: AlbumPageProps) {
  const { t } = useTranslation();
  const total = pages.length;
  const active = total > 0 ? pages[Math.min(current, total - 1)] : null;

  if (total === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-[min(50vh,320px)] flex-col items-center justify-center rounded-2xl border border-dashed border-amber-500/25 bg-black/30 px-4 py-16 text-center text-zinc-500 sm:px-6"
      >
        <p className="max-w-md text-sm leading-relaxed">{t("noAlbumPagesYet")}</p>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[min(100%,1200px)] flex-col gap-4 sm:gap-6">
      <div className="space-y-2 px-1 text-center sm:px-2">
        <p className="text-sm text-zinc-500">{t("flipAlbumHint")}</p>
        <p className="text-xs text-zinc-600">{t("zoomHint")}</p>
      </div>

      <div
        className="relative mx-auto w-full px-1 sm:px-3"
        style={{ perspective: "1400px" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {active ? (
            <motion.div
              key={active.id}
              initial={{ rotateY: -88, opacity: 0, x: -40 }}
              animate={{ rotateY: 0, opacity: 1, x: 0 }}
              exit={{ rotateY: 88, opacity: 0, x: 40 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="relative w-full rounded-2xl border border-amber-500/25 bg-zinc-950/50 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.9)]"
              style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
            >
              <button
                type="button"
                onClick={() => onExpand?.(active.imageUrl)}
                className="relative block w-full cursor-zoom-in rounded-2xl border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                aria-label={t("tapToExpand")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.imageUrl}
                  alt=""
                  className="mx-auto block max-h-[min(82svh,900px)] w-full max-w-full rounded-2xl object-contain"
                />
              </button>
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />
              {adminMode && onRemove ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(active.id);
                  }}
                  className="absolute end-2 top-2 z-20 rounded-full border border-red-500/40 bg-black/80 px-3 py-1.5 text-xs font-medium text-red-200 backdrop-blur-sm hover:bg-red-950/60 sm:end-3 sm:top-3"
                >
                  {t("removePage")}
                </button>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 px-1 sm:gap-4">
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onPrev}
          disabled={current <= 0}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full border border-amber-500/30 bg-zinc-950/80 px-4 py-2 text-sm text-amber-100/90 shadow-lg backdrop-blur-sm transition enabled:hover:border-amber-400/50 enabled:hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">{t("prevPage")}</span>
        </motion.button>
        <span className="min-w-[120px] text-center text-sm tabular-nums text-zinc-400">
          {t("pageOf", { current: current + 1, total })}
        </span>
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          disabled={current >= total - 1}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full border border-amber-500/30 bg-zinc-950/80 px-4 py-2 text-sm text-amber-100/90 shadow-lg backdrop-blur-sm transition enabled:hover:border-amber-400/50 enabled:hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">{t("nextPage")}</span>
          <ChevronRight className="h-4 w-4 shrink-0" />
        </motion.button>
      </div>
    </div>
  );
}
