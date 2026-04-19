"use client";

import { motion } from "framer-motion";
import { Music2, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "@/context/TranslationContext";

/** Served from `public/topps-and-grooves.mp3` */
export const MUSIC_TRACK_SRC = "/topps-and-grooves.mp3";

const BAR_COUNT = 5;
const STORAGE_KEY = "nba-music-off";

function readStoredOff(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "1";
}

export function MusicPlayer() {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  /** `true` = user chose silence (music off). Default `false` = music should play. */
  const [musicOff, setMusicOff] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [levels, setLevels] = useState<number[]>(() =>
    Array.from({ length: BAR_COUNT }, () => 0.22),
  );

  const musicOffRef = useRef(musicOff);

  const rafRef = useRef(0);

  useEffect(() => {
    musicOffRef.current = musicOff;
  }, [musicOff]);

  const stopViz = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  const startViz = useCallback(() => {
    const tick = (time: number) => {
      const phase = time / 1000;
      setLevels(
        Array.from({ length: BAR_COUNT }, (_, i) =>
          0.12 + 0.55 * Math.abs(Math.sin(phase * 1.5 + i * 0.85)),
        ),
      );
      rafRef.current = requestAnimationFrame(tick);
    };
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const off = readStoredOff();
    musicOffRef.current = off;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate music preference from localStorage once
    setMusicOff(off);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (musicOff || !isPlaying) {
      stopViz();
    } else {
      startViz();
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, [hydrated, musicOff, isPlaying, startViz, stopViz]);

  const tryPlay = useCallback(() => {
    const el = audioRef.current;
    if (!el || musicOffRef.current) return;
    el.muted = false;
    el.volume = 0.42;
    void el.play().catch(() => {
      /* autoplay blocked until user gesture — unlock listener handles it */
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const el = audioRef.current;
    if (!el) return;

    if (musicOff) {
      el.pause();
      return;
    }

    tryPlay();
  }, [hydrated, musicOff, tryPlay]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const unlock = () => {
      if (musicOffRef.current) return;
      if (el.paused) tryPlay();
    };

    window.addEventListener("pointerdown", unlock, { passive: true });
    document.addEventListener("keydown", unlock);

    return () => {
      window.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, [tryPlay]);

  useEffect(() => {
    const el = audioRef.current;
    return () => {
      stopViz();
      el?.pause();
    };
  }, [stopViz]);

  const showPlayingUi = !musicOff && isPlaying;
  const barLevels = showPlayingUi
    ? levels
    : Array.from({ length: BAR_COUNT }, () => 0.2);

  return (
    <motion.div
      layout
      className="fixed bottom-6 start-6 z-50 flex items-center gap-3 rounded-2xl border border-amber-500/25 bg-black/70 px-3 py-2 shadow-2xl backdrop-blur-md"
    >
      <audio
        ref={audioRef}
        src={MUSIC_TRACK_SRC}
        loop
        preload="auto"
        playsInline
        className="hidden"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
        }}
      />
      <div className="flex h-9 items-end gap-0.5 px-1" aria-hidden>
        {barLevels.map((h, i) => (
          <motion.span
            key={i}
            className="w-1 rounded-full bg-gradient-to-t from-amber-700 to-amber-300"
            animate={{ height: showPlayingUi ? 4 + h * 22 : 4 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
          />
        ))}
      </div>
      <Music2 className="h-4 w-4 text-amber-400/80" aria-hidden />
      <button
        type="button"
        onClick={() => {
          setMusicOff((off) => {
            const next = !off;
            musicOffRef.current = next;
            if (typeof window !== "undefined") {
              if (next) localStorage.setItem(STORAGE_KEY, "1");
              else localStorage.removeItem(STORAGE_KEY);
            }
            const el = audioRef.current;
            if (next) {
              el?.pause();
            } else if (el) {
              el.muted = false;
              el.volume = 0.42;
              void el.play().catch(() => {});
            }
            return next;
          });
        }}
        className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-zinc-950/80 px-3 py-2 text-xs font-medium text-amber-100 transition hover:border-amber-400/50 hover:bg-zinc-900"
        aria-pressed={!musicOff}
        aria-label={musicOff ? t("playSound") : t("muteSound")}
      >
        {musicOff ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">
          {musicOff ? t("playSound") : t("muteSound")}
        </span>
      </button>
    </motion.div>
  );
}
