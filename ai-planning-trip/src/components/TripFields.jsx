import React, { useState } from 'react'
import DateRangePicker from './DateRangePicker'
import TravelOptionsPicker from './TravelOptionsPicker'

import { useNavigate } from 'react-router-dom'

function TripFields({ onGenerate }) {
  const [dates, setDates] = useState({ start: '', end: '' })
  const [gbp, setGbp] = useState({ guests: 'solo', budget: '$', pace: 'Relax' })
  const navigate = useNavigate()
  return (
    <div className="tripfields">
      <div className="tripfields__row">
        <DateRangePicker value={dates} onChange={setDates} />
        <TravelOptionsPicker value={gbp} onChange={setGbp} />
      </div>
      <div className="tripfields__row">
        <div className="input input--pill input--muted">
          <input placeholder="Interests (Optional)" />
        </div>
        <button className="btn btn--primary generate__btn" onClick={() => {
          if (onGenerate) return onGenerate({ dates, options: gbp })
          navigate('/plan', { state: { dates, options: gbp } })
        }}>Generate</button>
      </div>
    </div>
  )
}

export default TripFields


