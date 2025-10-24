import { NextRequest, NextResponse } from "next/server";
import { resolveTaxonomyId, PRODUCT_TAXONOMY } from "@/lib/taxonomy";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const product = url.searchParams.get("product") || "";
  const id = resolveTaxonomyId(product);
  return NextResponse.json({ product, taxonomy_id: id, map: PRODUCT_TAXONOMY });
}
