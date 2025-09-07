import { useRef } from 'react'

const Controls = ({ videoSrc, setVideoSrc, videoType, setVideoType }) => {
  const fileInputRef = useRef(null)

  const handleUrlChange = (e) => {
    const url = e.target.value
    if (url) {
      // Check if it's a YouTube URL
      const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
      const match = url.match(youtubeRegex)
      
      if (match) {
        setVideoType('youtube')
        // Preserve the original URL with t parameter for the components to extract
        setVideoSrc(url)
      } else {
        setVideoType('url')
        setVideoSrc(url)
      }
    } else {
      setVideoSrc('')
      setVideoType('')
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setVideoSrc(url)
      setVideoType('local')
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex justify-between">
      <input
        type="text"
        placeholder="Enter YouTube URL or video URL"
        defaultValue={videoSrc}
        onChange={handleUrlChange}
        className="px-3 py-2 border border-gray-300 rounded-lg w-80 text-sm"
      />
      <button
        onClick={handleUploadClick}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Upload Your Own Video
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  )
}

export default Controls