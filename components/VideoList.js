export default function VideoList() {
  const mockVideos = [
    { id: 1, status: "processing", name: "MyImage1.jpg" },
    { id: 2, status: "done", name: "Sunset.png", url: "https://sample-videos.com/video123.mp4" }
  ]

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-2">Your Videos</h2>
      <ul>
        {mockVideos.map(video => (
          <li key={video.id} className="py-2 border-b last:border-0 flex items-center justify-between">
            <span>{video.name} ({video.status})</span>
            {video.status === "done" && (
              <a href={video.url} target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 underline ml-2">Preview</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
