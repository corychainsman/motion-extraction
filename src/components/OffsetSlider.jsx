const OffsetSlider = ({ offset, setOffset }) => {
  const handleChange = (e) => {
    setOffset(parseFloat(e.target.value))
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Time Offset:
      </label>
      <input
        type="range"
        min="0"
        max="20"
        step="0.1"
        value={offset}
        onChange={handleChange}
        className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      {/* <span className="text-sm text-gray-600 min-w-[2rem]">
        {offset.toFixed(1)}s
      </span> */}
    </div>
  )
}

export default OffsetSlider