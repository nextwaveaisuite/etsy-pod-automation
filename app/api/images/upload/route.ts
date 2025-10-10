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

async function tryUnzipToTemp(blob: Blob) {
  try {
    // Dynamic import so it doesn't break if not installed locally
    // To use full unzip features, add to package.json: "unzipper": "^0.10.14"
    const unzipper = await import("unzipper"); // eslint-disable-line
    const buf = Buffer.from(await blob.arrayBuffer());
    const tmpZip = path.join(IMAGE_ROOT, `__tmp_${Date.now()}.zip`);
    fs.mkdirSync(IMAGE_ROOT, { recursive: true });
    fs.writeFileSync(tmpZip, buf);

    const dirOut = path.join(IMAGE_ROOT, `unz_${Date.now()}`);
    fs.mkdirSync(dirOut, { recursive: true });

    await fs
      .createReadStream(tmpZip)
      // @ts-expect-error: types optional
      .pipe(unzipper.Extract({ path: dirOut }))
      .promise();

    fs.unlinkSync(tmpZip);

    // Move only image files found inside the zip into root with folder structure preserved
    const moved: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (isImageFilename(entry.name)) {
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
    // If unzipper not available, return empty (no crash)
    return [];
  }
}

export async function GET() {
  ensureImageRoot();
  return NextResponse.json({ items: listImages() });
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const rel = url.searchParams.get("path");
  if (!rel) return NextResponse.json({ error: "Missing ?path" }, { status: 400 });
  try {
    const { deleteRelPath } = await import("@/lib/images");
    deleteRelPath(rel);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Delete failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  ensureImageRoot();
  const form = await req.formData();
  const saved: string[] = [];
  for (const [key, val] of form.entries()) {
    if (val instanceof File) {
      const file = val as File;
      const name = file.name || key;
      if (isZipFilename(name)) {
        const moved = await tryUnzipToTemp(file);
        saved.push(...moved);
        continue;
      }
      if (!isImageFilename(name)) {
        // skip non-images
        continue;
      }
      const targetRel = path.join("uploaded", name);
      await saveBlobTo(targetRel, file);
      saved.push(targetRel);
    }
  }
  return NextResponse.json({ saved });
}
