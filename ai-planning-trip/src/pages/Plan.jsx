import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ItineraryView from '../components/ItineraryView'
import { generateItinerary } from '../lib/aiClient'

function Plan() {
  const location = useLocation()
  const { from, to, dates, options } = (location.state || {})
  const [loading, setLoading] = useState(false)
  const [itinerary, setItinerary] = useState(null)

  useEffect(() => {
    async function run() {
      if (!from || !to) return
      try {
        setLoading(true)
        const prompt = `Plan a day-by-day itinerary as JSON for a trip from ${from} to ${to}. Dates: ${dates?.start || 'TBD'} to ${dates?.end || 'TBD'}. Guests: ${options?.guests}. Budget: ${options?.budget}. Pace: ${options?.pace}. Output schema: {\"summary\": string, \"days\":[{\"date\": string, \"items\":[{\"time\": string, \"title\": string, \"lat\": number, \"lng\": number}]}]}.`
        const text = await generateItinerary(prompt)
        setItinerary(text)
        try {
          const parsed = JSON.parse(text)
          const items = parsed?.days?.flatMap((d) => d.items || []) || []
          const mod = await import('../lib/map')
          mod.initMap && mod.initMap()
          mod.setMarkers && mod.setMarkers(items)
        } catch {}
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [from, to, dates, options])

  return (
    <div className="layout">
      <div>
        {loading && <p style={{marginTop:12}}>Generating itinerary...</p>}
        <ItineraryView data={itinerary} />
      </div>
      <div className="map" id="map" />
    </div>
  )
}

export default Plan


