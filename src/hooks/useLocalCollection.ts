"use client";

import { useCallback, useEffect, useState } from "react";

export type CardItem = {
  id: string;
  imageUrl: string;
  title?: string;
};

export type AlbumSheetItem = {
  id: string;
  imageUrl: string;
};

const CARDS_KEY = "nba-collection-cards";
const ALBUM_KEY = "nba-collection-album-pages";

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useLocalCollection() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [albumPages, setAlbumPages] = useState<AlbumSheetItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage after mount (SSR-safe)
    setCards(loadJson<CardItem[]>(CARDS_KEY, []));
    setAlbumPages(loadJson<AlbumSheetItem[]>(ALBUM_KEY, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
  }, [cards, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(ALBUM_KEY, JSON.stringify(albumPages));
  }, [albumPages, ready]);

  const addCard = useCallback((item: CardItem) => {
    setCards((prev) => [...prev, item]);
  }, []);

  const removeCard = useCallback((id: string) => {
    setCards((prev) => {
      const target = prev.find((c) => c.id === id);
      if (target?.imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(target.imageUrl);
      }
      return prev.filter((c) => c.id !== id);
    });
  }, []);

  const addAlbumPage = useCallback((item: AlbumSheetItem) => {
    setAlbumPages((prev) => [...prev, item]);
  }, []);

  const removeAlbumPage = useCallback((id: string) => {
    setAlbumPages((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(target.imageUrl);
      }
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  return {
    cards,
    albumPages,
    addCard,
    removeCard,
    addAlbumPage,
    removeAlbumPage,
    ready,
  };
}
