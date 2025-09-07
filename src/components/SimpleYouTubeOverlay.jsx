import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react'

const SimpleYouTubeOverlay = forwardRef(({ videoId, isPlaying, mainVideoTime, offset }, ref) => {
  const [shouldAutoplay, setShouldAutoplay] = useState(1)
  const iframeRef = useRef(null)

  useImperativeHandle(ref, () => ({
    play: () => {
      setShouldAutoplay(1)
    },
    pause: () => {
      setShouldAutoplay(0)
    },
    getCurrentTime: () => 0,
    seekTo: (time) => {
      // Reload iframe with start time parameter including offset
      const overlayStartTime = Math.max(0, Math.floor(time + offset))
      const newUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${shouldAutoplay}&controls=0&mute=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&start=${overlayStartTime}`
      if (iframeRef.current) {
        iframeRef.current.src = newUrl
      }
    }
  }))

  useEffect(() => {
    // Update iframe src when play state changes (but not when offset changes)
    if (iframeRef.current && videoId) {
      const startTime = Math.max(0, Math.floor(offset))
      const newUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${shouldAutoplay}&controls=0&mute=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&start=${startTime}`
      iframeRef.current.src = newUrl
    }
  }, [shouldAutoplay, videoId])

  useEffect(() => {
    // Only update overlay when offset changes, if there's a current mainVideoTime
    if (iframeRef.current && videoId && mainVideoTime !== undefined && mainVideoTime > 0) {
      const overlayStartTime = Math.max(0, Math.floor(mainVideoTime + offset))
      const newUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${shouldAutoplay}&controls=0&mute=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&start=${overlayStartTime}`
      iframeRef.current.src = newUrl
    }
  }, [offset])

  if (!videoId) {
    return null
  }

  const startTime = Math.max(0, Math.floor(offset))
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${shouldAutoplay}&controls=0&mute=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&start=${startTime}`

  return (
    <div className="absolute inset-0 w-full h-full z-20" style={{ filter: 'invert(1)', opacity: 0.5, pointerEvents: "none"  }}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title="YouTube overlay video player"
      />
    </div>
  )
})

export default SimpleYouTubeOverlay