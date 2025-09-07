import { forwardRef, useEffect } from 'react'

const VideoPlayer = forwardRef(({ videoSrc, videoType, isPlaying, setIsPlaying, onTimeUpdate, onDurationChange }, ref) => {
  useEffect(() => {
    if (ref.current) {
      if (isPlaying) {
        ref.current.play()
      } else {
        ref.current.pause()
      }
    }
  }, [isPlaying, ref])

  const handleTimeUpdate = () => {
    if (ref.current && onTimeUpdate) {
      onTimeUpdate(ref.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (ref.current && onDurationChange) {
      onDurationChange(ref.current.duration)
    }
  }

  if (videoType === 'youtube') {
    // YouTube iframe will be handled separately
    return null
  }

  return (
    <video
      ref={ref}
      src={videoSrc}
      className="w-full h-full object-cover"
      style={{ pointerEvents: "none" }}
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      muted
    />
  )
})

VideoPlayer.displayName = 'VideoPlayer'

export default VideoPlayer