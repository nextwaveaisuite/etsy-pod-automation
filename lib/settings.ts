// lib/settings.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

type AppSettings = {
  baseUrl: string;
  etsyShopId?: string;
  printifyShopId?: string;
  supabaseUrl?: string;
  supabaseKey?: string;
  isSupabaseEnabled: boolean;
};

export function getSettings(): AppSettings {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  return {
    baseUrl,
    etsyShopId: process.env.ETSY_SHOP_ID,
    printifyShopId: process.env.PRINTIFY_SHOP_ID,
    supabaseUrl,
    supabaseKey,
    isSupabaseEnabled: !!(supabaseUrl && supabaseKey),
  };
}

let _supabase: SupabaseClient | null = null;

/** Safe client creator — returns null if env isn’t configured */
export function getSupabase(): SupabaseClient | null {
  if (_supabase) return _supabase;
  const { supabaseUrl, supabaseKey, isSupabaseEnabled } = getSettings();
  if (!isSupabaseEnabled) return null;
  _supabase = createClient(supabaseUrl!, supabaseKey!, {
    auth: { persistSession: false },
  });
  return _supabase;
}
