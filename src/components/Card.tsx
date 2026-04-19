"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { CardItem } from "@/hooks/useLocalCollection";

type CardProps = {
  item: CardItem;
  adminMode: boolean;
  onRemove?: (id: string) => void;
  removeLabel: string;
  onExpand?: () => void;
  expandLabel: string;
};

export function Card({
  item,
  adminMode,
  onRemove,
  removeLabel,
  onExpand,
  expandLabel,
}: CardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="group relative aspect-[2.5/3.5] w-full max-w-[220px] justify-self-center"
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-xl border border-amber-500/25 bg-gradient-to-br from-zinc-900/90 to-black/90 shadow-[0_0_0_1px_rgba(251,191,36,0.08),0_20px_50px_-15px_rgba(0,0,0,0.85)] transition-[box-shadow,transform] duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-[0_0_40px_-8px_rgba(251,191,36,0.45),0_0_0_1px_rgba(251,191,36,0.2),0_28px_60px_-20px_rgba(0,0,0,0.9)]"
      >
        {onExpand ? (
          <button
            type="button"
            onClick={onExpand}
            className="absolute inset-0 z-[5] cursor-zoom-in rounded-xl border-0 bg-transparent p-0"
            aria-label={expandLabel}
          />
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt={item.title ?? ""}
          className="relative z-0 h-full w-full object-cover"
        />

        {/* Iridescent foil — prism colors like holo rare cards */}
        <div
          data-holo-prism
          className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:[animation:holo-prism-shift_3.5s_ease-in-out_infinite]"
          style={{
            background: `
              linear-gradient(
                128deg,
                rgba(255, 45, 180, 0.14) 0%,
                rgba(0, 245, 255, 0.16) 18%,
                rgba(255, 255, 255, 0.1) 38%,
                rgba(255, 210, 80, 0.18) 55%,
                rgba(140, 90, 255, 0.14) 72%,
                rgba(60, 255, 200, 0.12) 100%
              )
            `,
            mixBlendMode: "overlay",
          }}
          aria-hidden
        />

        {/* Conic shimmer — depth + color breakup */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "conic-gradient(from 38deg at 50% 108%, rgba(0, 220, 255, 0.35), rgba(255, 60, 200, 0.28), rgba(255, 230, 120, 0.32), rgba(120, 255, 200, 0.22), rgba(0, 220, 255, 0.35))",
          }}
          aria-hidden
        />

        {/* Sweeping specular band — main “light catch” */}
        <div
          className="pointer-events-none absolute inset-0 z-[2] overflow-hidden rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        >
          <div
            data-holo-sweep
            className="absolute -left-[55%] top-[-25%] h-[210%] w-[75%] will-change-transform mix-blend-plus-lighter opacity-90 group-hover:[animation:holo-sweep_2.35s_ease-in-out_infinite]"
            style={{
              background: `linear-gradient(
                102deg,
                transparent 0%,
                rgba(255, 255, 255, 0) 38%,
                rgba(255, 255, 255, 0.5) 49%,
                rgba(185, 250, 255, 0.65) 50%,
                rgba(255, 200, 255, 0.55) 51.5%,
                rgba(255, 255, 255, 0.45) 53%,
                transparent 68%
              )`,
            }}
          />
        </div>

        {/* Rim glint */}
        <div
          className="pointer-events-none absolute inset-0 z-[2] rounded-xl opacity-0 shadow-[inset_0_0_42px_rgba(255,255,255,0.12),inset_0_-20px_50px_rgba(255,200,120,0.06)] transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-10">
          {item.title ? (
            <p className="truncate text-center text-sm font-medium tracking-wide text-amber-100/95">
              {item.title}
            </p>
          ) : (
            <p className="text-center text-xs text-zinc-500">—</p>
          )}
        </div>
      </div>
      {adminMode && onRemove ? (
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
          className="absolute -right-2 -top-2 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-red-500/40 bg-black/80 text-red-300 shadow-lg backdrop-blur-sm transition-colors hover:bg-red-950/80"
          aria-label={removeLabel}
        >
          <Trash2 className="h-4 w-4" />
        </motion.button>
      ) : null}
    </motion.article>
  );
}
