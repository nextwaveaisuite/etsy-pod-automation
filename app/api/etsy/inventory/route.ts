import { NextRequest, NextResponse } from "next/server";
import { etsyFetch } from "@/lib/etsy";

type Offering = { property_id: number; value_ids: number[]; };
type InventoryInput = {
  listing_id: number;
  products: Array<{ sku?: string; property_values: Offering[]; offerings: Array<{ price: number; quantity: number }>; }>;
};

export async function POST(req: NextRequest) {
  const payload = await req.json() as InventoryInput;
  if (!payload?.listing_id || !payload?.products?.length) {
    return NextResponse.json({ error: "Provide listing_id and products[]" }, { status: 400 });
  }
  const out = await etsyFetch(`/application/listings/${payload.listing_id}/inventory`, {
    method: "PUT",
    body: JSON.stringify({ products: payload.products })
  });
  return NextResponse.json(out);
}
