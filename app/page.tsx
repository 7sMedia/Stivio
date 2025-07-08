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
      if (session) router.replace("/dashboard");
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

  if (page === "landing") {
    return (
      <GradientBackground>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="relative flex flex-col items-center mb-12 mt-20">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.08, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
              className="absolute -top-24 left-1/2 -translate-x-1/2 z-0"
              style={{ width: 380, height: 380 }}
            >
              <svg width="380" height="380" viewBox="0 0 380 380" fill="none">
                <defs>
                  <radialGradient id="g1" cx="50%" cy="50%" r="75%">
                    <stop stopColor="#a5b4fc" stopOpacity="0.7" />
                    <stop offset="0.6" stopColor="#a78bfa" stopOpacity="0.38" />
                    <stop offset="1" stopColor="#0ea5e9" stopOpacity="0.17" />
                  </radialGradient>
                </defs>
                <circle cx="190" cy="190" r="155" fill="url(#g1)" />
              </svg>
            </motion.div>
            <div className="relative z-10 flex items-center gap-3">
              <ImageIcon size={48} className="text-indigo-100 drop-shadow-xl" />
              <span className="text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-xl font-display">
                Beta7
              </span>
            </div>
          </div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold mt-10 text-center leading-tight drop-shadow-xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Bring{" "}
            <span className="bg-gradient-to-r from-sky-400 to-fuchsia-500 bg-clip-text text-transparent">
              Still Images
            </span>{" "}
            to Life
            <br />
            with{" "}
            <span className="bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
              AI Video Creation
            </span>
          </motion.h1>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Button className="text-lg px-6 py-3" onClick={() => setPage("signup")}>
              Get Started Free
            </Button>
            <Button className="text-lg px-6 py-3 border border-text-secondary" onClick={() => setPage("login")}>
              Login
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-14 flex justify-center"
          >
            <div className="rounded-2xl shadow-md bg-surface-primary border-4 border-accent p-2">
              <video className="rounded-xl w-[350px] md:w-[560px] max-w-full" src="/hero-demo.mp4" autoPlay loop muted playsInline />
            </div>
          </motion.div>

          <div className="mt-12 flex flex-col md:flex-row gap-8 justify-center">
            <Card className="flex items-center gap-4 bg-surface-secondary p-6">
              <UploadCloudIcon className="text-accent" size={32} />
              <span className="text-base text-text-secondary font-semibold">
                Upload images
              </span>
            </Card>
            <Card className="flex items-center gap-4 bg-surface-secondary p-6">
              <ImageIcon className="text-accent" size={32} />
              <span className="text-base text-text-secondary font-semibold">
                AI animates
              </span>
            </Card>
            <Card className="flex items-center gap-4 bg-surface-secondary p-6">
              <UserIcon className="text-accent" size={32} />
              <span className="text-base text-text-secondary font-semibold">
                Share anywhere
              </span>
            </Card>
          </div>
        </motion.div>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md mx-auto mt-24"
      >
        <Card>
          <div className="flex flex-col items-center gap-6">
            <ImageIcon size={32} className="text-text-secondary" />
            <h2 className="text-3xl font-bold mb-2">
              {page === "signup" ? "Sign Up" : "Login"}
            </h2>

            <div className="w-full flex flex-col gap-4">
              <div className="flex items-center gap-2 bg-surface-secondary rounded-lg px-4 py-2">
                <UserIcon size={20} className="text-text-muted" />
                <Input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent placeholder:text-text-muted"
                />
              </div>
              <div className="flex items-center gap-2 bg-surface-secondary rounded-lg px-4 py-2">
                <LockIcon size={20} className="text-text-muted" />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent placeholder:text-text-muted"
                />
              </div>
            </div>

            {error && <div className="text-pink-300 text-sm">{error}</div>}

            <Button className="w-full py-3" onClick={page === "signup" ? handleSignup : handleLogin}>
              {page === "signup" ? "Create Account" : "Login"}
            </Button>

            <Button className="w-full py-3 text-text-secondary" onClick={() => setPage(page === "signup" ? "login" : "signup")}>
              {page === "signup" ? "Already have an account? Login" : "New here? Sign Up"}
            </Button>

            <Button className="w-full py-3 text-accent" onClick={() => setPage("landing")}>
              ← Back to Home
            </Button>
          </div>
        </Card>
      </motion.div>
    </GradientBackground>
  );
}
