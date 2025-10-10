import { NextRequest, NextResponse } from "next/server";
import { feeDefaults, getSetting, setSetting, getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

/**
 * GET /api/settings
 * Returns defaults (static) + saved (in-memory/env-backed) settings.
 */
export async function GET() {
  const app = getSettings();

  const defaults = {
    mode: "private", // private | invite | public
    providers: {
      printify: true,
      printful: false,
      gelato: false,
      customcat: false,
    },
    automation: {
      autoPublish: false,
      autoPrice: true,
      autoSEO: true,
    },
    fees: feeDefaults, // <— NOTE: object, not a function
  };

  const saved = {
    default_shipping_profile_id: getSetting("default_shipping_profile_id", ""),
    etsy_section_id: getSetting("etsy_section_id", ""),
    currency: getSetting("currency", "USD"),
    baseUrl: app.baseUrl,
    bucket: app.bucket,
    isSupabaseEnabled: app.isSupabaseEnabled,
    etsyShopId: app.etsyShopId || "",
    printifyShopId: app.printifyShopId || "",
  };

  return NextResponse.json({ defaults, saved });
}

/**
 * POST /api/settings
 * Body example:
 * {
 *   "saved": {
 *     "default_shipping_profile_id": "123",
 *     "etsy_section_id": "456",
 *     "currency": "USD"
 *   }
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body && typeof body.saved === "object" && body.saved !== null) {
      for (const [key, value] of Object.entries(body.saved)) {
        // store as string (simple in-memory fallback in lib/settings.ts)
        setSetting(key, String(value ?? ""));
      }
    }

    // Return the updated snapshot
    const app = getSettings();
    const saved = {
      default_shipping_profile_id: getSetting("default_shipping_profile_id", ""),
      etsy_section_id: getSetting("etsy_section_id", ""),
      currency: getSetting("currency", "USD"),
      baseUrl: app.baseUrl,
      bucket: app.bucket,
      isSupabaseEnabled: app.isSupabaseEnabled,
      etsyShopId: app.etsyShopId || "",
      printifyShopId: app.printifyShopId || "",
    };

    return NextResponse.json({ ok: true, saved });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Invalid request" },
      { status: 400 }
    );
  }
}
