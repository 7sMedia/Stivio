"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  User as UserIcon,
  Lock as LockIcon,
  UploadCloud as UploadCloudIcon,
  Image as ImageIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

function GradientBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-violet-900 to-black relative pt-[env(safe-area-inset-top,1.5rem)] pb-[env(safe-area-inset-bottom,1.5rem)]">
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute -top-48 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] rounded-full bg-indigo-400/30 blur-3xl"
        />
      </div>
      <div className="z-10 w-full flex-1 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [page, setPage] = useState<"landing" | "signup" | "login">("landing");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted && data?.session) {
        router.replace("/dashboard");
      } else {
        setHasCheckedSession(true);
      }
    };

    checkSession();

    const { data: sub } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        router.replace("/dashboard");
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogin = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.replace("/dashboard");
  };

  const handleSignup = async () => {
    setError("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else router.replace("/dashboard");
  };

  if (!hasCheckedSession) return null;

  // Everything below is the same as before ↓↓↓

  // Keep your full landing + login/signup UI here unchanged
  // (leave the rest of the code as-is from the last working version)

  // If you want I’ll resend the full block again with this merged in

  return (
    <GradientBackground>
      {/* your landing page or auth forms here */}
      <div className="text-white">Page Loaded</div>
    </GradientBackground>
  );
}
