"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, XCircle } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const handleRedirect = async () => {
      const code = searchParams.get("code");

      if (!code) {
        setStatus("error");
        setErrorMsg("Missing auth code.");
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setStatus("error");
        setErrorMsg(error.message);
      } else {
        setTimeout(() => router.replace("/dashboard"), 1500);
      }
    };

    handleRedirect();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold tracking-tight mb-2 animate-pulse text-sky-400">Beta7</h1>

        {status === "loading" && (
          <>
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-zinc-300" />
            <p className="text-lg">Logging you in…</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-8 h-8 mx-auto text-red-500" />
            <p className="text-lg text-red-400 font-medium">Error: {errorMsg}</p>
            <p className="text-zinc-400">This login link may have expired. Try again.</p>
          </>
        )}
      </div>
    </div>
  );
}
