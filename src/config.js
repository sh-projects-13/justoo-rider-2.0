export const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:4000";

// console.log(API_BASE_URL);

export function buildUrl(path) {
    const base = String(API_BASE_URL).replace(/\/+$/, "");
    const p = String(path || "");
    if (!p) return base;
    return p.startsWith("/") ? `${base}${p}` : `${base}/${p}`;
}
