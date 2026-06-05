import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "kumele_session";

export async function createSession(userId: string, username: string) {
  const cookieStore = await cookies();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  // In a real app, you would encrypt this payload with a secret (e.g. jose or iron-session).
  // For this mock implementation, we just store it base64 encoded.
  const payload = Buffer.from(JSON.stringify({ userId, username, expiresAt })).toString("base64");

  cookieStore.set(SESSION_COOKIE_NAME, payload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (!sessionData) return null;
  
  try {
    const payload = JSON.parse(Buffer.from(sessionData, "base64").toString("utf-8"));
    if (new Date(payload.expiresAt) < new Date()) {
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
