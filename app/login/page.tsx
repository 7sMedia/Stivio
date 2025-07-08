"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);

    if (error) {
      setMessage("Login failed. Please try again.");
    } else {
      setMessage("Magic link sent! Check your email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-md w-full space-y-6 p-6 border border-gray-700 rounded-xl bg-gray-900">
        <h1 className="text-2xl font-bold text-center">Login to Beta7</h1>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md"
        />
        <button
          onClick={handleLogin}
          disabled={loading || !email}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>
        {message && <p className="text-center text-sm text-gray-400">{message}</p>}
      </div>
    </div>
  );
}
