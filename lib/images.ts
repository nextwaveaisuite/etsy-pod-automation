// lib/images.ts
import fs from "fs";
import path from "path";
import mime from "mime-types";
import { createClient } from "@supabase/supabase-js";

// ---------- CONFIG ----------
export const IMAGE_ROOT = path.join(process.cwd(), "public", "uploads");

export const supabase = createClient(
  "https://zggsfwrjltpfycabzppu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZ3Nmd3JqbHRwZnljYWJ6cHB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNTU3MTMsImV4cCI6MjA3NTYzMTcxM30.-0R7bYbejkYwKj-w_tzkEZaDaUOTzEAHffK6HgBz8Cc"
);

// ---------- HELPERS ----------
export function ensureImageRoot() {
  if (!fs.existsSync(IMAGE_ROOT)) fs.mkdirSync(IMAGE_ROOT, { recursive: true });
}

export function isImageFilename(filename: string) {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
}

export function isZipFilename(filename: string) {
  return /\.zip$/i.test(filename);
}

export function contentTypeByExt(filePath: string) {
  return mime.lookup(filePath) || "application/octet-stream";
}

export function readRelPath(relPath: string) {
  const abs = path.join(IMAGE_ROOT, relPath);
  if (!abs.startsWith(IMAGE_ROOT)) throw new Error("Invalid path");
  return fs.readFileSync(abs);
}

export function toRel(filename: string) {
  return path.relative(IMAGE_ROOT, filename);
}

export function listImages() {
  ensureImageRoot();
  return fs.readdirSync(IMAGE_ROOT).filter(isImageFilename);
}

export async function saveBlobTo(file: Buffer, fileName: string) {
  ensureImageRoot();
  const dest = path.join(IMAGE_ROOT, fileName);
  fs.writeFileSync(dest, file);
  return dest;
}

// ---------- SUPABASE STORAGE ----------
export async function uploadImage(file: Buffer, fileName: string) {
  const { data, error } = await supabase.storage
    .from("images")
    .upload(fileName, file, { upsert: true, contentType: contentTypeByExt(fileName) });
  if (error) throw error;
  return data.path;
}

export function getPublicUrl(filePath: string) {
  const { data } = supabase.storage.from("images").getPublicUrl(filePath);
  return data.publicUrl;
}

export async function deleteImage(filePath: string) {
  const { error } = await supabase.storage.from("images").remove([filePath]);
  if (error) throw error;
  return true;
}
