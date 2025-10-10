import { NextRequest, NextResponse } from "next/server";
import { etsyFetch } from "@/lib/etsy";

type EtsyListingInput = {
  title: string;
  description: string;
  price: number;
  quantity: number;
  taxonomy_id: number;
  tags?: string[];
  materials?: string[];
  who_made?: "i_did" | "collective" | "someone_else";
  when_made?: string;
  is_supply?: boolean;
  is_customizable?: boolean;
  should_auto_renew?: boolean;
  shipping_profile_id?: number;
  production_partner_ids?: number[];
  image_urls: string[];
  sku?: string;
  personalization_is_required?: boolean;
  personalization_char_count_max?: number;
  personalization_instructions?: string;
};

export async function POST(req: NextRequest) {
  const payload = await req.json() as EtsyListingInput;
  const listing = await etsyFetch(`/application/shops/${process.env.ETSY_SHOP_ID}/listings`, {
    method: "POST",
    body: JSON.stringify({
      title: payload.title,
      description: payload.description,
      price: payload.price,
      quantity: payload.quantity,
      who_made: payload.who_made ?? "i_did",
      when_made: payload.when_made ?? "made_to_order",
      is_supply: payload.is_supply ?? false,
      is_customizable: payload.is_customizable ?? true,
      taxonomy_id: payload.taxonomy_id,
      tags: payload.tags ?? [],
      materials: payload.materials ?? [],
      should_auto_renew: payload.should_auto_renew ?? true,
      shipping_profile_id: payload.shipping_profile_id,
      production_partner_ids: payload.production_partner_ids ?? [],
      state: "draft",
      is_digital: false,
      sku: payload.sku ? [payload.sku] : undefined,
      personalization_is_required: payload.personalization_is_required ?? false,
      personalization_char_count_max: payload.personalization_char_count_max ?? 40,
      personalization_instructions: payload.personalization_instructions ?? "Enter the name/initials/date exactly as you want it printed."
    })
  });
  const listingId = listing?.listing_id;
  if (!listingId) return NextResponse.json({ error: "Failed to create listing", raw: listing }, { status: 500 });

  const uploaded: any[] = [];
  for (let i = 0; i < payload.image_urls.length; i++) {
    const img = payload.image_urls[i];
    const up = await etsyFetch(`/application/listings/${listingId}/images`, {
      method: "POST",
      body: JSON.stringify({ image_url: img, is_primary: i === 0, alt_text: payload.title.slice(0, 250) })
    });
    uploaded.push(up);
  }
  return NextResponse.json({ success: true, listing_id: listingId, images: uploaded });
}
