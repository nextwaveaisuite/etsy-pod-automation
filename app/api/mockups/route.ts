// app/api/mockups/route.ts
import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/settings";

export async function GET() {
  const supabase = getSupabase();

  // Example: read mockups list; if Supabase not configured, return demo data
  if (!supabase) {
    return NextResponse.json({
      source: "demo",
      items: [
        { id: "demo-1", name: "T-Shirt Mockup", status: "ready" },
        { id: "demo-2", name: "Mug Mockup", status: "ready" }
      ]
    });
  }

  // Adjust to your real table if you have one
  const { data, error } = await supabase.from("mockups").select("*").limit(50);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ source: "supabase", items: data || [] });
}
