// lib/images.ts
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// --- CONFIG ---
export const IMAGE_ROOT = path.join(process.cwd(), "public", "uploads");
export const supabase = createClient(
  "https://zggsfwrjltpfycabzppu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZ3Nmd3JqbHRwZnljYWJ6cHB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNTU3MTMsImV4cCI6MjA3NTYzMTcxM30.-0R7bYbejkYwKj-w_tzkEZaDaUOTzEAHffK6HgBz8Cc"
);

// --- FILE UTILS ---

export function ensureImageRoot() {
  if (!fs.existsSync(IMAGE_ROOT)) fs.mkdirSync(IMAGE_ROOT, { recursive: true });
}

export function isImageFilename(filename: string) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
}

export function isZipFilename
