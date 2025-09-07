import { useState, useEffect, useId, useCallback, useMemo } from 'react'

const useYouTubePlayer = (videoId, playerVars = {}, events = {}, initDelay = 100, elementPrefix = 'youtube-player') => {
  const [player, setPlayer] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const playerId = useId()

  const memoizedPlayerVars = useMemo(() => {
    const defaultPlayerVars = {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      cc_load_policy: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      mute: 1
    }
    return { ...defaultPlayerVars, ...playerVars }
  }, [playerVars])

  useEffect(() => {
    const cleanupPlayer = () => {
      if (player) {
        try {
          player.destroy()
        } catch (e) {
          console.warn('Error destroying YouTube player:', e)
        }
        setPlayer(null)
        setIsReady(false)
      }
    }

    const initializePlayer = () => {
      const elementId = `${elementPrefix}-${playerId}`
      const element = document.getElementById(elementId)
      console.log('Initializing player:', { elementId, element, videoId, playerVars: memoizedPlayerVars })
      if (element && window.YT && window.YT.Player && videoId) {
        try {
          // Clear the element to prevent conflicts
          element.innerHTML = ''
          
          const newPlayer = new window.YT.Player(elementId, {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: memoizedPlayerVars,
            events: {
              onReady: (event) => {
                try {
                  console.log('YouTube player ready with playerVars:', memoizedPlayerVars)
                  const player = event.target
                  
                  // Add error prevention for iframe access
                  if (player && typeof player.getIframe === 'function') {
                    const iframe = player.getIframe()
                    if (iframe && iframe.src) {
                      console.log('YouTube iframe ready with src:', iframe.src)
                    }
                  }
                  
                  setPlayer(player)
                  setIsReady(true)
                  if (events.onReady) {
                    events.onReady(player)
                  }
                } catch (e) {
                  console.error('Error in onReady handler:', e)
                }
              },
              onError: (event) => {
                console.error('YouTube player error:', event.data)
                setIsReady(false)
                setPlayer(null)
              },
              onStateChange: (event) => {
                try {
                  console.log('YouTube player state change:', event.data)
                } catch (e) {
                  console.error('Error in state change handler:', e)
                }
              }
            }
          })
          console.log('YouTube player created successfully')
        } catch (e) {
          console.error('Error creating YouTube player:', e)
        }
      } else {
        console.log('Cannot initialize player:', { 
          element: !!element, 
          hasYT: !!window.YT, 
          hasPlayer: !!(window.YT && window.YT.Player), 
          videoId 
        })
      }
    }

    // Clean up existing player first
    cleanupPlayer()

    // Initialize after specified delay with better error handling
    const initTimeout = setTimeout(() => {
      if (window.YT && window.YT.Player) {
        // Add additional check to ensure DOM element exists
        const elementId = `${elementPrefix}-${playerId}`
        const element = document.getElementById(elementId)
        if (element) {
          initializePlayer()
        } else {
          console.warn('Element not found for YouTube player:', elementId)
        }
      } else {
        // Wait for API to load with timeout
        let attempts = 0
        const maxAttempts = 50 // 5 seconds max wait
        const checkAPI = () => {
          attempts++
          if (window.YT && window.YT.Player) {
            const elementId = `${elementPrefix}-${playerId}`
            const element = document.getElementById(elementId)
            if (element) {
              initializePlayer()
            } else {
              console.warn('Element not found after API load:', elementId)
            }
          } else if (attempts < maxAttempts) {
            setTimeout(checkAPI, 100)
          } else {
            console.error('YouTube API failed to load within timeout')
          }
        }
        checkAPI()
      }
    }, initDelay)

    return () => {
      clearTimeout(initTimeout)
      cleanupPlayer()
    }
  }, [videoId, playerId, initDelay, elementPrefix, memoizedPlayerVars, events])

  const play = useCallback(() => {
    if (player && isReady) {
      player.playVideo()
    }
  }, [player, isReady])

  const pause = useCallback(() => {
    if (player && isReady) {
      player.pauseVideo()
    }
  }, [player, isReady])

  const getCurrentTime = useCallback(() => {
    if (player && isReady) {
      return player.getCurrentTime()
    }
    return 0
  }, [player, isReady])

  const seekTo = useCallback((time) => {
    if (player && isReady) {
      player.seekTo(time, true)
    }
  }, [player, isReady])

  const getDuration = useCallback(() => {
    if (player && isReady) {
      return player.getDuration()
    }
    return 0
  }, [player, isReady])

  return {
    player,
    isReady,
    playerId,
    elementId: `${elementPrefix}-${playerId}`,
    play,
    pause,
    getCurrentTime,
    seekTo,
    getDuration
  }
}

export default useYouTubePlayer