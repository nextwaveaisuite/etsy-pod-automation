import { NextRequest, NextResponse } from "next/server";
let mem: Record<string, any> = {};

export async function POST(req: NextRequest) {
  const { listing_id, variants, min_views = 250, seo_score = 85 } = await req.json();
  if (!listing_id || !variants?.length) return NextResponse.json({ error: "Need listing_id and variants[]" }, { status: 400 });
  mem[String(listing_id)] = { listing_id, variants, current_idx: 0, min_views, views: 0, seo_gate: seo_score };
  return NextResponse.json({ ok: true, test: mem[String(listing_id)] });
}

export async function PATCH(req: NextRequest) {
  const { listing_id, latest_seo_score } = await req.json();
  const t = mem[String(listing_id)];
  if (!t) return NextResponse.json({ error: "No test for listing" }, { status: 404 });
  t.views++;
  if (latest_seo_score && latest_seo_score < t.seo_gate) return NextResponse.json({ status: "blocked_by_seo", current: t });
  if (t.views >= t.min_views) { t.current_idx = (t.current_idx + 1) % t.variants.length; t.views = 0; }
  return NextResponse.json({ status: "ok", current_variant: t.variants[t.current_idx], meta: t });
}
