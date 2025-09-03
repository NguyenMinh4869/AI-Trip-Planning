import React from 'react'

const PLACEHOLDERS = [
  { title: 'Paris' },
  { title: 'Sydney' },
  { title: 'Tokyo' },
  { title: 'New York' },
  { title: 'Bali' },
  { title: 'Grand Canyon' },
]

function Popular() {
  return (
    <section className="popular" id="popular">
      <div className="popular__container">
        <h2 className="popular__title">Popular destinations</h2>
        <div className="popular__grid">
          {PLACEHOLDERS.map((p) => (
            <div key={p.title} className="card">
              <div className="card__thumb" />
              <div className="card__label">{p.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Popular


