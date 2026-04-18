import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE_NAME = "store_admin_session";

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function tokenFromCredentials(email: string, password: string, secret: string) {
  return sha256(`${email}:${password}:${secret}`);
}

function safeHexEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(left, "hex"), Buffer.from(right, "hex"));
}

function getConfiguredAdminCredentials() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.AUTH_SECRET;

  if (!email || !password || !secret) {
    return null;
  }

  return { email, password, secret };
}

export function canUseAdminAuth() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.AUTH_SECRET);
}

export function validateAdminLogin(emailInput: string, passwordInput: string) {
  const configured = getConfiguredAdminCredentials();
  if (!configured) {
    return false;
  }

  const normalizedEmail = emailInput.trim().toLowerCase();
  const normalizedConfiguredEmail = configured.email.trim().toLowerCase();

  const expected = tokenFromCredentials(normalizedConfiguredEmail, configured.password, configured.secret);
  const received = tokenFromCredentials(normalizedEmail, passwordInput, configured.secret);
  return safeHexEqual(received, expected);
}

function expectedSessionToken() {
  const configured = getConfiguredAdminCredentials();
  if (!configured) {
    return null;
  }

  return tokenFromCredentials(configured.email.trim().toLowerCase(), configured.password, configured.secret);
}

export async function issueAdminSessionCookie() {
  const token = expectedSessionToken();
  if (!token) {
    throw new Error("Autenticação administrativa indisponível.");
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

export async function isAdminAuthenticated() {
  const token = expectedSessionToken();
  if (!token) {
    return false;
  }

  const cookieStore = await cookies();
  const stored = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!stored) {
    return false;
  }

  return safeHexEqual(stored, token);
}
