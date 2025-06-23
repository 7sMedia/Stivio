import Navbar from '../components/Navbar'
import UploadForm from '../components/UploadForm'
import VideoList from '../components/VideoList'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-400">
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-8">
        {/* HERO */}
        <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col items-center text-center mb-6">
          <img src="/logo.png" alt="Stivio Logo" className="w-20 h-20 mb-4 rounded-full shadow-lg border-2 border-white/70" />
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 mb-2 animate-fadein">
            Stivio
          </h1>
          <p className="text-lg text-white/90 mb-4 font-semibold">Turn your photos into animated videos with AI, in seconds.</p>
          <a
            href="#upload"
            className="mt-2 inline-block bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:scale-105 hover:shadow-xl transition transform duration-300"
          >
            Try it now
          </a>
        </div>
        <UploadForm />
        <VideoList />
      </main>
    </div>
  )
}
