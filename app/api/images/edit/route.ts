import { NextRequest, NextResponse } from "next/server";
import sharp, { FitEnum, Gravity } from "sharp";
import path from "path";
import fs from "fs";
import { toAbs } from "@/lib/images"; // from the images module I gave you

export const dynamic = "force-dynamic";

type EditOps = {
  resize?: { width?: number; height?: number; fit?: keyof FitEnum };
  rotate?: number;
  crop?: { left: number; top: number; width: number; height: number };
  flipX?: boolean;
  flipY?: boolean;
  brightness?: number;
  contrast?: number;
  blur?: number;
  sharpen?: number;
  grayscale?: boolean;
  sepia?: boolean;
  negate?: boolean;
  normalize?: boolean;
  textOverlay?: {
    text: string;
    size?: number;
    color?: string;
    gravity?: keyof Gravity | "center";
  };
  format?: "jpeg" | "png" | "webp";
  quality?: number;
};

type Payload = { path: string; ops?: EditOps };

function svgOverlay({ text, size = 48, color = "#ffffff" }: { text: string; size?: number; color?: string }) {
  const esc = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000">
       <style>.t{fill:${color};font-size:${size}px;font-family:Arial,Helvetica,sans-serif}</style>
       <text x="50%" y="50%" text-anchor="middle" class="t" dominant-baseline="middle">${esc}</text>
     </svg>`
  );
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Payload;
  if (!body?.path) return NextResponse.json({ error: "Missing 'path'" }, { status: 400 });

  const abs = toAbs(body.path);
  if (!fs.existsSync(abs)) return NextResponse.json({ error: "File not found" }, { status: 404 });

  const ops = body.ops || {};
  const chosenFmt = ops.format ?? path.extname(abs).replace(".", "").toLowerCase();
  const ext = (["jpeg", "jpg", "png", "webp"].includes(chosenFmt) ? chosenFmt : "jpeg") as
    | "jpeg"
    | "jpg"
    | "png"
    | "webp";

  let img = sharp(abs, { failOnError: false });

  // transforms
  if (ops.resize) img = img.resize(ops.resize.width, ops.resize.height, { fit: ops.resize.fit || "cover" });
  if (typeof ops.rotate === "number") img = img.rotate(ops.rotate);
  if (ops.crop) img = img.extract(ops.crop);
  if (ops.flipX) img = img.flip();
  if (ops.flipY) img = img.flop();
  if (typeof ops.brightness === "number") img = img.modulate({ brightness: ops.brightness });
  if (typeof ops.contrast === "number") {
    const slope = ops.contrast;
    img = img.linear(slope, -(128 * slope) + 128);
  }
  if (ops.blur) img = img.blur(ops.blur);
  if (ops.sharpen) img = img.sharpen(ops.sharpen);
  if (ops.grayscale) img = img.grayscale();
  if (ops.negate) img = img.negate();
  if (ops.normalize) img = img.normalize();
  if (ops.sepia) {
    img = img.recomb([
      [0.393, 0.769, 0.189],
      [0.349, 0.686, 0.168],
      [0.272, 0.534, 0.131],
    ]);
  }
  if (ops.textOverlay?.text) {
    img = img.composite([
      { input: svgOverlay({ text: ops.textOverlay.text, size: ops.textOverlay.size, color: ops.textOverlay.color }), gravity: ops.textOverlay.gravity || "center" },
    ]);
  }

  const quality = typeof ops.quality === "number" ? Math.min(Math.max(ops.quality, 1), 100) : 90;
  if (ext === "jpeg" || ext === "jpg") img = img.jpeg({ quality });
  else if (ext === "png") img = img.png();
  else if (ext === "webp") img = img.webp({ quality });

  const buffer = await img.toBuffer();
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

  const ct =
    ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

  return new NextResponse(arrayBuffer, {
    headers: { "Content-Type": ct, "Cache-Control": "public, max-age=3600" },
  });
}
