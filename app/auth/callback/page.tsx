"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, XCircle, CheckCircle2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const handleRedirect = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setStatus("error");
        setErrorMsg("This login link may have expired. Try again.");
      } else {
        setStatus("success");
        setTimeout(() => router.replace("/dashboard"), 1500);
      }
    };

    handleRedirect();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Piksion</h1>

        {status === "loading" && (
          <>
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-zinc-300" />
            <p className="text-lg">Verifying your login…</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="w-8 h-8 mx-auto text-green-400" />
            <p className="text-lg font-medium text-green-400">You're confirmed. Welcome to Piksion!</p>
            <p className="text-zinc-400">Redirecting to your dashboard…</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-8 h-8 mx-auto text-red-500" />
            <p className="text-lg text-red-400 font-medium">Error: {errorMsg}</p>
            <p className="text-zinc-400">Please check your email and try again.</p>
            <a
              href="/"
              className="inline-block mt-4 text-sm text-accent underline hover:text-white transition"
            >
              Go back to login
            </a>
          </>
        )}
      </div>
    </div>
  );
}
