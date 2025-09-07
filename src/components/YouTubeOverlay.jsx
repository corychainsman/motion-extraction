import { forwardRef, useEffect, useImperativeHandle } from 'react'
import useYouTubePlayer from '../hooks/useYouTubePlayer'

const YouTubeOverlay = forwardRef(({ videoId, isPlaying, mainVideoTime, offset }, ref) => {
  const { player, isReady, elementId, play, pause, getCurrentTime, seekTo } = useYouTubePlayer(
    videoId,
    {}, // Use default playerVars (already includes mute: 1)
    {}, // No custom events needed
    800, // 800ms delay for overlay player to load after main player
    'youtube-overlay-player' // Custom element prefix
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
    // Synchronize overlay with main video plus offset
    if (player && isReady && mainVideoTime !== undefined) {
      const targetTime = Math.max(0, mainVideoTime + offset)
      seekTo(targetTime)
    }
  }, [mainVideoTime, player, isReady, seekTo, offset])

  useEffect(() => {
    // When offset changes, immediately update overlay time based on current main video time
    if (player && isReady && mainVideoTime !== undefined) {
      const targetTime = Math.max(0, mainVideoTime + offset)
      seekTo(targetTime)
    }
  }, [offset, player, isReady, mainVideoTime, seekTo])

  return (
    <div className="absolute inset-0 w-full h-full z-20" style={{ filter: 'invert(1)', opacity: 0.5 }}>
      <div id={elementId} className="w-full h-full"></div>
    </div>
  )
})

YouTubeOverlay.displayName = 'YouTubeOverlay'

export default YouTubeOverlay