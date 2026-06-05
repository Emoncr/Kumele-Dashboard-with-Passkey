import { NextResponse } from "next/server";
import { generateRegistrationOptions } from "@simplewebauthn/server";
import { db } from "@/app/lib/db";
import { v4 as uuidv4 } from "uuid";

// We use localhost for dev
const rpName = "Kumele Dashboard";
const rpID = "localhost";

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Find or create user
    let user = db.getUserByUsername(username);
    if (!user) {
      user = { id: uuidv4(), username };
      db.createUser(user);
    }

    const userAuthenticators = db.getUserAuthenticators(user.id);

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: new Uint8Array(Buffer.from(user.id)),
      userName: user.username,
      // Don't prompt users to register an authenticator that they've already registered
      excludeCredentials: userAuthenticators.map((authenticator) => ({
        id: authenticator.credentialID,
        type: "public-key",
      })),
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
        authenticatorAttachment: "platform", // Enforce platform authenticators (FaceID/TouchID/Windows Hello)
      },
    });

    // Remember the challenge for this user
    db.updateUserChallenge(user.id, options.challenge);

    return NextResponse.json(options);
  } catch (error: any) {
    console.error("Generate reg options error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
