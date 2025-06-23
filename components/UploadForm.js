import { useState } from 'react'

export default function UploadForm() {
  const [image, setImage] = useState(null)
  const [prompt, setPrompt] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Image and prompt submitted!')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow mb-4 flex flex-col gap-3">
      <label className="block font-semibold">Upload Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={e => setImage(e.target.files[0])}
        className="border rounded p-2"
        required
      />
      <input
        type="text"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        className="border rounded p-2"
        placeholder="Enter animation prompt"
        required
      />
      <button className="bg-blue-500 text-white rounded p-2 font-semibold hover:bg-blue-600 transition">
        Submit
      </button>
    </form>
  )
}
