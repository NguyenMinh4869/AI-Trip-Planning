import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ItineraryView from '../components/ItineraryView'
import { generateItinerary, buildItineraryPrompt } from '../lib/aiClient'

function Plan() {
  const location = useLocation()
  const { to, dates, options } = (location.state || {})
  const [loading, setLoading] = useState(false)
  const [itinerary, setItinerary] = useState(null)

  useEffect(() => {
    // Initialize map immediately when component mounts
    const initMapAsync = async () => {
      const mod = await import('../lib/map')
      mod.initMap && mod.initMap()
      // Add sample locations with custom icons
      mod.addSampleLocations && mod.addSampleLocations()
    }
    initMapAsync()
  }, [])

  useEffect(() => {
    async function run() {
      if (!to) return
      try {
        setLoading(true)
        console.log('Generating itinerary with options:', { to, dates, options })
        
        const prompt = buildItineraryPrompt({ to, dates, options })
        console.log('Generated prompt:', prompt)
        
        const text = await generateItinerary(prompt)
        setItinerary(text)
        try {
          const parsed = JSON.parse(text)
          const items = parsed?.days?.flatMap((d) => d.items || []) || []
          const mod = await import('../lib/map')
          mod.setMarkers && mod.setMarkers(items)
        } catch {}
      } catch (error) {
        console.error('Error generating itinerary:', error)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [to, dates, options])

  return (
    <div className="layout">
      <div className="itinerary-container">
        {/* Header */}
        <div className="plan-header">
          <div className="plan-header__content">
            <h1 className="plan-header__logo">hehehahahi</h1>
            <div className="plan-header__actions">
              <button className="btn btn--ghost">Đăng kí</button>
            </div>
          </div>
        </div>
        
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h3>Đang tạo lịch trình du lịch...</h3>
            <p>AI đang phân tích và tạo kế hoạch chi tiết cho chuyến đi của bạn</p>
          </div>
        )}
        <ItineraryView data={itinerary} tripInfo={{ to, dates, options }} />
      </div>
      <div className="map" id="map" />
    </div>
  )
}

export default Plan


