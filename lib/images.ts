// lib/images.ts
import { createClient } from "@supabase/supabase-js";

// ⚠️ LOCAL TEST VERSION — DO NOT COMMIT WITH REAL KEYS
const supabaseUrl = "https://zggsfwrjltpfycabzppu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnZ3Nmd3JqbHRwZnljYWJ6cHB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNTU3MTMsImV4cCI6MjA3NTYzMTcxM30.-0R7bYbejkYwKj-w_tzkEZaDaUOTzEAHffK6HgBz8Cc";

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Upload an image to Supabase Storage (images bucket)
 */
export async function uploadImage(file: Buffer, fileName: string) {
  const { data, error } = await supabase.storage
    .from("images")
    .upload(fileName, file, { upsert: true, contentType: "image/jpeg" });
  if (error) throw error;
  return data.path;
}

/**
 * Get a public URL for an image
 */
export function getPublicUrl(filePath: string) {
  const { data } = supabase.storage.from("images").getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Delete an image
 */
export async function deleteImage(filePath: string) {
  const { error } = await supabase.storage.from("images").remove([filePath]);
  if (error) throw error;
  return true;
}
