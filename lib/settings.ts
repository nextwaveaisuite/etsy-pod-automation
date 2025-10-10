import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const bucket = process.env.SUPABASE_BUCKET || "public-mockups";

export type Settings = {
  default_shipping_profile_id?: number;
  printify?: {
    shop_id?: string;
    provider_id?: number;
    blueprint_id?: number;
    variants?: Array<{ id: number; price: number; is_enabled?: boolean }>;
  };
  fees?: {
    listing_fee?: number;
    txn_pct?: number;
    pay_pct?: number;
    pay_fixed?: number;
    offsite_ads_pct?: number;
  };
};

export async function getSupabaseAdmin() {
  if (!url || !key) throw new Error("Supabase env missing");
  return createClient(url, key);
}

export async function getSetting<T=any>(k: string, fallback?: T): Promise<T|undefined> {
  const supa = await getSupabaseAdmin();
  const { data, error } = await supa.from("app_settings").select("*").eq("key", k).maybeSingle();
  if (error) return fallback;
  return (data?.value ?? fallback) as T;
}

export async function setSetting<T=any>(k: string, value: T) {
  const supa = await getSupabaseAdmin();
  await supa.from("app_settings").upsert({ key: k, value });
}

export function feeDefaults() {
  return {
    listing_fee: Number(process.env.ETSY_AU_LISTING_FEE || 0.30),
    txn_pct: Number(process.env.ETSY_AU_TXN_PCT || 6.5),
    pay_pct: Number(process.env.ETSY_AU_PAY_PCT || 3.0),
    pay_fixed: Number(process.env.ETSY_AU_PAY_FIXED || 0.30),
    offsite_ads_pct: Number(process.env.ETSY_OFFSITE_ADS_PCT_TIER || 0)
  };
}

export const SUPABASE_BUCKET = bucket;
