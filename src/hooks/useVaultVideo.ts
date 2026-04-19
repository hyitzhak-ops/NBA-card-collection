"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  deleteVideoBlob,
  getVideoBlob,
  saveVideoBlob,
  VIDEO_URL_STORAGE_KEY,
} from "@/lib/videoStorage";

export function useVaultVideo() {
  const [url, setUrlState] = useState("");
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(VIDEO_URL_STORAGE_KEY) ?? "";
    // Hydrate URL from localStorage after mount (SSR-safe initial "").
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrlState(stored);

    let cancelled = false;
    void (async () => {
      try {
        const blob = await getVideoBlob();
        if (cancelled) return;
        if (blob) {
          const u = URL.createObjectURL(blob);
          if (cancelled) {
            URL.revokeObjectURL(u);
            return;
          }
          blobUrlRef.current = u;
          setBlobUrl(u);
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  const setVideoUrl = useCallback((next: string) => {
    setUrlState(next);
    if (typeof window !== "undefined") {
      if (next.trim()) localStorage.setItem(VIDEO_URL_STORAGE_KEY, next);
      else localStorage.removeItem(VIDEO_URL_STORAGE_KEY);
    }
    void deleteVideoBlob();
    setBlobUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
        blobUrlRef.current = null;
      }
      return null;
    });
  }, []);

  const setVideoFile = useCallback(async (file: File) => {
    await saveVideoBlob(file);
    if (typeof window !== "undefined") {
      localStorage.removeItem(VIDEO_URL_STORAGE_KEY);
    }
    setUrlState("");
    setBlobUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      const u = URL.createObjectURL(file);
      blobUrlRef.current = u;
      return u;
    });
  }, []);

  const clearVideo = useCallback(async () => {
    await deleteVideoBlob();
    if (typeof window !== "undefined") {
      localStorage.removeItem(VIDEO_URL_STORAGE_KEY);
    }
    setUrlState("");
    setBlobUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
        blobUrlRef.current = null;
      }
      return null;
    });
  }, []);

  const hasVideo = Boolean(blobUrl || url.trim());

  return {
    ready,
    url,
    blobUrl,
    setVideoUrl,
    setVideoFile,
    clearVideo,
    hasVideo,
  };
}
