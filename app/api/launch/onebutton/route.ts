import { NextRequest, NextResponse } from "next/server";

async function post(path: string, json: any) {
  const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(json) });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

export async function POST(req: NextRequest) {
  const { niche, product, image_urls, printify } = await req.json();
  if (!niche || !product || !Array.isArray(image_urls) || image_urls.length === 0) {
    return NextResponse.json({ error: "Provide niche, product, image_urls[]" }, { status: 400 });
  }
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";

  const seo = await post(`${base}/api/seo/suggest`, { niche, product });
  const pfy = await post(`${base}/api/pod/printify/product`, {
    title: seo.title,
    description: seo.description,
    blueprint_id: printify?.blueprint_id ?? 6,
    print_provider_id: printify?.print_provider_id ?? 1,
    variants: printify?.variants ?? [{ id: 401, price: 1895, is_enabled: true }],
    print_areas: [{
      variant_ids: (printify?.variants ?? [{ id: 401 }]).map((v:any)=>v.id),
      placeholders: [{ position: "front", images: [{ src: image_urls[0] }] }]
    }],
    tags: seo.tags
  });
  const calc = await post(`${base}/api/calc/etsy`, { itemPrice: 24.95, buyerShipping: 6.95, podBase: 12.20, podShip: 7.50 });
  const listing = await post(`${base}/api/publish/etsy`, {
    title: seo.title,
    description: seo.description,
    price: calc.outputs?.breakevenItemPrice ? Math.max(24.95, calc.outputs.breakevenItemPrice + 3) : 24.95,
    quantity: 50,
    taxonomy_id: 1100,
    tags: seo.tags,
    materials: ["cotton","ink"],
    shipping_profile_id: Number(process.env.DEFAULT_SHIPPING_PROFILE_ID || 0) || undefined,
    image_urls
  });

  return NextResponse.json({ seo, printify: pfy, calc, etsy: listing });
}
