// app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "components/ui/button";
import { Card, CardContent } from "components/ui/card";
import { Input } from "components/ui/input";
import { User, Lock, UploadCloud, Image as ImageIcon } from "lucide-react";
import { supabase } from "lib/supabaseClient";

function GradientBackground({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        min-h-screen min-h-[100dvh] w-full flex flex-col items-center justify-center
        bg-gradient-to-br from-indigo-900 via-violet-900 to-black relative
        pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
        sm:pt-0 sm:pb-0
      "
      style={{
        paddingTop: "max(env(safe-area-inset-top, 0px), 1.5rem)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
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

  // Redirect if already signed in
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
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else router.replace("/dashboard");
  };

  if (page === "landing") {
    return (
      <GradientBackground>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Glowing, animated background shape & logo */}
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

          {/* Headline */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold mt-10 text-center text-white leading-tight font-display drop-shadow-xl"
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

          {/* Buttons */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Button size="lg" onClick={() => setPage("signup")}>
              Get Started Free
            </Button>
            <Button variant="outline" onClick={() => setPage("login")}>
              Login
            </Button>
          </motion.div>

          {/* Hero video */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-14 flex justify-center"
          >
            <div className="rounded-2xl shadow-2xl bg-black/40 border-4 border-indigo-600/40 p-2">
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

          {/* Feature bubbles */}
          <div className="mt-12 flex flex-col md:flex-row gap-8 justify-center items-center">
            <div className="bg-indigo-800/70 rounded-2xl p-6 flex items-center gap-4 shadow-xl">
              <UploadCloud className="text-sky-400" size={32} />
              <span className="text-lg text-indigo-100 font-semibold">Upload images</span>
            </div>
            <div className="bg-indigo-800/70 rounded-2xl p-6 flex items-center gap-4 shadow-xl">
              <ImageIcon className="text-pink-400" size={32} />
              <span className="text-lg text-indigo-100 font-semibold">AI animates</span>
            </div>
            <div className="bg-indigo-800/70 rounded-2xl p-6 flex items-center gap-4 shadow-xl">
              <User className="text-green-400" size={32} />
              <span className="text-lg text-indigo-100 font-semibold">Share anywhere</span>
            </div>
          </div>
        </motion.div>
      </GradientBackground>
    );
  }

  // Signup/Login forms
  return (
    <GradientBackground>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md mx-auto mt-24"
      >
        <Card className="p-8 rounded-2xl shadow-2xl bg-indigo-900/90 border-0">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <ImageIcon size={32} className="text-indigo-100" />
              <h2 className="text-3xl font-bold text-white mb-2">
                {page === "signup" ? "Sign Up" : "Login"}
              </h2>
              <div className="w-full flex flex-col gap-4">
                <div className="flex items-center gap-2 bg-indigo-800/60 px-4 rounded-xl">
                  <User size={20} className="text-indigo-300" />
                  <Input
                    placeholder="Email"
                    className="bg-transparent border-0 text-indigo-100 placeholder:text-indigo-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 bg-indigo-800/60 px-4 rounded-xl">
                  <Lock size={20} className="text-indigo-300" />
                  <Input
                    placeholder="Password"
                    type="password"
                    className="bg-transparent border-0 text-indigo-100 placeholder:text-indigo-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && <div className="text-pink-300 text-sm mt-2">{error}</div>}

              <Button onClick={page === "signup" ? handleSignup : handleLogin}>
                {page === "signup" ? "Create Account" : "Login"}
              </Button>

              <Button
                variant="ghost"
                className="text-indigo-300 mt-2"
                onClick={() => setPage(page === "signup" ? "login" : "signup")}
              >
                {page === "signup"
                  ? "Already have an account? Login"
                  : "New here? Sign Up"}
              </Button>

              <Button
                variant="ghost"
                className="text-indigo-400 mt-2"
                onClick={() => setPage("landing")}
              >
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </GradientBackground>
  );
}
