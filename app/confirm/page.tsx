"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, XCircle } from "lucide-react";

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
        router.replace("/dashboard");
      }
    };

    confirmEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="text-center space-y-6">
        {status === "loading" && (
          <>
            <Loader2 className="w-8 h-8 mx-auto animate-spin" />
            <p className="text-lg">Verifying your email…</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-8 h-8 mx-auto text-red-500" />
            <p className="text-lg text-red-400">Error: {errorMsg}</p>
            <p className="text-zinc-400">Please try the confirmation link again or sign up again.</p>
          </>
        )}
      </div>
    </div>
  );
}
