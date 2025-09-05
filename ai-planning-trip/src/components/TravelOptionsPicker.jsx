import React, { useMemo, useRef, useState } from 'react'

function useClickOutside(ref, handler) {
  React.useEffect(() => {
    const listener = (e) => { if (!ref.current || ref.current.contains(e.target)) return; handler() }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

const GUESTS = [
  { key: 'solo', label: 'Solo', icon: '🧍' },
  { key: 'couple', label: 'Couple', icon: '👫' },
  { key: 'friends', label: 'Friends', icon: '👥' },
  { key: 'family', label: 'Family', icon: '👨\u200d👩\u200d👧\u200d👦' },
]
const BUDGETS = [
  { key: '$', label: '$ Low' },
  { key: '$$', label: '$$' },
  { key: '$$$', label: '$$$' },
]
const PACES = [
  { key: 'Relax', label: 'Relax' },
  { key: 'Normal', label: 'Normal' },
  { key: 'Active', label: 'Active' },
]

function TravelOptionsPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [local, setLocal] = useState({
    guests: value?.guests || 'solo',
    budget: value?.budget || '$',
    pace: value?.pace || 'Relax',
  })
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))

  const label = useMemo(() => {
    const guestLabel = GUESTS.find((g) => g.key === local.guests)?.label || 'Guest'
    return `${guestLabel}, ${local.budget}, ${local.pace}`
  }, [local])

  function apply() {
    setOpen(false)
    console.log('Applying travel options:', local)
    onChange?.(local)
  }

  return (
    <div className="gbp" ref={ref}>
      <button type="button" className={`input input--pill gbp__button${open?' input--active':''}`} onClick={() => setOpen((v) => !v)}>
        <span className="input__icon" aria-hidden>👥</span>
        <span>{label}</span>
        <span className="gbp__close" aria-hidden>✕</span>
      </button>
      {open && (
        <div className="gbp__popover">
          <div className="gbp__section">
            <div className="gbp__label">Guest:</div>
            <div className="gbp__seg">
              {GUESTS.map((g) => (
                <button key={g.key} className={`seg ${local.guests===g.key?'seg--active':''}`} onClick={() => setLocal((p) => ({...p, guests: g.key}))}>
                  <span className="seg__icon" aria-hidden>{g.icon}</span>
                  <span>{g.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="gbp__section">
            <div className="gbp__label">Budget (Optional):</div>
            <div className="gbp__seg">
              {BUDGETS.map((b) => (
                <button key={b.key} className={`seg ${local.budget===b.key?'seg--active':''}`} onClick={() => setLocal((p) => ({...p, budget: b.key}))}>
                  <span>{b.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="gbp__section">
            <div className="gbp__label">Travel pace (Optional):</div>
            <div className="gbp__seg">
              {PACES.map((p) => (
                <button key={p.key} className={`seg ${local.pace===p.key?'seg--active':''}`} onClick={() => setLocal((x) => ({...x, pace: p.key}))}>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="gbp__footer">
            <button className="btn btn--primary" onClick={apply}>OK</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TravelOptionsPicker


