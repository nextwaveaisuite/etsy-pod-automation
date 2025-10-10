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
 * Try to unzip an uploaded ZIP blob into a temp folder and move out image files.
 * Uses a dynamic import of `unzipper` and avoids TS type errors by casting to `any`.
 */
async function tryUnzipToTemp(blob: Blob): Promise<string[]> {
  try {
    const unzipper: any = await import("unzipper"); // typed as any to avoid TS directives
    const buf = Buffer.from(await blob.arrayBuffer());

    // ensure root exists
    fs.mkdirSync(IMAGE_ROOT, { recursive: true });

    const tmpZip = path.join(IMAGE_ROOT, `__tmp_${Date.now()}.zip`);
    fs.writeFileSync(tmpZip, buf);

    const dirOut = path.join(IMAGE_ROOT, `unz_${Date.now()}`);
    fs.mkdirSync(dirOut, { recursive: true });

    await new Promise<void>((resolve, reject) => {
      const read = fs.createReadStream(tmpZip);
      const extract = unzipper.Extract({ path: dirOut });
      read.on("error", reject);
      extract.on("error", reject);
      extract.on("close", () => resolve());
      read.pipe(extract);
    });

    fs.unlinkSync(tmpZip);

    // Move only image files found inside the
