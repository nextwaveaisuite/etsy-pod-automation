import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { getSupabaseAdmin, SUPABASE_BUCKET } from "@/lib/settings";

export const dynamic = "force-dynamic";

async function uploadPNG(buffer: Buffer, key: string) {
  const supa = await getSupabaseAdmin();
  const { error } = await supa.storage.from(SUPABASE_BUCKET).upload(key, buffer, { contentType: "image/png", upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supa.storage.from(SUPABASE_BUCKET).getPublicUrl(key);
  return data.publicUrl;
}

export async function POST(req: NextRequest) {
  const { product = "tote", designUrl = "", bg = "#ffffff" } = await req.json();
  if (!designUrl) return NextResponse.json({ error: "designUrl required" }, { status: 400 });

  // Base canvas
  const W = 1600, H = 1200;
  const canvas = sharp({ create: { width: W, height: H, channels: 4, background: bg } });

  // Fetch design
  const res = await fetch(designUrl);
  if (!res.ok) return NextResponse.json({ error: "Failed to fetch designUrl" }, { status: 400 });
  const designBuf = Buffer.from(await res.arrayBuffer());
  const design = await sharp(designBuf).resize(900, 900, { fit: "contain" }).png().toBuffer();

  // Simple placement presets
  let x = 350, y = 150;
  if (product === "mug") { x = 500; y = 250; }
  if (product === "poster") { x = 350; y = 150; }

  const composite = await canvas
    .composite([ { input: design, top: y, left: x } ])
    .png()
    .toBuffer();

  const key = `generated/mockup-${product}-${Date.now()}.png`;
  const url = await uploadPNG(composite, key);
  return NextResponse.json({ url });
}
