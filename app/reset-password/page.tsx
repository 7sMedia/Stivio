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
        setError("Your reset link is missing or has expired. Please try again.");
        setStatus("error");
      }
    };
    checkSession();
  }, []);

  const handleUpdatePassword = async () => {
    setStatus("updating");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      setStatus("done");
      setTimeout(() => router.replace("/dashboard"), 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-bold text-sky-400">Reset Your Password</h1>

        {status !== "done" && status !== "error" && (
          <>
            <Input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-800 border border-zinc-600"
            />
            <Button onClick={handleUpdatePassword} className="w-full">
              Update Password
            </Button>
          </>
        )}

        {status === "done" && <p className="text-green-400">Password updated! Redirecting…</p>}

        {status === "error" && (
          <>
            <p className="text-red-400 text-sm">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.replace("/")}
            >
              ← Back to Login
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
