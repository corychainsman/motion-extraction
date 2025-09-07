const PlayPauseButton = ({ isPlaying, setIsPlaying, videoRef, overlayRef }) => {
  const handleClick = () => {
    const newPlayState = !isPlaying
    setIsPlaying(newPlayState)

    // Control both videos (works for both HTML5 video and YouTube players)
    if (videoRef.current) {
      if (newPlayState) {
        if (videoRef.current.play) {
          videoRef.current.play()
        }
      } else {
        if (videoRef.current.pause) {
          videoRef.current.pause()
        }
      }
    }

    if (overlayRef.current) {
      if (newPlayState) {
        if (overlayRef.current.play) {
          overlayRef.current.play()
        }
      } else {
        if (overlayRef.current.pause) {
          overlayRef.current.pause()
        }
      }
    }
  }

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
    >
      {isPlaying ? 'Pause' : 'Play'}
    </button>
  )
}

export default PlayPauseButton