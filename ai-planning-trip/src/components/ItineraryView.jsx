import React from 'react'

function ItineraryView({ data }) {
  if (!data) return null
  let parsed = null
  try {
    parsed = typeof data === 'string' ? JSON.parse(data) : data
  } catch {
    if (typeof data === 'string') {
      const start = data.indexOf('{')
      const end = data.lastIndexOf('}')
      if (start !== -1 && end !== -1 && end > start) {
        try { parsed = JSON.parse(data.slice(start, end + 1)) } catch {}
      }
    }
  }
  if (!parsed) {
    return typeof data === 'string' ? <pre className="itinerary__json">{data}</pre> : null
  }
  const { summary, days } = parsed
  return (
    <div className="itin">
      <div className="itin__tabs">
        <button className="tab tab--active">Overview</button>
        {Array.isArray(days) && days.slice(0, 3).map((_, i) => (<button key={i} className="tab">Day {i+1}</button>))}
      </div>
      {summary && (
        <div className="itin__hero">
          <div className="itin__banner" />
          <div className="itin__hero__body">
            <a className="itin__hero__title" href="#">3 days in Amsterdam</a>
            <div className="itin__chips">
              <span className="chip"><span className="chip__icon">📅</span>5th Sep  -  7th Sep</span>
              <span className="chip"><span className="chip__icon">👤</span>Solo, $, Relax</span>
            </div>
            <p className="itin__hero__desc">{summary}</p>
            <a className="itin__link" href="#">View trip outline</a>
            <div className="itin__badges">
              <span>📶 eSIM</span>
              <span>💶 EUR</span>
              <span>🕒 GMT+01</span>
              <span>💬</span>
              <span>📷</span>
              <span>🔗</span>
            </div>
          </div>
        </div>
      )}
      {Array.isArray(days) && days.map((d, idx) => (
        <div className="itin__day" key={idx}>
          <div className="itin__dayhead">Day {idx + 1} • {d.date || ''}</div>
          <div className="itin__items">
            {d.items?.map((it, i) => (
              <div className="itin__item" key={i}>
                <div className="itin__item__left">
                  <div className="itin__time">{it.time}</div>
                  <div className="itin__dist">↕</div>
                </div>
                <div className="itin__title">{it.title}</div>
                <div className="itin__actions">✎</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ItineraryView


