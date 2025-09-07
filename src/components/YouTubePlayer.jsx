import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react'
import useYouTubePlayer from '../hooks/useYouTubePlayer'

const YouTubePlayer = forwardRef(({ videoId, isPlaying, onTimeUpdate, onDurationChange }, ref) => {
  const events = useMemo(() => ({
    onReady: (player) => {
      if (onDurationChange) {
        onDurationChange(player.getDuration())
      }
    }
  }), [onDurationChange])

  const { player, isReady, elementId, play, pause, getCurrentTime, seekTo } = useYouTubePlayer(
    videoId,
    {}, // Use default playerVars
    events,
    500 // 500ms delay for main player to ensure DOM is ready
  )

  useImperativeHandle(ref, () => ({
    play,
    pause,
    getCurrentTime,
    seekTo
  }))

  useEffect(() => {
    if (player && isReady) {
      if (isPlaying) {
        play()
      } else {
        pause()
      }
    }
  }, [isPlaying, player, isReady, play, pause])

  useEffect(() => {
    if (player && isReady && onTimeUpdate) {
      const interval = setInterval(() => {
        const currentTime = getCurrentTime()
        onTimeUpdate(currentTime)
      }, 100)

      return () => clearInterval(interval)
    }
  }, [player, isReady, onTimeUpdate, getCurrentTime])

  return (
    <div className="w-full h-full relative z-10">
      <div id={elementId} className="w-full h-full"></div>
    </div>
  )
})

YouTubePlayer.displayName = 'YouTubePlayer'

export default YouTubePlayer