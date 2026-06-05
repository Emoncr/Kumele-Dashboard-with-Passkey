import { NextResponse } from "next/server";
import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { db } from "@/app/lib/db";

const rpID = process.env.NODE_ENV === "production" ? "kumele-dashboard.vercel.app" : "localhost";

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const user = db.getUserByUsername(username);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userAuthenticators = db.getUserAuthenticators(user.id);
    if (userAuthenticators.length === 0) {
      return NextResponse.json({ error: "No passkeys registered for this user" }, { status: 400 });
    }

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: userAuthenticators.map((authenticator) => ({
        id: authenticator.credentialID,
        type: "public-key",
      })),
      userVerification: "preferred",
    });

    db.updateUserChallenge(user.id, options.challenge);

    return NextResponse.json(options);
  } catch (error: any) {
    console.error("Generate login options error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
