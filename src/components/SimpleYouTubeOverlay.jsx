import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react'

const SimpleYouTubeOverlay = forwardRef(({ videoId, isPlaying, mainVideoTime, offset, videoUrl, style }, ref) => {
  const [shouldAutoplay, setShouldAutoplay] = useState(1)
  const iframeRef = useRef(null)

  // Extract start time from URL parameters
  const getStartTimeFromUrl = (url) => {
    if (!url) return 0
    const match = url.match(/[?&]t=(\d+)s?/)
    if (match) {
      return parseInt(match[1]) || 0
    }
    return 0
  }

  useImperativeHandle(ref, () => ({
    play: () => {
      setShouldAutoplay(1)
    },
    pause: () => {
      setShouldAutoplay(0)
    },
    getCurrentTime: () => 0,
    seekTo: (time) => {
      // Reload iframe with start time parameter including offset and URL start time
      const urlStartTime = getStartTimeFromUrl(videoUrl)
      const overlayStartTime = Math.max(0, Math.floor(time + offset + urlStartTime))
      const newUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${shouldAutoplay}&controls=0&mute=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&start=${overlayStartTime}`
      if (iframeRef.current) {
        iframeRef.current.src = newUrl
      }
    }
  }))

  useEffect(() => {
    // Update iframe src when play state changes (but not when offset changes)
    if (iframeRef.current && videoId) {
      const urlStartTime = getStartTimeFromUrl(videoUrl)
      const startTime = Math.max(0, Math.floor(offset + urlStartTime))
      const newUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${shouldAutoplay}&controls=0&mute=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&start=${startTime}`
      iframeRef.current.src = newUrl
    }
  }, [shouldAutoplay, videoId, videoUrl, offset])

  useEffect(() => {
    // Only update overlay when offset changes, if there's a current mainVideoTime
    if (iframeRef.current && videoId && mainVideoTime !== undefined && mainVideoTime > 0) {
      const urlStartTime = getStartTimeFromUrl(videoUrl)
      const overlayStartTime = Math.max(0, Math.floor(mainVideoTime + offset + urlStartTime))
      const newUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${shouldAutoplay}&controls=0&mute=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&start=${overlayStartTime}`
      iframeRef.current.src = newUrl
    }
  }, [offset, videoUrl])

  if (!videoId) {
    return null
  }

  const urlStartTime = getStartTimeFromUrl(videoUrl)
  const startTime = Math.max(0, Math.floor(offset + urlStartTime))
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${shouldAutoplay}&controls=0&mute=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&start=${startTime}`

  return (
    <div className="absolute inset-0 w-full h-full z-20" style={{ filter: 'invert(1)', opacity: 0.5, pointerEvents: "none", ...style }}>
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