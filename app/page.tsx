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
    <div className="min-h-screen w-screen overflow-hidden bg-gradient-to-br from-primary via-[#1A1A1A] to-background text-white relative flex flex-col items-center justify-center">
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute -top-48 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] rounded-full bg-accent/20 blur-3xl"
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/dashboard");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) router.replace("/dashboard");
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.replace("/dashboard");
  };

  const handleSignup = async () => {
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://beta7mvp.vercel.app/auth/callback",
      },
    });
    if (error) setError(error.message);
    else setError("Check your email to confirm your account.");
  };

  if (page === "landing") {
    return (
      <GradientBackground>
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
          <div className="relative flex flex-col items-center mb-12 mt-20">
            <motion.div
              animate={{ rotate: [0, 360], scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
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
                Piksion
              </span>
            </div>
          </div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold mt-10 text-center leading-tight drop-shadow-xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Image In.{" "}
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Motion Out.
            </span>
            <br />
            More Social Reach...
          </motion.h1>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Button
              className="text-lg px-6 py-3 bg-accent hover:bg-accent/80 text-black font-semibold rounded-xl"
              onClick={() => setPage("signup")}
            >
              Create Login
            </Button>
            <Button
              className="text-lg px-6 py-3 border border-accent text-accent hover:bg-accent/10 font-semibold rounded-xl"
              onClick={() => setPage("login")}
            >
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
              <video
                className="rounded-xl w-[350px] md:w-[560px] max-w-full"
                src="/hero-demo.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </motion.div>
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
        <Card className="bg-surface-primary border border-zinc-700">
          <div className="flex flex-col items-center gap-6 p-6">
            <ImageIcon size={32} className="text-accent" />
            <h2 className="text-3xl font-bold mb-2">{page === "signup" ? "Create Account" : "Login"}</h2>

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

            <Button
              className="w-full py-3 bg-primary hover:bg-primary/90"
              onClick={page === "signup" ? handleSignup : handleLogin}
            >
              {page === "signup" ? "Sign Up" : "Login"}
            </Button>

            {page === "login" && (
              <button
                onClick={async () => {
                  if (!email) return setError("Enter your email first.");
                  const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: "https://beta7mvp.vercel.app/reset-password",
                  });
                  if (error) setError(error.message);
                  else setError("Check your email to reset your password.");
                }}
                className="text-sm text-sky-400 underline mt-2"
              >
                Forgot password?
              </button>
            )}

            <Button
              variant="ghost"
              className="w-full py-3 text-text-secondary"
              onClick={() => setPage(page === "signup" ? "login" : "signup")}
            >
              {page === "signup" ? "Already have an account? Login" : "New here? Create Account"}
            </Button>

            <Button
              variant="ghost"
              className="w-full py-3 text-accent"
              onClick={() => setPage("landing")}
            >
              ← Back to Home
            </Button>
          </div>
        </Card>
      </motion.div>
    </GradientBackground>
  );
}
