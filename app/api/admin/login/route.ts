import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  const ok =
    email === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS;

  if (!ok) {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.headers.append(
    "Set-Cookie",
    `ea_admin=ok; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${60 * 60 * 12}`
  );
  return res;
}
