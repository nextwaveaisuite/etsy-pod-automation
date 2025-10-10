// lib/images.ts
import fs from "fs";
import path from "path";

export const IMAGE_ROOT =
  process.env.IMAGE_ROOT || path.join("/tmp", "uploads", "images");

export function ensureImageRoot() {
  fs.mkdirSync(IMAGE_ROOT, { recursive: true });
}

export function toAbs(relPath: string) {
  const safe = relPath.replace(/^(\.\.[/\\])+/, ""); // prevent path escape
  return path.join(IMAGE_ROOT, safe);
}

export function toRel(absPath: string) {
  return path.relative(IMAGE_ROOT, absPath);
}

export function contentTypeByExt(filename: string): string {
  const ext = filename.toLowerCase().split(".").pop();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}

export function isImageFilename(name: string) {
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(name);
}

export function isZipFilename(name: string) {
  return /\.zip$/i.test(name);
}

export function listImages(): Array<{ path: string; size: number }> {
  ensureImageRoot();
  const out: Array<{ path: string; size: number }> = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (isImageFilename(entry.name)) {
        out.push({ path: toRel(full), size: fs.statSync(full).size });
      }
    }
  };
  walk(IMAGE_ROOT);
  return out;
}

export async function saveBlobTo(relTargetPath: string, blob: Blob) {
  ensureImageRoot();
  const abs = toAbs(relTargetPath);
  const dir = path.dirname(abs);
  fs.mkdirSync(dir, { recursive: true });
  const buf = Buffer.from(await blob.arrayBuffer());
  fs.writeFileSync(abs, buf);
  return { abs, rel: toRel(abs) };
}

export function deleteRelPath(relPath: string) {
  const abs = toAbs(relPath);
  if (fs.existsSync(abs)) fs.unlinkSync(abs);
}

export function readRelPath(relPath: string) {
  const abs = toAbs(relPath);
  return fs.readFileSync(abs);
}
