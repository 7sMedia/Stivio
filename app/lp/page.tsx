import React from "react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white font-sans">
      <header className="px-6 py-10 flex flex-col items-center text-center relative">
        <a href="/login" className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full text-sm font-medium transition">Login</a>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
          Beta7
        </h1>
        <p className="mt-3 text-xl text-gray-300 max-w-xl">
          AI that turns your everyday photos into stunning, social-ready videos. Fully automated. Effortlessly futuristic.
        </p>
        <button className="mt-8 px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-lg font-medium transition shadow-lg">
          Join the Waitlist
        </button>
      </header>

      <section className="px-6 py-16 text-center">
        <h2 className="text-4xl font-bold mb-6">What Makes Beta7 Special?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-900 p-6 rounded-xl shadow-xl border border-blue-800">
            <h3 className="text-2xl font-semibold mb-2">Zero Editing</h3>
            <p className="text-gray-400">Just drop your images. Beta7 handles the rest — automatically transforms them into scroll-stopping videos.</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl shadow-xl border border-purple-800">
            <h3 className="text-2xl font-semibold mb-2">AI-Driven Templates</h3>
            <p className="text-gray-400">Use our smart industry templates or customize your own. Every video feels on-brand and intentional.</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl shadow-xl border border-cyan-800">
            <h3 className="text-2xl font-semibold mb-2">Auto-Schedule + Post</h3>
            <p className="text-gray-400">Connect your socials and approve videos before we auto-post them at peak engagement times.</p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-gradient-to-r from-indigo-800 via-indigo-900 to-gray-950 text-center">
        <h3 className="text-3xl font-bold">Designed for Modern Small Businesses</h3>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          Whether you're a salon, auto shop, realtor, or coach — Beta7 helps you stay visible without hiring a content team.
        </p>
        <button className="mt-8 px-8 py-3 rounded-full bg-white text-indigo-700 font-semibold transition hover:bg-gray-100 shadow">
          Get Early Access
        </button>
      </section>

      <footer className="p-6 text-center text-sm text-gray-500 border-t border-gray-700">
        &copy; 2025 Beta7. All rights reserved.
      </footer>
    </main>
  );
}
