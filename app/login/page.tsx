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
    <div className="min-h-screen flex items-center justify-center bg-background text-white px-4">
      <div className="max-w-md w-full space-y-6 p-6 border border-zinc-700 rounded-2xl bg-[#1A1A1A] shadow-md">
        <h1 className="text-3xl font-bold text-primary text-center">Piksion</h1>
        <p className="text-sm text-zinc-400 text-center -mt-2">Login to your account</p>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-zinc-500"
        />
        <button
          onClick={handleLogin}
          disabled={loading || !email}
          className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md font-medium"
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>
        {message && (
          <p className="text-center text-sm text-zinc-400">{message}</p>
        )}
      </div>
    </div>
  );
}
