/** Extracts 11-char YouTube video id from common URL shapes. */
export function getYouTubeId(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  const m = s.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return m?.[1] ?? null;
}

export function getVimeoId(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;
  const m = s.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m?.[1] ?? null;
}
