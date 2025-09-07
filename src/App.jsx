import { useState, useRef, useEffect } from 'react'
import VideoPlayer from './components/VideoPlayer'
import VideoOverlay from './components/VideoOverlay'
import SimpleYouTubePlayer from './components/SimpleYouTubePlayer'
import SimpleYouTubeOverlay from './components/SimpleYouTubeOverlay'
import OffsetSlider from './components/OffsetSlider'
import OffsetInput from './components/OffsetInput'
import Controls from './components/Controls'
import PlaybackControls from './components/PlaybackControls'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [videoSrc, setVideoSrc] = useState('https://www.youtube.com/watch?v=ipf7ifVSeDU&t=100s')
  const [isPlaying, setIsPlaying] = useState(false)
  const [offset, setOffset] = useState(1)
  const [videoType, setVideoType] = useState('youtube') // 'youtube' or 'local'
  const [mainVideoTime, setMainVideoTime] = useState(0)
  const [showOverlay, setShowOverlay] = useState(true)
  const [videoDuration, setVideoDuration] = useState(0)
  
  const videoRef = useRef(null)
  const overlayRef = useRef(null)

  // Load YouTube API once when app starts
  useEffect(() => {
    if (!window.YT && !document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  const handleMainVideoTimeUpdate = (time) => {
    setMainVideoTime(time)
  }

  const handleDurationChange = (duration) => {
    setVideoDuration(duration)
  }

  const handleSeekTo = (time) => {
    setMainVideoTime(time)
    
    // Seek both players
    if (videoRef.current) {
      if (videoRef.current.seekTo) {
        // YouTube player
        videoRef.current.seekTo(time)
      } else if (videoRef.current.currentTime !== undefined) {
        // HTML5 video
        videoRef.current.currentTime = time
      }
    }

    if (showOverlay && overlayRef.current) {
      const overlayTime = Math.max(0, time + offset)
      if (overlayRef.current.seekTo) {
        // YouTube overlay player  
        overlayRef.current.seekTo(overlayTime)
      } else if (overlayRef.current.currentTime !== undefined) {
        // HTML5 video overlay
        overlayRef.current.currentTime = overlayTime
      }
    }
  }

  const getVideoId = (url) => {
    if (!url) return null
    
    // Handle both watch and embed URLs
    let match = url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const getStartTime = (url) => {
    if (!url) return 0
    
    // Extract start time from URL parameters
    const urlObj = new URL(url)
    const startParam = urlObj.searchParams.get('t')
    
    if (startParam) {
      // Handle both '100s' and '100' formats
      const seconds = startParam.replace('s', '')
      return parseInt(seconds) || 0
    }
    
    return 0
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Controls Header */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex flex-wrap items-center gap-4">
          <Controls 
            videoSrc={videoSrc}
            setVideoSrc={setVideoSrc}
            videoType={videoType}
            setVideoType={setVideoType}
          />
        </div>

        {/* Playback Controls */}
        <div className="mb-4">
          <PlaybackControls
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            videoRef={videoRef}
            overlayRef={overlayRef}
            mainVideoTime={mainVideoTime}
            videoDuration={videoDuration}
            onSeekTo={handleSeekTo}
          />
        </div>

        {/* Offset Controls */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showOverlay"
              checked={showOverlay}
              onChange={(e) => setShowOverlay(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="showOverlay" className="text-sm font-medium text-gray-700">
              Show Overlay
            </label>
          </div>
          
          <div className="flex-1"></div>
          
          <OffsetSlider 
            offset={offset}
            setOffset={setOffset}
          />
          
          <OffsetInput 
            offset={offset}
            setOffset={setOffset}
          />
        </div>

        {/* Video Player Container */}
        <div className="relative rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {videoSrc && videoType === 'youtube' && getVideoId(videoSrc) && (
            <ErrorBoundary>
              <SimpleYouTubePlayer 
                ref={videoRef}
                videoId={getVideoId(videoSrc)}
                startTime={getStartTime(videoSrc)}
                videoUrl={videoSrc}
                isPlaying={isPlaying}
                onTimeUpdate={handleMainVideoTimeUpdate}
                onDurationChange={handleDurationChange}
                onPlayStateChange={setIsPlaying}
              />
              <SimpleYouTubeOverlay 
                ref={overlayRef}
                videoId={getVideoId(videoSrc)}
                isPlaying={isPlaying}
                mainVideoTime={mainVideoTime}
                offset={offset}
                videoUrl={videoSrc}
                style={{ display: showOverlay ? 'block' : 'none' }}
              />
            </ErrorBoundary>
          )}
          
          {videoSrc && videoType !== 'youtube' && (
            <>
              <VideoPlayer 
                ref={videoRef}
                videoSrc={videoSrc}
                videoType={videoType}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                onTimeUpdate={handleMainVideoTimeUpdate}
                onDurationChange={handleDurationChange}
              />
              <VideoOverlay 
                ref={overlayRef}
                videoSrc={videoSrc}
                videoType={videoType}
                offset={offset}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                mainVideoTime={mainVideoTime}
                style={{ display: showOverlay ? 'block' : 'none' }}
              />fix
            </>
          )}
          
          {!videoSrc && (
            <div className="flex items-center justify-center h-full text-white text-xl">
              Please select a video or enter a YouTube URL
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App