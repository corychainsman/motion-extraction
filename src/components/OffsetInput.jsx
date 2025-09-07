const OffsetInput = ({ offset, setOffset }) => {
  const handleChange = (e) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      setOffset(value)
    }
  }

  const handleBlur = (e) => {
    const value = parseFloat(e.target.value)
    if (isNaN(value)) {
      e.target.value = offset.toFixed(1)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <input
        type="number"
        min="0"
        max="20"
        step="0.1"
        value={offset.toFixed(1)}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
      />
      <span className="text-sm text-gray-600">s</span>
    </div>
  )
}

export default OffsetInput