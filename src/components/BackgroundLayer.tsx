"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const LEGEND_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80",
    alt: "Basketball arena atmosphere",
    position: "left" as const,
  },
  {
    src: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=1200&q=80",
    alt: "Classic basketball texture",
    position: "right" as const,
  },
];

export function BackgroundLayer() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 20%, rgba(206, 17, 65, 0.18), transparent 55%),
            radial-gradient(ellipse 70% 50% at 80% 30%, rgba(253, 185, 39, 0.12), transparent 50%),
            radial-gradient(ellipse 60% 40% at 50% 90%, rgba(85, 37, 130, 0.14), transparent 45%),
            linear-gradient(180deg, #070604 0%, #0c0a08 40%, #080706 100%)
          `,
        }}
      />
      <motion.div
        style={{ y: y1 }}
        className="absolute -left-[12%] top-[8%] h-[min(55vh,420px)] w-[min(48vw,520px)] opacity-[0.14] mix-blend-screen"
      >
        <Image
          src={LEGEND_IMAGES[0].src}
          alt=""
          fill
          className="object-cover object-center"
          sizes="520px"
          priority
          unoptimized
        />
      </motion.div>
      <motion.div
        style={{ y: y2 }}
        className="absolute -right-[8%] top-[22%] h-[min(50vh,400px)] w-[min(44vw,480px)] opacity-[0.12] mix-blend-screen"
      >
        <Image
          src={LEGEND_IMAGES[1].src}
          alt=""
          fill
          className="object-cover object-center"
          sizes="480px"
          unoptimized
        />
      </motion.div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.04%22/%3E%3C/svg%3E')] opacity-40" />
    </div>
  );
}
