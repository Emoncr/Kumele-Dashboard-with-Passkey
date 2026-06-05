import { NextResponse } from "next/server";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { db } from "@/app/lib/db";
import { createSession } from "@/app/lib/session";

const rpID = process.env.NODE_ENV === "production" ? "kumele-dashboard.vercel.app" : "localhost";
const expectedOrigin = process.env.NODE_ENV === "production" ? "https://kumele-dashboard.vercel.app" : "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const { username, response } = await req.json();

    const user = db.getUserByUsername(username);
    if (!user || !user.currentChallenge) {
      return NextResponse.json({ error: "User or challenge not found" }, { status: 400 });
    }

    const authenticator = db.getAuthenticatorById(response.id);
    if (!authenticator) {
      return NextResponse.json({ error: "Authenticator not found" }, { status: 400 });
    }

    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response,
        expectedChallenge: user.currentChallenge,
        expectedOrigin,
        expectedRPID: rpID,
        credential: {
          id: authenticator.credentialID,
          publicKey: authenticator.credentialPublicKey as any,
          counter: authenticator.counter,
          transports: authenticator.transports as any,
        },
        requireUserVerification: false,
      });
    } catch (error: any) {
      console.error("Authentication verification failed:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { verified, authenticationInfo } = verification;

    if (verified && authenticationInfo) {
      // Update counter
      db.updateAuthenticatorCounter(authenticator.credentialID, authenticationInfo.newCounter);
      
      // Clear challenge
      db.updateUserChallenge(user.id, "");

      // Log the user in
      await createSession(user.id, user.username);

      return NextResponse.json({ verified: true });
    }

    return NextResponse.json({ verified: false, error: "Verification failed" }, { status: 400 });
  } catch (error: any) {
    console.error("Verify login error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
