// app/api/images/serve/route.ts
import { NextRequest, NextResponse } from "next/server";
import { contentTypeByExt, readRelPath } from "@/lib/images";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const rel = url.searchParams.get("path");
  if (!rel) return NextResponse.json({ error: "Missing ?path" }, { status: 400 });

  try {
    const buf = readRelPath(rel);
    const ct = contentTypeByExt(rel);
    // Convert Buffer -> ArrayBuffer for Web Response compatibility
    const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    return new NextResponse(ab, {
      headers: {
        "Content-Type": ct,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Not found" }, { status: 404 });
  }
}
