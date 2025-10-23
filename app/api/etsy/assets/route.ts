import { NextResponse } from "next/server";
import { etsyFetch } from "@/lib/etsy";

const BANNER = process.env.SHOP_BANNER_URL;
const AVATAR = process.env.SHOP_AVATAR_URL;
const ANNOUNCEMENT = process.env.SHOP_ANNOUNCEMENT || "";
const ABOUT = process.env.SHOP_ABOUT || "";

export async function POST() {
  const results: any = {};
  try {
    results.shop = await etsyFetch(`/application/shops/${process.env.ETSY_SHOP_ID}`, {
      method: "PATCH",
      body: JSON.stringify({
        announcement: ANNOUNCEMENT,
        story_headline: "Original AU Print-on-Demand Gifts",
        story_leading_paragraph: ABOUT
      })
    });
  } catch (e) { results.shop_error = e; }

  if (BANNER) {
    try {
      results.banner = await etsyFetch(`/application/shops/${process.env.ETSY_SHOP_ID}/appearance/banner`, {
        method: "POST",
        body: JSON.stringify({ image_url: BANNER, alt_text: "Shop banner" })
      });
    } catch (e) { results.banner_error = e; }
  }
  if (AVATAR) {
    try {
      results.avatar = await etsyFetch(`/application/shops/${process.env.ETSY_SHOP_ID}/appearance/icon`, {
        method: "POST",
        body: JSON.stringify({ image_url: AVATAR, alt_text: "Shop icon" })
      });
    } catch (e) { results.avatar_error = e; }
  }
  return NextResponse.json(results);
}
