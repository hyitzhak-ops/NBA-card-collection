"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Images,
  LayoutDashboard,
  Shield,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AlbumPage } from "@/components/AlbumPage";
import { AdminPanel } from "@/components/AdminPanel";
import { BackgroundLayer } from "@/components/BackgroundLayer";
import { Card } from "@/components/Card";
import { ImageLightbox } from "@/components/ImageLightbox";
import {
  ContactSeller,
  FloatingContactButton,
} from "@/components/ContactSeller";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MusicPlayer } from "@/components/MusicPlayer";
import { SalesBar } from "@/components/SalesBar";
import { VideoShowcase } from "@/components/VideoShowcase";
import { useTranslation } from "@/context/TranslationContext";
import { useLocalCollection } from "@/hooks/useLocalCollection";
import { useVaultVideo } from "@/hooks/useVaultVideo";

type ViewMode = "cards" | "album";

export default function Home() {
  const { t } = useTranslation();
  const {
    cards,
    albumPages,
    addCard,
    removeCard,
    addAlbumPage,
    removeAlbumPage,
    ready,
  } = useLocalCollection();
  const video = useVaultVideo();
  const [view, setView] = useState<ViewMode>("cards");
  const [adminMode, setAdminMode] = useState(false);
  const [albumIndex, setAlbumIndex] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [lightbox, setLightbox] = useState<{
    src: string;
    title?: string;
  } | null>(null);
  const reduceMotion = useReducedMotion();
  const pageRecede = Boolean(lightbox) && !reduceMotion;

  const safeAlbumIndex = useMemo(() => {
    if (albumPages.length === 0) return 0;
    return Math.min(albumIndex, albumPages.length - 1);
  }, [albumIndex, albumPages.length]);

  if (!ready || !video.ready) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#070604] text-zinc-500">
        <span
          className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500/30 border-t-amber-400"
          aria-hidden
        />
        <span className="text-xs uppercase tracking-[0.3em]">Loading</span>
      </div>
    );
  }

  return (
    <>
      <motion.div
        aria-hidden={pageRecede}
        className="min-h-screen overflow-x-hidden will-change-transform"
        initial={false}
        animate={{
          scale: pageRecede ? 0.93 : 1,
          opacity: pageRecede ? 0.86 : 1,
          filter: pageRecede ? "brightness(0.78)" : "brightness(1)",
        }}
        transition={{
          duration: 0.42,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ transformOrigin: "50% 22%" }}
      >
        <BackgroundLayer />
        <SalesBar />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex min-h-screen flex-col pb-28"
        >
        <header className="border-b border-white/5 bg-black/20 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <LayoutDashboard className="h-6 w-6 text-amber-500/90" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-500/80">
                NBA Vault
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <LanguageToggle />
              <div
                className="flex rounded-full border border-amber-500/25 bg-black/40 p-0.5"
                role="group"
              >
                <button
                  type="button"
                  onClick={() => setView("cards")}
                  className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    view === "cards"
                      ? "text-black"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {view === "cards" ? (
                    <motion.span
                      layoutId="view-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  ) : null}
                  <Images className="relative z-10 h-3.5 w-3.5" />
                  <span className="relative z-10">{t("singleCards")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setView("album")}
                  className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    view === "album"
                      ? "text-black"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {view === "album" ? (
                    <motion.span
                      layoutId="view-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  ) : null}
                  <BookOpen className="relative z-10 h-3.5 w-3.5" />
                  <span className="relative z-10">{t("albumPages")}</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => setAdminMode((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  adminMode
                    ? "border-amber-400/60 bg-amber-500/15 text-amber-100"
                    : "border-zinc-700 bg-zinc-950/60 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                <Shield className="h-3.5 w-3.5" aria-hidden />
                {adminMode ? t("exitAdmin") : t("adminMode")}
              </button>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-4 pb-8 pt-12 text-center sm:pt-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-amber-50 sm:text-5xl md:text-6xl"
          >
            {t("heroTitle")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="mx-auto mt-4 max-w-2xl text-base text-zinc-400 sm:text-lg"
          >
            {t("heroSubtitle")}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mx-auto mt-8 max-w-3xl rounded-2xl border border-amber-500/20 bg-black/35 px-5 py-4 text-sm leading-relaxed text-amber-100/85 shadow-inner backdrop-blur-sm sm:text-[15px]"
          >
            {t("marketingLine")}
          </motion.p>
        </section>

        <VideoShowcase
          url={video.url}
          blobUrl={video.blobUrl}
          adminMode={adminMode}
        />

        <AdminPanel
          adminMode={adminMode}
          onAddCard={addCard}
          onAddAlbumPage={addAlbumPage}
          videoUrl={video.url}
          onVideoUrlChange={video.setVideoUrl}
          onVideoFile={(f) => void video.setVideoFile(f)}
          onClearVideo={() => void video.clearVideo()}
          hasVideo={video.hasVideo}
        />

        <div className="mx-auto w-full max-w-6xl flex-1 px-3 pb-16 sm:px-4 md:px-6">
          <AnimatePresence mode="wait">
            {view === "cards" ? (
              <motion.div
                key="cards"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.35 }}
              >
                {cards.length === 0 ? (
                  <p className="py-16 text-center text-sm text-zinc-500">
                    {t("noCardsYet")}
                  </p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-center text-xs text-zinc-600 sm:text-sm">
                      {t("zoomHint")}
                    </p>
                    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 md:gap-8">
                      <AnimatePresence mode="popLayout">
                        {cards.map((item) => (
                          <li key={item.id} className="flex justify-center">
                            <Card
                              item={item}
                              adminMode={adminMode}
                              onRemove={removeCard}
                              removeLabel={t("removeCard")}
                              expandLabel={t("tapToExpand")}
                              onExpand={() =>
                                setLightbox({
                                  src: item.imageUrl,
                                  title: item.title,
                                })
                              }
                            />
                          </li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="album"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
              >
                <AlbumPage
                  pages={albumPages}
                  adminMode={adminMode}
                  onRemove={removeAlbumPage}
                  onExpand={(src) => setLightbox({ src })}
                  current={safeAlbumIndex}
                  onPrev={() => {
                    setAlbumIndex((i) => {
                      const max = Math.max(0, albumPages.length - 1);
                      const cur = Math.min(i, max);
                      return Math.max(0, cur - 1);
                    });
                  }}
                  onNext={() => {
                    setAlbumIndex((i) => {
                      const max = Math.max(0, albumPages.length - 1);
                      const cur = Math.min(i, max);
                      return Math.min(max, cur + 1);
                    });
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <section className="mx-auto max-w-6xl px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-amber-500/15 bg-gradient-to-br from-zinc-950/80 to-black/60 p-6 sm:p-8"
          >
            <h2 className="mb-2 text-center font-[family-name:var(--font-display)] text-xl text-amber-100/95 sm:text-2xl">
              {t("trustTitle")}
            </h2>
            <p className="text-center text-sm text-zinc-400">{t("salesCta")}</p>
          </motion.div>
        </section>
        </motion.main>
      </motion.div>

      <FloatingContactButton onOpen={() => setContactOpen(true)} />
      <ContactSeller open={contactOpen} onClose={() => setContactOpen(false)} />
      <ImageLightbox
        open={lightbox !== null}
        src={lightbox?.src ?? ""}
        title={lightbox?.title}
        onClose={() => setLightbox(null)}
      />
      <MusicPlayer />
    </>
  );
}
