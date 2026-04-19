"use client";

import { motion } from "framer-motion";
import {
  FolderOpen,
  ImagePlus,
  LayoutGrid,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "@/context/TranslationContext";
import type { AlbumSheetItem, CardItem } from "@/hooks/useLocalCollection";

type AdminPanelProps = {
  adminMode: boolean;
  onAddCard: (item: CardItem) => void;
  onAddAlbumPage: (item: AlbumSheetItem) => void;
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
  onVideoFile: (file: File) => void | Promise<void>;
  onClearVideo: () => void | Promise<void>;
  hasVideo: boolean;
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function AdminPanel({
  adminMode,
  onAddCard,
  onAddAlbumPage,
  videoUrl,
  onVideoUrlChange,
  onVideoFile,
  onClearVideo,
  hasVideo,
}: AdminPanelProps) {
  const { t } = useTranslation();
  const cardInputRef = useRef<HTMLInputElement>(null);
  const sheetInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [cardTitle, setCardTitle] = useState("");

  if (!adminMode) return null;

  const handleCardFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const imageUrl = await readFileAsDataUrl(file);
      onAddCard({
        id: crypto.randomUUID(),
        imageUrl,
        title: cardTitle.trim() || undefined,
      });
    }
    setCardTitle("");
    if (cardInputRef.current) cardInputRef.current.value = "";
  };

  const handleSheetFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const imageUrl = await readFileAsDataUrl(file);
      onAddAlbumPage({
        id: crypto.randomUUID(),
        imageUrl,
      });
    }
    if (sheetInputRef.current) sheetInputRef.current.value = "";
  };

  const handleVideoFile = (files: FileList | null) => {
    const f = files?.[0];
    if (!f || !f.type.startsWith("video/")) return;
    void onVideoFile(f);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto mb-10 max-w-3xl rounded-2xl border border-amber-500/25 bg-black/50 p-5 shadow-xl backdrop-blur-md"
    >
      <div className="mb-4 flex items-center gap-2 text-amber-200/90">
        <LayoutGrid className="h-5 w-5" aria-hidden />
        <h2 className="text-base font-semibold tracking-tight">
          {t("manageCollection")}
        </h2>
      </div>
      <p className="mb-4 text-xs text-zinc-500">{t("uploadHint")}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-200">
            <ImagePlus className="h-4 w-4 text-amber-500/80" />
            {t("singleCards")}
          </div>
          <label className="mb-2 block text-xs text-zinc-500">
            {t("cardTitleOptional")}
            <input
              type="text"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-800 bg-black/60 px-3 py-2 text-sm text-zinc-100 outline-none ring-amber-500/0 transition focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20"
            />
          </label>
          <input
            ref={cardInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => void handleCardFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => cardInputRef.current?.click()}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-100 transition hover:bg-amber-500/20"
          >
            <Plus className="h-4 w-4" />
            {t("addCard")}
          </button>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-200">
            <FolderOpen className="h-4 w-4 text-amber-500/80" />
            {t("albumPages")}
          </div>
          <p className="mb-3 text-xs leading-relaxed text-zinc-500">
            {t("flipAlbumHint")}
          </p>
          <input
            ref={sheetInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => void handleSheetFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => sheetInputRef.current?.click()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-100 transition hover:bg-amber-500/20"
          >
            <Plus className="h-4 w-4" />
            {t("uploadPage")}
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-200">
          <Video className="h-4 w-4 text-amber-500/80" aria-hidden />
          {t("videoSectionTitle")}
        </div>
        <p className="mb-3 text-xs leading-relaxed text-zinc-500">{t("videoHint")}</p>
        <label className="mb-2 block text-xs text-zinc-500">
          {t("videoUrlLabel")}
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => onVideoUrlChange(e.target.value)}
            placeholder={t("videoUrlPlaceholder")}
            className="mt-1 w-full rounded-lg border border-zinc-800 bg-black/60 px-3 py-2 text-sm text-zinc-100 outline-none ring-amber-500/0 transition focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20"
          />
        </label>
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => handleVideoFile(e.target.files)}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-100 transition hover:bg-amber-500/20 min-[360px]:flex-none"
          >
            <Plus className="h-4 w-4" />
            {t("uploadVideoFile")}
          </button>
          {hasVideo ? (
            <button
              type="button"
              onClick={() => void onClearVideo()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/35 bg-red-950/30 px-4 py-2.5 text-sm font-medium text-red-200 transition hover:bg-red-950/50"
            >
              <Trash2 className="h-4 w-4" />
              {t("removeVideo")}
            </button>
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}
