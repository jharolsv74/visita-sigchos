// utils/geo.ts
export type LatLng = { lat: number; lng: number };

export function isValidLatLng(val: unknown): val is LatLng {
  const v = val as LatLng;
  return (
    typeof v?.lat === "number" &&
    typeof v?.lng === "number" &&
    v.lat >= -90 &&
    v.lat <= 90 &&
    v.lng >= -180 &&
    v.lng <= 180
  );
}

export function toFixedCoord(n: number, digits = 5) {
  return Number(n.toFixed(digits));
}

export function makeRouteCacheKey(sitioId: number, user: LatLng) {
  const lat = toFixedCoord(user.lat);
  const lng = toFixedCoord(user.lng);
  return `${sitioId}_${lat}_${lng}`;
}
