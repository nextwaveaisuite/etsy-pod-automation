import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.append(
    "Set-Cookie",
    "ea_admin=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0"
  );
  return res;
}
