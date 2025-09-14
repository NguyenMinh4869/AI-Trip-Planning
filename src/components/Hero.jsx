import React, { useState } from 'react'
import TripFields from './TripFields'
import { generateItinerary } from '../lib/aiClient'
import ItineraryView from './ItineraryView'
import { useNavigate } from 'react-router-dom'

function Hero() {
  const [toPlace, setToPlace] = useState('')
  const [loading, setLoading] = useState(false)
  const [itinerary, setItinerary] = useState(null)
  const navigate = useNavigate()
  return (
    <section className="hero">
      <div className="hero__inner">
        <h1 className="hero__title">Khi bạn quá lười để tạo kế hoạch :D</h1>
        <p className="hero__subtitle">Lên kế hoạch đi chơi chỉ trong 10 giây!</p>
        <div className="search search--route">
          <div className="search__seg">
            <span className="search__icon" aria-hidden>📍</span>
            <input
              className="search__input"
              placeholder="Điểm đến"
              value={toPlace}
              onChange={(e) => setToPlace(e.target.value)}
            />
          </div>
        </div>
        {toPlace && (
          <TripFields
            onGenerate={({ dates, options }) => {
              navigate('/plan', { state: { to: toPlace, dates, options } })
            }}
          />
        )}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h3>Đang tạo lịch trình du lịch...</h3>
            <p>AI đang phân tích và tạo kế hoạch chi tiết cho chuyến đi của bạn</p>
          </div>
        )}
        {itinerary && <ItineraryView data={itinerary} tripInfo={{ to: toPlace }} />}
      </div>
    </section>
  )
}

export default Hero


