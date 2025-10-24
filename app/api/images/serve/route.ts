import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imagePath = searchParams.get("path");
    
    if (!imagePath) {
      return NextResponse.json({ error: "No path provided" }, { status: 400 });
    }

    // Security: ensure path is within allowed directory
    const LIBRARY_PATH = "/home/ubuntu/image-library";
    if (!imagePath.startsWith(LIBRARY_PATH)) {
      return NextResponse.json({ error: "Invalid path" }, { status: 403 });
    }

    if (!existsSync(imagePath)) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const imageBuffer = await readFile(imagePath);
    
    // Determine content type
    let contentType = "image/jpeg";
    if (imagePath.endsWith(".png")) contentType = "image/png";
    else if (imagePath.endsWith(".gif")) contentType = "image/gif";
    else if (imagePath.endsWith(".webp")) contentType = "image/webp";
    
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000"
      }
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: "Failed to serve image",
      details: error.message
    }, { status: 500 });
  }
}

