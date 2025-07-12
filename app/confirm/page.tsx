"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, XCircle, CheckCircle } from "lucide-react";

export default function ConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const confirmEmail = async () => {
      const code = searchParams.get("code");

      if (!code) {
        setStatus("error");
        setErrorMsg("Missing confirmation code.");
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setStatus("error");
        setErrorMsg(error.message);
      } else {
        setStatus("success");
        setTimeout(() => router.replace("/dashboard"), 1500);
      }
    };

    confirmEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold tracking-tight mb-2 animate-pulse text-sky-400">Beta7</h1>

        {status === "loading" && (
          <>
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-zinc-300" />
            <p className="text-lg">Verifying your email…</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-8 h-8 mx-auto text-green-400" />
            <p className="text-lg font-medium">Email confirmed!</p>
            <p className="text-zinc-400">Redirecting you to your dashboard…</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-8 h-8 mx-auto text-red-500" />
            <p className="text-lg text-red-400 font-medium">Error: {errorMsg}</p>
            <p className="text-zinc-400">Please try the confirmation link again or sign up again.</p>
          </>
        )}
      </div>
    </div>
  );
}
