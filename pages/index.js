import Navbar from '../components/Navbar'
import UploadForm from '../components/UploadForm'
import VideoList from '../components/VideoList'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome to Stivio 👋</h1>
        <UploadForm />
        <VideoList />
      </main>
    </div>
  )
}
