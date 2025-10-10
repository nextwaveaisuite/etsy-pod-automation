import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

/**
 * POST /api/images/edit
 * Body example:
 * {
 *   "path": "uploaded/yourfile.jpg",
 *   "ops": {
 *     "resize": { "width": 1200 },
 *     "grayscale": true,
 *     "textOverlay": { "text": "Sample", "size": 64, "color": "#ffffff" },
 *     "format": "jpeg",
 *     "quality": 90
 *   }
 * }
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path: imagePath, ops } = body;

    if (!imagePath) {
      return NextResponse.json({ error: "Missing image path." }, { status: 400 });
    }

    const absPath = path.join(process.cwd(), "public", imagePath);

    if (!fs.existsSync(absPath)) {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    let img = sharp(absPath);

    // ---- Image Transformations ----
    if (ops.resize && ops.resize.width) {
      img = img.resize(ops.resize.width, ops.resize.height || null);
    }

    if (ops.grayscale) {
      img = img.grayscale();
    }

    if (ops.brightness || ops.contrast) {
      // Sharp doesn't directly support contrast; we can simulate it via modulate
      img = img.modulate({
        brightness: ops.brightness || 1,
        saturation: ops.contrast || 1,
      });
    }

    if (ops.blur) img = img.blur(ops.blur);
    if (ops.sharpen) img = img.sharpen();
    if (ops.sepia) img = img.tint({ r: 112, g: 66, b: 20 });
    if (ops.negative) img = img.negate();
    if (ops.normalize) img = img.normalize();

    // ---- Optional Text Overlay ----
    if (ops.textOverlay && ops.textOverlay.text) {
      const svg = `
        <svg width="1200" height="1200">
          <style>
            .title {
              fill: ${ops.textOverlay.color || "#ffffff"};
              font-size: ${ops.textOverlay.size || 64}px;
              font-weight: bold;
              text-anchor: middle;
              dominant-baseline: middle;
            }
          </style>
          <text x="50%" y="50%" class="title">${ops.textOverlay.text}</text>
        </svg>
      `;
      const svgBuffer = Buffer.from(svg);
      img = img.composite([{ input: svgBuffer, gravity: "center" }]);
    }

    // ---- Format and Quality ----
    const fmt = ops.format || "jpeg";
    const quality = ops.quality || 90;

    if (fmt === "jpeg") img = img.jpeg({ quality });
    else if (fmt === "png") img = img.png({ quality });
    else if (fmt === "webp") img = img.webp({ quality });

    // ---- Final Output ----
    const buffer = await img.toBuffer();
    const bodyOut = new Uint8Array(buffer); // Avoid ArrayBuffer type conflict

    const contentType =
      fmt === "png" ? "image/png" :
      fmt === "webp" ? "image/webp" :
      "image/jpeg";

    return new NextResponse(bodyOut, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });

  } catch (err: any) {
    console.error("Image edit error:", err);
    return NextResponse.json(
      { error: "Failed to process image", details: err.message },
      { status: 500 }
    );
  }
}
