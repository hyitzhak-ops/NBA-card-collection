import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  getSessionCookieOptions,
} from "@/lib/adminSession";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as { username?: unknown }).username !== "string" ||
    typeof (body as { password?: unknown }).password !== "string"
  ) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const { username, password } = body as { username: string; password: string };

  const expectedUser = process.env.ADMIN_USERNAME ?? "";
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedUser || !expectedPass) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const okUser = safeEqual(username, expectedUser);
  const okPass = safeEqual(password, expectedPass);
  if (!okUser || !okPass) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let token: string;
  try {
    token = createSessionToken(username);
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const res = NextResponse.json({ ok: true, username });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, getSessionCookieOptions());
  return res;
}
