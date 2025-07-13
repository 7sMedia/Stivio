"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "updating" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setStatus("error");
      }
    };
    checkSession();
  }, []);

  const handleReset = async () => {
    setStatus("updating");
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      setStatus("done");
      setTimeout(() => router.replace("/"), 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white px-4">
      <div className="max-w-md w-full border border-zinc-700 rounded-xl bg-zinc-900 p-6 space-y-6 text-center">
        <h1 className="text-3xl font-bold text-accent">Reset Password</h1>

        {status === "error" && (
          <p className="text-red-400 text-sm">Error: {error || "Session missing. Try login again."}</p>
        )}

        {status === "done" ? (
          <p className="text-green-400 text-sm animate-pulse">✅ Password updated. Redirecting…</p>
        ) : (
          <>
            <Input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-800 text-white"
            />
            <Button
              onClick={handleReset}
              disabled={status === "updating" || !password}
              className="w-full"
            >
              {status === "updating" ? "Updating…" : "Reset Password"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
