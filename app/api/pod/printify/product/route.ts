import { NextRequest, NextResponse } from "next/server";

const PRINTIFY_API_BASE = process.env.PRINTIFY_API_BASE || "https://api.printify.com/v1";
const PRINTIFY_SHOP_ID = process.env.PRINTIFY_SHOP_ID;
const PRINTIFY_TOKEN = process.env.PRINTIFY_TOKEN;

type PrintifyProductInput = {
  title: string;
  description?: string;
  blueprint_id: number;
  print_provider_id: number;
  variants: Array<{ id: number; price: number; is_enabled?: boolean }>;
  print_areas: Array<{
    variant_ids: number[];
    placeholders: Array<{ position: string; images: Array<{ src: string; scale?: number; x?: number; y?: number }> }>;
  }>;
  tags?: string[];
};

export async function POST(req: NextRequest) {
  if (!PRINTIFY_SHOP_ID || !PRINTIFY_TOKEN) {
    return NextResponse.json({ error: "Printify not configured" }, { status: 500 });
  }
  const payload = await req.json() as PrintifyProductInput;
  const res = await fetch(`${PRINTIFY_API_BASE}/shops/${PRINTIFY_SHOP_ID}/products.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${PRINTIFY_TOKEN}` },
    body: JSON.stringify({
      title: payload.title,
      description: payload.description ?? "",
      blueprint_id: payload.blueprint_id,
      print_provider_id: payload.print_provider_id,
      variants: payload.variants,
      print_areas: payload.print_areas,
      tags: payload.tags ?? [],
      visible: false
    })
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data }, { status: res.status });
  return NextResponse.json(data);
}
