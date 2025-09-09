import React from 'react'

const PLACEHOLDERS = [
  { title: 'Lào Cai' },
  { title: 'Đắk Lắk' },
  { title: 'Hồ Chí Minh' },
  { title: 'Hải Phòng' },
  { title: 'Thanh Hóa' },
  { title: 'Đà Nẵng' },
]

function Popular() {
  return (
    <section className="popular" id="popular">
      <div className="popular__container">
        <h2 className="popular__title">Địa điểm nổi tiếng</h2>
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


