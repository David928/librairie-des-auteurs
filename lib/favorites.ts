const KEY = "librairie-favoris";
const EVENT = "favoris-changed";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  window.localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(EVENT));
}

export function getFavorites(): string[] {
  return read();
}

export function isFavorite(bookId: string): boolean {
  return read().includes(bookId);
}

export function toggleFavorite(bookId: string): string[] {
  const current = read();
  const next = current.includes(bookId)
    ? current.filter((id) => id !== bookId)
    : [...current, bookId];
  write(next);
  return next;
}

export function subscribeFavorites(callback: () => void): () => void {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
