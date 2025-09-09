import React, { useMemo, useRef, useState } from 'react'

function formatOrdinal(n) {
  const s = ["th","st","nd","rd"], v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function formatRangeLabel(startDate, endDate) {
  if (!startDate && !endDate) return 'Dates'
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const s = startDate ? new Date(startDate) : null
  const e = endDate ? new Date(endDate) : null
  if (s && e) {
    const days = Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)))
    return `${formatOrdinal(s.getDate())} ${months[s.getMonth()]} - ${formatOrdinal(e.getDate())} ${months[e.getMonth()]} (${days} day${days>1?'s':''})`
  }
  const one = s || e
  return `${formatOrdinal(one.getDate())} ${months[one.getMonth()]}`
}

function useClickOutside(ref, handler) {
  React.useEffect(() => {
    const listener = (e) => { if (!ref.current || ref.current.contains(e.target)) return; handler() }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

function DateRangePicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [local, setLocal] = useState({ start: value?.start || '', end: value?.end || '' })
  const containerRef = useRef(null)
  useClickOutside(containerRef, () => setOpen(false))

  const label = useMemo(() => formatRangeLabel(local.start, local.end), [local])

  function apply() {
    setOpen(false)
    onChange?.(local)
  }

  return (
    <div className="date-range" ref={containerRef}>
      <button type="button" className={`input input--pill date-range__button${open?' input--active':''}`} onClick={() => setOpen((v) => !v)}>
        <span className="input__icon" aria-hidden>📅</span>
        <span className="date-range__label">{label}</span>
      </button>
      {open && (
        <div className="date-range__popover">
          <div className="date-range__head">Select dates</div>
          <div className="date-range__grid">
            <label className="date-range__field">
              <span>Start</span>
              <input type="date" value={local.start} onChange={(e) => setLocal((p) => ({ ...p, start: e.target.value }))} />
            </label>
            <label className="date-range__field">
              <span>End</span>
              <input type="date" value={local.end} onChange={(e) => setLocal((p) => ({ ...p, end: e.target.value }))} />
            </label>
          </div>
          <div className="date-range__footer">
            <button className="btn btn--primary" onClick={apply}>OK</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangePicker


