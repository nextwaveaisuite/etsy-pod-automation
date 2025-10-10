import { NextRequest, NextResponse } from "next/server";
import { etsyFetch } from "@/lib/etsy";

export async function GET() {
  const data = await etsyFetch(`/application/shops/${process.env.ETSY_SHOP_ID}/sections`, { method: "GET" });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { names } = await req.json();
  if (!names?.length) return NextResponse.json({ error: "Provide names[]" }, { status: 400 });
  const created: any[] = [];
  for (const title of names.slice(0, 20)) {
    const out = await etsyFetch(`/application/shops/${process.env.ETSY_SHOP_ID}/sections`, {
      method: "POST",
      body: JSON.stringify({ title })
    });
    created.push(out);
  }
  return NextResponse.json({ created });
}
