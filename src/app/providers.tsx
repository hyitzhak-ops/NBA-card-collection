"use client";

import { TranslationProvider } from "@/context/TranslationContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <TranslationProvider>{children}</TranslationProvider>;
}
