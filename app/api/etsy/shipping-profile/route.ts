import { NextResponse } from "next/server";
import { etsyFetch } from "@/lib/etsy";

export async function POST() {
  const body = {
    title: process.env.DEFAULT_AU_SHIP_TITLE || "AU Standard Shipping",
    origin_country_iso: process.env.DEFAULT_AU_SHIP_ORIGIN_COUNTRY || "AU",
    processing_days_min: Number(process.env.DEFAULT_AU_PROCESSING_DAYS_MIN || 1),
    processing_days_max: Number(process.env.DEFAULT_AU_PROCESSING_DAYS_MAX || 3),
    destinations: [
      {
        destination_country_iso: process.env.DEFAULT_AU_SHIP_DEST_COUNTRY || "AU",
        primary_cost: Number(process.env.DEFAULT_AU_SHIP_COST_PRIMARY || 6.95),
        secondary_cost: Number(process.env.DEFAULT_AU_SHIP_COST_ADDITIONAL || 2.0),
        mail_class: "standard"
      }
    ]
  };
  const res = await etsyFetch(`/application/shops/${process.env.ETSY_SHOP_ID}/shipping-profiles`, {
    method: "POST",
    body: JSON.stringify(body)
  });
  return NextResponse.json(res);
}
