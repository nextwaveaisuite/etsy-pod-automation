// lib/settings.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/** ---------- App + Env ---------- */
export const SUPABASE_URL = process.env.SUPABASE_URL || "";
export const SUPABASE_KEY = process.env.SUPABASE_KEY || "";
export const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || ""; // optional
export const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || "images"; // default bucket

export const NEXT_PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

/** ---------- Settings helpers (safe, mock until DB is wired) ---------- */
const memorySettings = new Map<string, string>();

export const feeDefaults = {
  etsyListingFee: 0.20,        // $0.20 per listing
  etsyTransactionFeePct: 0.065, // 6.5%
  paymentProcessingPct: 0.03,   // 3%
  paymentProcessingFixed: 0.30, // $0.30
};

export function getSetting(key: string, fallback = ""): string {
  // Priority: env → memory → fallback
  const fromEnv = process.env[key];
  if (typeof fromEnv === "string" && fromEnv.length) return fromEnv;
  if (memorySettings.has(key)) return memorySettings.get(key)!;
  return fallback;
}

export function setSetting(key: string, value: string): void {
  // In production, replace with DB write (e.g., Supabase)
  memorySettings.set(key, value);
}

/** ---------- Supabase clients (optional) ---------- */
let _supabaseAnon: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

export function isSupabaseEnabled(): boolean {
  return !!(SUPABASE_URL && (SUPABASE_KEY || SUPABASE_SERVICE_ROLE));
}

/** Anonymous client (safe for read/basic ops) */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseEnabled()) return null;
  if (_supabaseAnon) return _supabaseAnon;
  _supabaseAnon = createClient(SUPABASE_URL, SUPABASE_KEY || SUPABASE_SERVICE_ROLE, {
    auth: { persistSession: false },
  });
  return _supabaseAnon;
}

/** Admin client (used by your API routes that imported getSupabaseAdmin) */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseEnabled()) return null;
  if (_supabaseAdmin) return _supabaseAdmin;
  const key = SUPABASE_SERVICE_ROLE || SUPABASE_KEY; // prefer service role if provided
  _supabaseAdmin = createClient(SUPABASE_URL, key, { auth: { persistSession: false } });
  return _supabaseAdmin;
}

/** ---------- High-level app settings ---------- */
export function getSettings() {
  return {
    baseUrl: NEXT_PUBLIC_BASE_URL,
    etsyShopId: process.env.ETSY_SHOP_ID,
    printifyShopId: process.env.PRINTIFY_SHOP_ID,
    isSupabaseEnabled: isSupabaseEnabled(),
    bucket: SUPABASE_BUCKET,
  };
}
