"use client";

import { useState } from "react";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    if (!username) return setMessage("Please enter a username");
    setLoading(true);
    setMessage("");

    try {
      // 1. Get registration options from server
      const resp = await fetch("/api/auth/register/generate-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const options = await resp.json();

      if (options.error) throw new Error(options.error);

      // 2. Pass options to browser to create passkey
      const attResp = await startRegistration({ optionsJSON: options });

      // 3. Send passkey to server for verification
      const verifyResp = await fetch("/api/auth/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, response: attResp }),
      });
      const verification = await verifyResp.json();

      if (verification.verified) {
        router.push("/");
      } else {
        setMessage(verification.error || "Registration failed");
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!username) return setMessage("Please enter a username");
    setLoading(true);
    setMessage("");

    try {
      // 1. Get authentication options from server
      const resp = await fetch("/api/auth/login/generate-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const options = await resp.json();

      if (options.error) throw new Error(options.error);

      // 2. Pass options to browser to authenticate with passkey
      const asseResp = await startAuthentication({ optionsJSON: options });

      // 3. Send passkey assertion to server for verification
      const verifyResp = await fetch("/api/auth/login/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, response: asseResp }),
      });
      const verification = await verifyResp.json();

      if (verification.verified) {
        router.push("/");
        router.refresh();
      } else {
        setMessage(verification.error || "Login failed");
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image src="/logo.png" alt="Logo" width={140} height={60} />
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Welcome to Kumele</h1>
        <p className="text-center text-gray-500 mb-8">Sign in or create an account using Passkeys. No password required!</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#004DFF]/20 focus:border-[#004DFF] transition-all text-black"
            />
          </div>

          {message && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {message}
            </div>
          )}

          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#004DFF] text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Log In with Passkey
            </button>
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-white text-[#004DFF] font-semibold py-3 rounded-xl border-2 border-[#004DFF] hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              Register with Passkey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
