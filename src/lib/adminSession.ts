import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";

const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function getSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or too short (min 16 characters).",
    );
  }
  return s;
}

export function createSessionToken(username: string): string {
  const payload = {
    u: username,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SEC,
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", getSecret())
    .update(payloadStr)
    .digest("base64url");
  return `${payloadStr}.${sig}`;
}

export function verifySessionToken(token: string): { username: string } | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadStr, sig] = parts;
  let expectedSig: string;
  try {
    expectedSig = createHmac("sha256", getSecret())
      .update(payloadStr)
      .digest("base64url");
  } catch {
    return null;
  }
  const got = Buffer.from(sig, "utf8");
  const expected = Buffer.from(expectedSig, "utf8");
  if (got.length !== expected.length || !timingSafeEqual(got, expected)) {
    return null;
  }
  try {
    const raw = Buffer.from(payloadStr, "base64url").toString("utf8");
    const payload = JSON.parse(raw) as { u: string; exp: number };
    if (
      typeof payload.u !== "string" ||
      typeof payload.exp !== "number" ||
      payload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return { username: payload.u };
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SEC,
  };
}
