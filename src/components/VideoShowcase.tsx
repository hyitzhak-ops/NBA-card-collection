"use client";

import { motion } from "framer-motion";
import { Clapperboard } from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";
import { getVimeoId, getYouTubeId } from "@/lib/youtube";

type VideoShowcaseProps = {
  url: string;
  blobUrl: string | null;
  adminMode: boolean;
};

export function VideoShowcase({ url, blobUrl, adminMode }: VideoShowcaseProps) {
  const { t } = useTranslation();
  const hasVideo = Boolean(blobUrl || url.trim());

  const yt = !blobUrl && url.trim() ? getYouTubeId(url) : null;
  const vm = !blobUrl && url.trim() && !yt ? getVimeoId(url) : null;

  return (
    <section className="mx-auto w-full max-w-5xl px-3 pb-10 sm:px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-b from-zinc-950/90 to-black/80 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.85)]"
      >
        <div className="border-b border-amber-500/15 bg-black/30 px-4 py-4 text-center sm:px-6 sm:py-5">
          <div className="mb-2 flex items-center justify-center gap-2 text-amber-400/90">
            <Clapperboard className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-amber-50 sm:text-2xl">
              {t("videoSectionTitle")}
            </h2>
          </div>
          <p className="mx-auto max-w-2xl text-sm text-zinc-400 sm:text-[15px]">
            {t("videoSectionSubtitle")}
          </p>
        </div>

        <div className="relative aspect-video w-full bg-black">
          {blobUrl ? (
            <video
              key={blobUrl}
              className="h-full w-full object-contain"
              controls
              playsInline
              preload="metadata"
              src={blobUrl}
            />
          ) : yt ? (
            <iframe
              title={t("videoSectionTitle")}
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${yt}?rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : vm ? (
            <iframe
              title={t("videoSectionTitle")}
              className="h-full w-full"
              src={`https://player.vimeo.com/video/${vm}`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : url.trim() ? (
            <video
              className="h-full w-full object-contain"
              controls
              playsInline
              preload="metadata"
              src={url.trim()}
            />
          ) : (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 px-6 text-center text-zinc-500">
              <p className="max-w-md text-sm">
                {adminMode ? t("videoEmptyAdmin") : t("videoEmptyGuest")}
              </p>
            </div>
          )}
        </div>

        {hasVideo || adminMode ? (
          <p className="border-t border-amber-500/10 px-4 py-3 text-center text-[11px] text-zinc-600 sm:text-xs">
            {t("videoFooterHint")}
          </p>
        ) : null}
      </motion.div>
    </section>
  );
}
