"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, XCircle } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const handleRedirect = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setStatus("error");
        setErrorMsg("This login link may have expired. Try again.");
      } else {
        setTimeout(() => router.replace("/dashboard"), 1500);
      }
    };

    handleRedirect();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold tracking-tight mb-2 animate-pulse text-accent">Piksion</h1>

        {status === "loading" && (
          <>
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted" />
            <p className="text-lg">Verifying your login…</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-8 h-8 mx-auto text-red-500" />
            <p className="text-lg text-red-400 font-medium">Error: {errorMsg}</p>
            <p className="text-muted">Please check your email and try again.</p>
          </>
        )}
      </div>
    </div>
  );
}
