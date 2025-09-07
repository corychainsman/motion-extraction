import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react'

const SimpleYouTubePlayer = forwardRef(({ videoId, startTime = 0, videoUrl, isPlaying, onTimeUpdate, onDurationChange, onPlayStateChange }, ref) => {
  const [shouldAutoplay, setShouldAutoplay] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [currentStartTime, setCurrentStartTime] = useState(startTime)
  const [playStarted, setPlayStarted] = useState(null)
  const [ytPlayer, setYtPlayer] = useState(null)
  const iframeRef = useRef(null)
  const playerContainerRef = useRef(null)

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
      setPlayStarted(Date.now())
    },
    pause: () => {
      setShouldAutoplay(0)
      setPlayStarted(null)
    },
    getCurrentTime: () => currentTime,
    seekTo: (time) => {
      setCurrentStartTime(time)
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
        const newTime = currentStartTime + elapsed
        setCurrentTime(newTime)
        onTimeUpdate(newTime)
      }, 100)
      
      return () => clearInterval(interval)
    }
  }, [shouldAutoplay, playStarted, currentStartTime, onTimeUpdate])

  // Create YouTube Player API instance to get exact duration
  useEffect(() => {
    if (!videoId) return
    
    console.log('Attempting to get duration for video:', videoId)
    
    // Clean up any existing player first
    if (ytPlayer) {
      try {
        ytPlayer.destroy()
      } catch (error) {
        console.log('Cleanup error:', error)
      }
      setYtPlayer(null)
    }

    // Function to initialize YouTube player
    const initializePlayer = () => {
      console.log('Checking if YouTube API is ready...', !!window.YT, !!window.YT?.Player)
      
      if (window.YT && window.YT.Player && playerContainerRef.current) {
        console.log('YouTube API ready, creating player...')
        
        // Generate unique container ID
        const containerId = `yt-duration-player-${Date.now()}`
        
        // Create container div
        playerContainerRef.current.innerHTML = `<div id="${containerId}"></div>`
        
        try {
          const player = new window.YT.Player(containerId, {
            height: '1',
            width: '1',
            videoId: videoId,
            playerVars: {
              autoplay: 0,
              controls: 0,
              mute: 1,
              enablejsapi: 1,
              origin: window.location.origin
            },
            events: {
              onReady: (event) => {
                console.log('YouTube Player ready, getting duration...')
                const duration = event.target.getDuration()
                console.log(`Exact duration for ${videoId}: ${duration} seconds (${Math.floor(duration/3600)}:${Math.floor((duration%3600)/60).toString().padStart(2,'0')}:${Math.floor(duration%60).toString().padStart(2,'0')})`)
                
                if (duration && duration > 0 && onDurationChange) {
                  onDurationChange(duration)
                  setYtPlayer(event.target)
                } else {
                  console.warn('Got invalid duration:', duration)
                }
              },
              onError: (event) => {
                console.error('YouTube Player error:', event.data)
              },
              onStateChange: (event) => {
                console.log('YouTube Player state change:', event.data)
              }
            }
          })
        } catch (error) {
          console.error('Error creating YouTube player:', error)
        }
      } else {
        console.log('YouTube API not ready, retrying in 200ms...')
        setTimeout(initializePlayer, 200)
      }
    }

    // Start initialization
    initializePlayer()
  }, [videoId]) // Only depend on videoId, not onDurationChange

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

  // Initialize start time when component mounts or videoUrl changes
  useEffect(() => {
    const urlStartTime = getStartTimeFromUrl(videoUrl)
    const finalStartTime = Math.max(startTime, urlStartTime)
    setCurrentStartTime(finalStartTime)
    setCurrentTime(finalStartTime)
  }, [startTime, videoUrl])

  useEffect(() => {
    // Update iframe src when play state changes
    if (iframeRef.current && videoId) {
      const newUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${shouldAutoplay}&controls=1&mute=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&start=${Math.floor(currentStartTime)}`
      iframeRef.current.src = newUrl
    }
  }, [shouldAutoplay, videoId, currentStartTime])

  if (!videoId) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        Invalid video ID
      </div>
    )
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=${shouldAutoplay}&controls=1&mute=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&start=${Math.floor(currentStartTime)}`

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