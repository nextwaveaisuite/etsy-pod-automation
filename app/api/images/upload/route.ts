// app/api/images/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import {
  ensureImageRoot,
  listImages,
  isImageFilename,
  isZipFilename,
  saveBlobTo,
  toRel,
  IMAGE_ROOT,
} from "@/lib/images";

export const dynamic = "force-dynamic";

/**
 * Unzip a ZIP blob into a temp folder and move out image files.
 * Uses dynamic import of `unzipper` and a promise wrapper for the stream.
 */
async function tryUnzipToTemp(blob: Blob): Promise<string[]> {
  try {
    const unzipper: any = await import("unzipper");
    const buf = Buffer.from(await blob.arrayBuffer());

    // Ensure base folders
    fs.mkdirSync(IMAGE_ROOT, { recursive: true });

    // Write the uploaded zip to a temp file
    const tmpZip = path.join(IMAGE_ROOT, `__tmp_${Date.now()}.zip`);
    fs.writeFileSync(tmpZip, buf);

    // Prepare extraction folder
    const dirOut = path.join(IMAGE_ROOT, `unz_${Date.now()}`);
    fs.mkdirSync(dirOut, { recursive: true });

    // Extract (wrap in a Promise so we can await finish/close)
    await new Promise<void>((resolve, reject) => {
      const read = fs.createReadStream(tmpZip);
      const extract = unzipper.Extract({ path: dirOut });
      read.on("error", reject);
      extract.on("error", reject);
      extract.on("close", resolve);
      read.pipe(extract);
    });

    // Remove the temp zip
    fs.unlinkSync(tmpZip);

    // Walk extracted folder and copy only image files into /uploaded
    const moved: string[] = [];
    const walk = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else if (isImageFilename(entry.name)) {
          const relInside = path.relative(dirOut, full);
          const targetRel = path.join("uploaded", relInside);
          const targetAbs = path.join(IMAGE_ROOT, targetRel);
          fs.mkdirSync(path.dirname(targetAbs), { recursive: true });
          fs.copyFileSync(full, targetAbs);
          moved.push(toRel(targetAbs));
        }
      }
    };

    walk(dirOut);

    // Clean extracted folder
    fs.rmSync(dirOut, { recursive: true, force: true });

    return moved;
  } catch {
    // If unzipper missing or unzip fails, just return empty (no crash)
    return [];
  }
}

/** GET: list images in the library */
export async function GET() {
  ensureImageRoot();
  return NextResponse.json({ items: listImages() });
}

/** DELETE: remove an image by ?path=relative/path.jpg */
export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const rel = url.searchParams.get("path");
  if (!rel) {
    return NextResponse.json({ error: "Missing ?path" }, { status: 400 });
  }

  try {
    const abs = path.join(IMAGE_ROOT, rel);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Delete failed" }, { status: 500 });
  }
}

/**
 * POST: multipart/form-data
 * Accepts images and/or a .zip. Images saved under /uploaded/
 * Response: { saved: string[] } where items are relative paths
 */
export async function POST(req: NextRequest) {
  ensureImageRoot();
  const form = await req.formData();
  const saved: string[] = [];

  for (const [key, val] of form.entries()) {
    if (!(val instanceof File)) continue;

    const file = val as File;
    const name = file.name || key;

    // ZIP: attempt extraction
    if (isZipFilename(name)) {
      const moved = await tryUnzipToTemp(file);
      if (moved.length) saved.push(...moved);
      continue;
    }

    // Non-image files are ignored
    if (!isImageFilename(name)) continue;

    const targetRel = path.join("uploaded", name);
    await saveBlobTo(targetRel, file);
    saved.push(targetRel);
  }

  return NextResponse.json({ saved });
}
