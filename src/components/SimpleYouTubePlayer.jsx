import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react'

const SimpleYouTubePlayer = forwardRef(({ videoId, isPlaying, onTimeUpdate, onDurationChange, onPlayStateChange }, ref) => {
  const [shouldAutoplay, setShouldAutoplay] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [playStarted, setPlayStarted] = useState(null)
  const [ytPlayer, setYtPlayer] = useState(null)
  const iframeRef = useRef(null)
  const playerContainerRef = useRef(null)

  useImperativeHandle(ref, () => ({
    play: () => {
      setShouldAutoplay(1)
      setPlayStarted(Date.now())
    },
    pause: () => {
      setShouldAutoplay(0)
      setPlayStarted(null)
    },
    getCurrentTime: () => currentTime,
    seekTo: (time) => {
      setStartTime(time)
      setCurrentTime(time)
      setPlayStarted(shouldAutoplay ? Date.now() : null)
      
      // Reload iframe with start time parameter
      const newUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${shouldAutoplay}&controls=1&mute=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&start=${Math.floor(time)}`
      if (iframeRef.current) {
        iframeRef.current.src = newUrl
      }
    }
  }))

  // Time tracking effect
  useEffect(() => {
    if (shouldAutoplay && playStarted && onTimeUpdate) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - playStarted) / 1000
        const newTime = startTime + elapsed
        setCurrentTime(newTime)
        onTimeUpdate(newTime)
      }, 100)
      
      return () => clearInterval(interval)
    }
  }, [shouldAutoplay, playStarted, startTime, onTimeUpdate])

  // Create YouTube Player API instance to get exact duration
  useEffect(() => {
    if (videoId && playerContainerRef.current) {
      // Clean up any existing player first
      if (ytPlayer) {
        try {
          ytPlayer.destroy()
        } catch (error) {
          // Ignore cleanup errors
        }
        setYtPlayer(null)
      }

      // Wait for YouTube API to be available
      const initializePlayer = () => {
        if (window.YT && window.YT.Player) {
          // Generate unique container ID
          const containerId = `yt-player-${videoId}-${Date.now()}`
          
          // Create a hidden div for the YouTube Player API
          playerContainerRef.current.innerHTML = `<div id="${containerId}"></div>`
          
          const player = new window.YT.Player(containerId, {
            height: '1',
            width: '1',
            videoId: videoId,
            playerVars: {
              autoplay: 0,
              controls: 0,
              mute: 1,
              enablejsapi: 1,
            },
            events: {
              onReady: (event) => {
                // Get the exact duration from the loaded video
                const duration = event.target.getDuration()
                console.log(`Got exact duration for ${videoId}:`, duration, 'seconds')
                if (duration && duration > 0 && onDurationChange) {
                  onDurationChange(duration)
                }
                setYtPlayer(event.target)
              },
              onError: (event) => {
                console.warn('YouTube Player API error:', event.data)
                // Don't set any fallback duration on error - let user know there's an issue
              }
            },
          })
        } else {
          // YouTube API not ready yet, wait and try again
          setTimeout(initializePlayer, 100)
        }
      }

      initializePlayer()
    }
  }, [videoId, onDurationChange, ytPlayer])

  // Clean up YouTube Player API instance
  useEffect(() => {
    return () => {
      if (ytPlayer) {
        try {
          ytPlayer.destroy()
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    }
  }, [ytPlayer])

  // Initialize autoplay state and start time tracking on mount
  useEffect(() => {
    if (videoId && shouldAutoplay && !playStarted) {
      setPlayStarted(Date.now())
      if (onPlayStateChange) {
        onPlayStateChange(true)
      }
    }
  }, [videoId, shouldAutoplay, playStarted, onPlayStateChange])

  useEffect(() => {
    // Update iframe src when play state changes
    if (iframeRef.current && videoId) {
      const newUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${shouldAutoplay}&controls=1&mute=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&start=${Math.floor(startTime)}`
      iframeRef.current.src = newUrl
    }
  }, [shouldAutoplay, videoId, startTime])

  if (!videoId) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        Invalid video ID
      </div>
    )
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${shouldAutoplay}&controls=1&mute=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`

  return (
    <div className="w-full h-full relative z-10" style={{ pointerEvents: "none" }}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video player"
      />
      {/* Hidden container for YouTube Player API instance to get duration */}
      <div
        ref={playerContainerRef}
        style={{ position: 'absolute', top: '-1000px', left: '-1000px', width: '1px', height: '1px' }}
      />
    </div>
  )
})

export default SimpleYouTubePlayer