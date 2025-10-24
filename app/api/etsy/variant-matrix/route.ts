import { NextRequest, NextResponse } from "next/server";
import { normalizeColor } from "@/lib/taxonomy";

export async function POST(req: NextRequest) {
  const { sizes = ["S","M","L","XL","XXL"], colors = ["Black","White"] } = await req.json();
  const normColors = colors.map((c:string)=>normalizeColor(c));
  const products = [];
  for (const s of sizes) {
    for (const c of normColors) {
      products.push({
        sku: `TEE-${s}-${c}`.toUpperCase().replace(/\s+/g,""),
        property_values: [
          { property_id: 513, value_ids: [0] }, // placeholder mapping; replace with real Etsy value IDs if needed
          { property_id: 514, value_ids: [0] }
        ],
        offerings: [{ price: 29.95, quantity: 20 }]
      });
    }
  }
  return NextResponse.json({ products, meta: { sizes, colors: normColors } });
}
