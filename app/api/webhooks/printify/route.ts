import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const event = await req.json().catch(()=> ({}));
  console.log("PRINTIFY WEBHOOK:", JSON.stringify(event));
  return NextResponse.json({ ok: true });
}
