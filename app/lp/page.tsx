import React from "react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans">
      <header className="px-6 py-10 text-center">
        <h1 className="text-5xl font-bold tracking-tight">Beta7</h1>
        <p className="mt-3 text-xl text-gray-400">Your AI-Powered Social Media Assistant</p>
      </header>

      <section className="px-6 py-12 text-center">
        <h2 className="text-3xl font-semibold">Drop photos. Get videos. Stay visible.</h2>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          Beta7 converts your everyday business photos into branded AI-generated videos and schedules them to post on your social platforms automatically.
        </p>
        <button className="mt-8 px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-lg font-medium transition">Join the Waitlist</button>
      </section>

      <section className="px-6 py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Who It's For:</h3>
            <ul className="space-y-2 text-gray-300 list-disc list-inside">
              <li>Salons, gyms, barbershops</li>
              <li>Auto shops & wrap installers</li>
              <li>Realtors & Airbnb hosts</li>
              <li>Fitness coaches, dentists, therapists</li>
              <li>Any business that wants to stay active online</li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">How It Works:</h3>
            <ol className="space-y-3 text-gray-300 list-decimal list-inside">
              <li>Connect your Dropbox and social media accounts</li>
              <li>Drop photos into your input folder</li>
              <li>Review and approve AI-generated videos</li>
              <li>Schedule or auto-post to social media</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-gradient-to-r from-blue-700 to-purple-700 text-center">
        <h3 className="text-3xl font-bold">Automate your content. Reclaim your time.</h3>
        <p className="mt-4 text-lg text-white max-w-2xl mx-auto">
          Beta7 takes the stress out of content creation so you can focus on running your business. Let AI handle your socials.
        </p>
        <button className="mt-8 px-8 py-3 rounded-full bg-white text-blue-700 font-semibold transition hover:bg-gray-100">
          Get Early Access
        </button>
      </section>

      <footer className="p-6 text-center text-sm text-gray-500">
        &copy; 2025 Beta7. All rights reserved.
      </footer>
    </main>
  );
}
