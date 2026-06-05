import { NextResponse } from "next/server";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import { db } from "@/app/lib/db";
import { createSession } from "@/app/lib/session";

const rpID = "localhost";
const expectedOrigin = "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const { username, response } = await req.json();

    const user = db.getUserByUsername(username);
    if (!user || !user.currentChallenge) {
      return NextResponse.json({ error: "User or challenge not found" }, { status: 400 });
    }

    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response,
        expectedChallenge: user.currentChallenge,
        expectedOrigin,
        expectedRPID: rpID,
        requireUserVerification: false,
      });
    } catch (error: any) {
      console.error("Verification failed:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
      const { credential } = registrationInfo;
      const { publicKey, id, counter } = credential;

      // Save the authenticator info to the DB
      db.saveAuthenticator({
        credentialID: id,
        credentialPublicKey: publicKey,
        counter,
        userId: user.id,
      });

      // Clear the challenge
      db.updateUserChallenge(user.id, "");

      // Log the user in via session cookie
      await createSession(user.id, user.username);

      return NextResponse.json({ verified: true });
    }

    return NextResponse.json({ verified: false, error: "Verification failed" }, { status: 400 });
  } catch (error: any) {
    console.error("Verify reg error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
