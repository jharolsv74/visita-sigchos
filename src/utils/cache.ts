// utils/cache.ts
// Cache en localStorage con (opcional) TTL
type Stored<T> = { data: T; ts: number };

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24h

export function cacheGet<T>(key: string, ttlMs = DEFAULT_TTL_MS): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored<T>;
    if (!parsed?.ts || !parsed?.data) return null;
    if (Date.now() - parsed.ts > ttlMs) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export function cacheSet<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  const payload: Stored<T> = { data, ts: Date.now() };
  localStorage.setItem(key, JSON.stringify(payload));
}
