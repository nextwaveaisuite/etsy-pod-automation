import { NextRequest, NextResponse } from "next/server";
import { getSetting, setSetting, feeDefaults } from "@/lib/settings";

export const dynamic = 'force-dynamic';

export async function GET() {
  const defaults = {
    default_shipping_profile_id: Number(process.env.DEFAULT_SHIPPING_PROFILE_ID || 0) || undefined,
    printify: {
      shop_id: process.env.PRINTIFY_SHOP_ID || "",
      provider_id: 1,
      blueprint_id: 6,
      variants: [{ id: 401, price: 1895, is_enabled: true }]
    },
    fees: feeDefaults()
  };
  const saved = {
    default_shipping_profile_id: await getSetting("default_shipping_profile_id"),
    printify: await getSetting("printify_defaults"),
    fees: await getSetting("fees")
  };
  return NextResponse.json({ defaults, saved });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  if (body.default_shipping_profile_id !== undefined) {
    await setSetting("default_shipping_profile_id", body.default_shipping_profile_id);
  }
  if (body.printify) await setSetting("printify_defaults", body.printify);
  if (body.fees) await setSetting("fees", body.fees);
  return NextResponse.json({ ok: true });
}

