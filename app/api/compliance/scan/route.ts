import { NextRequest, NextResponse } from "next/server";
const TM_BLACKLIST = ["disney","harry potter","star wars","marvel","nba","nfl","hello kitty","pokemon","barbie","taylor swift","swifties","lego","minecraft","fortnite","f1","olympics"];
export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text) return NextResponse.json({ error: "Provide text" }, { status: 400 });
  const lower = String(text).toLowerCase();
  const hits = TM_BLACKLIST.filter(w => lower.includes(w));
  return NextResponse.json({ ok: hits.length === 0, hits });
}
