const PlaybackControls = ({ 
  isPlaying, 
  setIsPlaying, 
  videoRef, 
  overlayRef, 
  mainVideoTime, 
  videoDuration, 
  onSeekTo 
}) => {
  const handlePlayPause = () => {
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

  const handleSliderChange = (e) => {
    const newTime = parseFloat(e.target.value)
    onSeekTo(newTime)
  }

  const formatTime = (time) => {
    if (time === null || time === undefined || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white p-3 rounded-lg shadow-md flex items-center gap-4">
      <button
        onClick={handlePlayPause}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex-shrink-0"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      
      <div className="flex-1 flex items-center gap-3">
        <span className="text-sm text-gray-600 min-w-[3rem] text-right">
          {formatTime(mainVideoTime)}
        </span>
        
        <input
          type="range"
          min="0"
          max={videoDuration || 100}
          step="0.1"
          value={mainVideoTime || 0}
          onChange={handleSliderChange}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        
        <span className="text-sm text-gray-600 min-w-[3rem]">
          {formatTime(videoDuration)}
        </span>
      </div>
    </div>
  )
}

export default PlaybackControls