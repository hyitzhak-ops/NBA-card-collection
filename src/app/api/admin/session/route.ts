import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/adminSession";

export async function GET() {
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ ok: false });
  }
  const session = verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ ok: false });
  }
  return NextResponse.json({ ok: true, username: session.username });
}
