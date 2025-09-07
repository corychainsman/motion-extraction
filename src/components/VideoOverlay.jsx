import { forwardRef, useEffect } from 'react'

const VideoOverlay = forwardRef(({ videoSrc, videoType, offset, isPlaying, setIsPlaying, mainVideoTime }, ref) => {
  useEffect(() => {
    if (ref.current) {
      if (isPlaying) {
        ref.current.play()
      } else {
        ref.current.pause()
      }
    }
  }, [isPlaying, ref])

  useEffect(() => {
    // Synchronize overlay video with main video time minus offset
    if (ref.current && mainVideoTime !== undefined) {
      const targetTime = Math.max(0, mainVideoTime - offset)
      ref.current.currentTime = targetTime
    }
  }, [mainVideoTime])

  useEffect(() => {
    // When offset changes, immediately update overlay time based on current main video time
    if (ref.current && mainVideoTime !== undefined) {
      const targetTime = Math.max(0, mainVideoTime - offset)
      ref.current.currentTime = targetTime
    }
  }, [offset])

  const handleTimeUpdate = () => {
    // Keep overlay synchronized
  }

  const handleLoadedMetadata = () => {
    // Video is ready to play
  }

  if (videoType === 'youtube') {
    // YouTube iframe will be handled separately
    return null
  }

  return (
    <video
      ref={ref}
      src={videoSrc}
      className="absolute inset-0 w-full h-full object-cover"
      style={{ filter: 'invert(1)', opacity: 0.5, pointerEvents: "none"}}
      data-overlay="true"
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      muted
    />
  )
})

VideoOverlay.displayName = 'VideoOverlay'

export default VideoOverlay