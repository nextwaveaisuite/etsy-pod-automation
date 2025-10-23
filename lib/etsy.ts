export const ETSY_API_BASE = process.env.ETSY_API_BASE || "https://openapi.etsy.com/v3";
export const ETSY_SHOP_ID = process.env.ETSY_SHOP_ID || "";
const ETSY_TOKEN = process.env.ETSY_TOKEN || "";

export async function etsyFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${ETSY_API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ETSY_TOKEN}`,
      ...(init?.headers || {}),
    },
    cache: "no-store"
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, data };
  return data;
}
