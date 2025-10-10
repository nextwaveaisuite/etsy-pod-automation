// app/api/images/edit/route.ts
import { NextRequest, NextResponse } from "next/server";
import sharp, { FitEnum, Gravity } from "sharp";
import path from "path";
import fs from "fs";
import { toAbs, contentTypeByExt } from "@/lib/images";

export const dynamic = "force-dynamic";

type EditOps = {
  resize?: { width?: number; height?: number; fit?: keyof FitEnum };
  rotate?: number; // degrees
  crop?: { left: number; top: number; width: number; height: number };
  flipX?: boolean;
  flipY?: boolean;
  brightness?: number; // 0..2 (1 = no change)
  contrast?: number;   // 0..2 (1 = no change)
  blur?: number;       // 0..10
  sharpen?: number;    // 0..10
  grayscale?: boolean;
  sepia?: boolean;
  negate?: boolean;
  normalize?: boolean;
  textOverlay?: {
    text: string;
    size?: number;
    color?: string; // e.g. #ffffff
    gravity?: keyof Gravity | "center";
  };
  format?: "jpeg" | "png" | "webp";
  quality?: number; // 1..100
};

type Payload = {
  /** relative path inside library (e.g., "uploaded/image.jpg") */
  path: string;
  ops?: EditOps;
};

function svgOverlay({ text, size = 48, color = "#ffffff" }: { text: string; size?: number; color?: string }) {
  const esc = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // Simple full-canvas centered text overlay
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000">
       <style>
         .t { fill: ${color}; font-size: ${size}px; font-family: Arial, Helvetica, sans-serif; }
       </style>
       <rect width="100%" height="100%" fill="rgba(0,0,0,0)" />
       <text x="50%" y="50%" text-anchor="middle" class="t" dominant-baseline="middle">${esc}</text>
     </svg>`
  );
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Payload;
  if (!body?.path) {
    return NextResponse.json({ error: "Missing 'path' in body" }, { status: 400 });
  }

  const abs = toAbs(body.path);
  if (!fs.existsSync(abs)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const ops = body.ops || {};
  const ext = (ops.format ? ops.format : path.extname(abs).replace(".", "").toLowerCase()) as
    | "jpeg"
    | "png"
    | "webp";

  let img = sharp(abs, { failOnError: false });

  // --- basic transforms ---
  if (ops.resize) {
    const { width, height, fit } = ops.resize;
    img = img.resize(width, height, { fit: fit || "cover" });
  }
  if (typeof ops.rotate === "number") {
    img = img.rotate(ops.rotate);
  }
  if (ops.crop) {
    const { left, top, width, height } = ops.crop;
    img = img.extract({ left, top, width, height });
  }
  if (ops.flipX) img = img.flip();
  if (ops.flipY) img = img.flop();

  // --- color + effects ---
  if (typeof ops.brightness === "number" || typeof ops.contrast === "number") {
    // emulate brightness/contrast via modulate/linear
    if (typeof ops.brightness === "number") {
      img = img.modulate({ brightness: ops.brightness });
    }
    if (typeof ops.contrast === "number") {
      // contrast via linear: higher slope -> more contrast
      const slope = ops.contrast;
      img = img.linear(slope, -(128 * slope) + 128);
    }
  }
  if (typeof ops.blur === "number" && ops.blur > 0) img = img.blur(ops.blur);
  if (typeof ops.sharpen === "number" && ops.sharpen > 0) img = img.sharpen(ops.sharpen);
  if (ops.grayscale) img = img.grayscale();
  if (ops.negate) img = img.negate();
  if (ops.normalize) img = img.normalize();

  // Sepia via color matrix
  if (ops.sepia) {
    img = img.recomb([
      [0.393, 0.769, 0.189],
      [0.349, 0.686, 0.168],
      [0.272, 0.534, 0.131],
    ]);
  }

  // --- text overlay (SVG composite) ---
  if (ops.textOverlay?.text) {
    const svg = svgOverlay({
      text: ops.textOverlay.text,
      size: ops.textOverlay.size,
      color: ops.textOverlay.color,
    });
    img = img.composite([{ input: svg, gravity: ops.textOverlay.gravity || "center" }]);
  }

  // --- output format + quality ---
  const quality = typeof ops.quality === "number" ? Math.min(Math.max(ops.quality, 1), 100) : 90;
  if (ext === "jpeg" || ext === "jpg") img = img.jpeg({ quality });
  else if (ext === "png") img = img.png(); // PNG ignores "quality" in sharp
  else if (ext === "webp") img = img.webp({ quality });

  const buffer = await img.toBuffer();
  // Convert Node Buffer -> ArrayBuffer for NextResponse
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

  const ct =
    ext === "jpg" ? "image/jpeg" : ext === "jpeg" ? "image/jpeg" : ext === "png" ? "image/png" : "image/webp";

  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": ct,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
