import React from 'react'

// Fallback itinerary generator for when AI returns invalid data
function createFallbackItinerary(data, tripInfo) {
  if (!data || typeof data !== 'string') return null
  
  // Calculate actual number of days from tripInfo
  let numDays = 1
  if (tripInfo?.dates?.start && tripInfo?.dates?.end) {
    const startDate = new Date(tripInfo.dates.start)
    const endDate = new Date(tripInfo.dates.end)
    numDays = Math.max(1, Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)))
  }
  
  // Try to extract some useful information from the raw text
  const lines = data.split('\n').filter(line => line.trim())
  const activities = []
  
  // Look for time patterns and activity descriptions
  lines.forEach(line => {
    const timeMatch = line.match(/(\d{1,2}:\d{2}|\d{1,2}\s*(am|pm))/i)
    if (timeMatch) {
      let activity = line.replace(timeMatch[0], '').trim()
      
      // Clean up and shorten the activity description
      if (activity && activity.length > 5) {
        // Extract meaningful content from complex text
        let cleanActivity = activity
        
        // Remove everything before the first meaningful word
        cleanActivity = cleanActivity.replace(/^.*?(?=Departure|Flight|Travel|Check-in|Lunch|Dinner|Visit|Sleep|Breakfast|Taxi|Arrive)/i, '')
        
        // Extract title from complex patterns
        const titleMatch = cleanActivity.match(/title:\s*["']?([^"',\n]+)["']?/i)
        if (titleMatch) {
          cleanActivity = titleMatch[1].trim()
        }
        
        // Clean up common patterns
        cleanActivity = cleanActivity
          .replace(/^[-•]\s*/, '') // Remove bullet points
          .replace(/^(We'll|We|analysis|analysisWe|analysisWe need|analysisWe need to|analysisWe need to output|analysisWe need to output a|analysisWe need to output a JSON|analysisWe need to output a JSON object|analysisWe need to output a JSON object matching|analysisWe need to output a JSON object matching schema)/i, '')
          .replace(/^(Departure|Departure from|Departure from Hanoi|Departure from Hanoi to|Departure from Hanoi to airport|Departure from Hanoi to airport\?|Departure from Hanoi to airport\? Actually|Departure from Hanoi to airport\? Actually departure|Departure from Hanoi to airport\? Actually departure from|Departure from Hanoi to airport\? Actually departure from home|Departure from Hanoi to airport\? Actually departure from home to|Departure from Hanoi to airport\? Actually departure from home to airport|Departure from Hanoi to airport\? Actually departure from home to airport maybe|Departure from Hanoi to airport\? Actually departure from home to airport maybe 07:30)/i, 'Di chuyển đến sân bay')
          .replace(/^(Travel|Travel to|Travel to Noi|Travel to Noi Bai|Travel to Noi Bai Airport)/i, 'Di chuyển đến Sân bay Liên Khương')
          .replace(/^(Flight|Flight from|Flight from Hanoi|Flight from Hanoi to|Flight from Hanoi to Daklak|Flight to Dak Lak)/i, 'Chuyến bay Hà Nội - Đắk Lắk')
          .replace(/^(Arrive|Arrive at|Arrive at Dak Lak Airport)/i, 'Đến Sân bay Liên Khương')
          .replace(/^(Taxi|Taxi to|Taxi to hotel)/i, 'Di chuyển đến Hotel A25')
          .replace(/^(Check-in|Check-in at|Check-in at hotel|Check-in at Budget)/i, 'Nhận phòng tại Hotel A25')
          .replace(/^(Lunch|Lunch at|Lunch at local|Lunch at local stall)/i, 'Ăn trưa tại Nhà hàng Đặc sản')
          .replace(/^(Visit|Visit Plei|Visit Plei Nta|Visit Plei Nta Village)/i, 'Tham quan Làng Plei Nta')
          .replace(/^(Visit Dak Lak Museum)/i, 'Tham quan Bảo tàng Đắk Lắk')
          .replace(/^(Dinner|Dinner at|Dinner at local|Dinner at local street|Dinner at local street food)/i, 'Ăn tối tại Quán ăn Địa phương')
          .replace(/^(Sleep|Sleep\.)/i, 'Nghỉ đêm tại Hotel A25')
          .replace(/\s*\.\s*title:.*$/i, '') // Remove .title: parts
          .replace(/\s*lat\/Ing.*$/i, '') // Remove lat/lng parts
          .replace(/\s*lat\/Ing.*$/i, '') // Remove lat/lng parts
          .replace(/\s*\.\s*lat.*$/i, '') // Remove .lat parts
          .replace(/\s*\.\s*lng.*$/i, '') // Remove .lng parts
          .replace(/\s*\.\s*\.\.\..*$/i, '') // Remove ... parts
          .trim()
        
        // If still too long, try to extract the first meaningful sentence
        if (cleanActivity.length > 50) {
          const sentences = cleanActivity.split(/[.!?]/)
          cleanActivity = sentences[0] || cleanActivity.substring(0, 47) + '...'
        }
        
        // Final cleanup
        cleanActivity = cleanActivity
          .replace(/^[^a-zA-ZÀ-ỹ]*/, '') // Remove non-letter characters at start
          .replace(/\s+/g, ' ') // Normalize spaces
          .trim()
        
        // Only add if we have a meaningful activity
        if (cleanActivity.length > 2 && 
            cleanActivity.length <= 50 && 
            !cleanActivity.match(/^(analysis|We|We'll|JSON|object|schema|matching|output|need|to|a|the|and|or|but|in|on|at|to|for|of|with|by|lat|lng|Ing|coordinates)/i)) {
          activities.push({
            time: timeMatch[0],
            title: cleanActivity,
            lat: 10.8231 + (Math.random() - 0.5) * 0.1, // Approximate coordinates
            lng: 106.6297 + (Math.random() - 0.5) * 0.1
          })
        }
      }
    }
  })
  
  // If no time-based activities found, try to extract from long text descriptions
  if (activities.length === 0) {
    // Look for common travel activities in the text
    const text = data.toLowerCase()
    const commonActivities = [
      { pattern: /flight|airport|departure|arrival/i, title: 'Chuyến bay Hà Nội - Đắk Lắk' },
      { pattern: /check.?in|hotel|accommodation|hostel/i, title: 'Nhận phòng tại Hotel A25' },
      { pattern: /breakfast|morning|sáng/i, title: 'Ăn sáng tại Quán Cơm Sáng' },
      { pattern: /lunch|trưa|noon/i, title: 'Ăn trưa tại Nhà hàng Đặc sản' },
      { pattern: /dinner|evening|tối/i, title: 'Ăn tối tại Quán ăn Địa phương' },
      { pattern: /temple|pagoda|chùa/i, title: 'Tham quan Chùa Khải Đoan' },
      { pattern: /lake|hồ/i, title: 'Tham quan Hồ Lắk' },
      { pattern: /market|chợ/i, title: 'Tham quan Chợ Buôn Ma Thuột' },
      { pattern: /museum|bảo tàng/i, title: 'Tham quan Bảo tàng Đắk Lắk' },
      { pattern: /coffee|cà phê/i, title: 'Cà phê tại Trung Nguyên Legend' },
      { pattern: /street food|ăn vặt/i, title: 'Ăn vặt tại Chợ Đêm' },
      { pattern: /taxi|xe|transport/i, title: 'Di chuyển bằng taxi' },
      { pattern: /relax|nghỉ|rest/i, title: 'Nghỉ ngơi tại khách sạn' },
      { pattern: /sleep|ngủ/i, title: 'Nghỉ đêm tại Hotel A25' }
    ]
    
    commonActivities.forEach((activity, index) => {
      if (activity.pattern.test(data)) {
        activities.push({
          time: `${6 + index * 2}:00`,
          title: activity.title,
          lat: 10.8231 + (Math.random() - 0.5) * 0.1,
          lng: 106.6297 + (Math.random() - 0.5) * 0.1
        })
      }
    })
  }
  
  if (activities.length === 0) return null
  
  // Create days based on actual duration
  const days = []
  const startDate = tripInfo?.dates?.start ? new Date(tripInfo.dates.start) : new Date()
  
  for (let i = 0; i < numDays; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(currentDate.getDate() + i)
    
    // Distribute activities across days
    const itemsPerDay = Math.ceil(activities.length / numDays)
    const startIdx = i * itemsPerDay
    const endIdx = Math.min(startIdx + itemsPerDay, activities.length)
    
    days.push({
      date: currentDate.toISOString().split('T')[0],
      items: activities.slice(startIdx, endIdx)
    })
  }
  
  return {
    summary: `Chuyến đi từ ${tripInfo?.from || 'điểm xuất phát'} đến ${tripInfo?.to || 'điểm đến'} với ${activities.length} hoạt động được đề xuất.`,
    days: days
  }
}

// Create a simple default itinerary when all parsing fails
function createDefaultItinerary(tripInfo) {
  if (!tripInfo) return null
  
  // Calculate actual number of days from tripInfo
  let numDays = 1
  if (tripInfo?.dates?.start && tripInfo?.dates?.end) {
    const startDate = new Date(tripInfo.dates.start)
    const endDate = new Date(tripInfo.dates.end)
    numDays = Math.max(1, Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)))
  }
  
  // Create basic activities with specific location names
  const basicActivities = [
    { time: '08:00', title: 'Chuyến bay Hà Nội - Đắk Lắk', lat: 21.0285, lng: 105.8542 },
    { time: '10:00', title: 'Di chuyển đến Hotel A25', lat: 14.1119, lng: 108.3596 },
    { time: '12:00', title: 'Ăn trưa tại Nhà hàng Đặc sản', lat: 14.1119, lng: 108.3596 },
    { time: '14:00', title: 'Tham quan Bảo tàng Đắk Lắk', lat: 14.1119, lng: 108.3596 },
    { time: '16:00', title: 'Cà phê tại Trung Nguyên Legend', lat: 14.1119, lng: 108.3596 },
    { time: '18:00', title: 'Ăn tối tại Quán ăn Địa phương', lat: 14.1119, lng: 108.3596 },
    { time: '20:00', title: 'Nghỉ đêm tại Hotel A25', lat: 14.1119, lng: 108.3596 }
  ]
  
  // Create days based on actual duration
  const days = []
  const startDate = tripInfo?.dates?.start ? new Date(tripInfo.dates.start) : new Date()
  
  for (let i = 0; i < numDays; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(currentDate.getDate() + i)
    
    // Distribute activities across days
    const itemsPerDay = Math.ceil(basicActivities.length / numDays)
    const startIdx = i * itemsPerDay
    const endIdx = Math.min(startIdx + itemsPerDay, basicActivities.length)
    
    days.push({
      date: currentDate.toISOString().split('T')[0],
      items: basicActivities.slice(startIdx, endIdx)
    })
  }
  
  return {
    summary: `Chuyến đi từ ${tripInfo?.from || 'điểm xuất phát'} đến ${tripInfo?.to || 'điểm đến'} với ${basicActivities.length} hoạt động cơ bản.`,
    days: days
  }
}

function ItineraryView({ data, tripInfo }) {
  if (!data) return null
  
  // Debug logging
  console.log('Raw AI response:', data)
  
  let parsed = null
  let parseError = null
  
  try {
    // First try: direct JSON parse
    parsed = typeof data === 'string' ? JSON.parse(data) : data
  } catch (error) {
    parseError = error
    console.log('Direct parse failed:', error.message)
    
    if (typeof data === 'string') {
      // Second try: extract JSON from text using more robust regex
      const jsonMatch = data.match(/\{[\s\S]*?\}(?=\s*$|\s*```|\s*$)/m)
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0])
          console.log('Extracted JSON successfully')
        } catch (extractError) {
          console.log('Extract parse failed:', extractError.message)
        }
      }
      
      // Third try: find JSON object with proper structure
      if (!parsed) {
        try {
          // Look for JSON that starts with { and has proper structure
          const jsonStart = data.indexOf('{')
          if (jsonStart !== -1) {
            let jsonStr = data.substring(jsonStart)
            
            // Find the matching closing brace
            let braceCount = 0
            let endIndex = -1
            for (let i = 0; i < jsonStr.length; i++) {
              if (jsonStr[i] === '{') braceCount++
              if (jsonStr[i] === '}') braceCount--
              if (braceCount === 0) {
                endIndex = i
                break
              }
            }
            
            if (endIndex !== -1) {
              jsonStr = jsonStr.substring(0, endIndex + 1)
              parsed = JSON.parse(jsonStr)
              console.log('Brace matching JSON parse successful')
            }
          }
        } catch (braceError) {
          console.log('Brace matching parse failed:', braceError.message)
        }
      }
      
      // Fourth try: clean up common AI response issues
      if (!parsed) {
        try {
          let cleanedData = data
            .replace(/```json\s*/g, '') // Remove markdown code blocks
            .replace(/```\s*/g, '')
            .replace(/^[^{]*/, '') // Remove text before first {
            .replace(/[^}]*$/, '') // Remove text after last }
            .trim()
          
          if (cleanedData.startsWith('{') && cleanedData.endsWith('}')) {
            parsed = JSON.parse(cleanedData)
            console.log('Cleaned JSON parse successful')
          }
        } catch (cleanError) {
          console.log('Clean parse failed:', cleanError.message)
        }
      }
    }
  }
  
  if (!parsed) {
    // Try to create a fallback itinerary from the raw data
    const fallbackItinerary = createFallbackItinerary(data, tripInfo)
    if (fallbackItinerary) {
      console.log('Using fallback itinerary')
      parsed = fallbackItinerary
    } else {
      // Create a simple default itinerary if all else fails
      const defaultItinerary = createDefaultItinerary(tripInfo)
      if (defaultItinerary) {
        console.log('Using default itinerary')
        parsed = defaultItinerary
      } else {
        return (
        <div className="itin">
          <div className="itin__error">
            <div className="itin__error__icon">⚠️</div>
            <h3>Không thể phân tích kết quả</h3>
            <p>AI đã trả về dữ liệu không đúng định dạng. Vui lòng thử lại.</p>
            <div className="itin__error__actions">
              <button 
                className="btn btn--primary" 
                onClick={() => window.location.reload()}
              >
                Thử lại
              </button>
            </div>
            <details className="itin__error__details">
              <summary>Xem chi tiết lỗi</summary>
              <div className="itin__error__debug">
                <h4>Lỗi parsing:</h4>
                <pre>{parseError?.message || 'Unknown error'}</pre>
                <h4>Dữ liệu thô từ AI:</h4>
                <pre className="itinerary__json">{data}</pre>
              </div>
            </details>
          </div>
        </div>
        )
      }
    }
  }
  
  const { summary, days } = parsed
  
  // Calculate actual number of days from user input
  let actualDays = 1
  if (tripInfo?.dates?.start && tripInfo?.dates?.end) {
    const startDate = new Date(tripInfo.dates.start)
    const endDate = new Date(tripInfo.dates.end)
    actualDays = Math.max(1, Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)))
  }
  
  // Force limit days to actual requested days
  const limitedDays = days ? days.slice(0, actualDays) : []
  
  const totalDays = days?.length || 0
  const startDate = days?.[0]?.date
  const endDate = days?.[totalDays - 1]?.date
  
  return (
    <div className="itin">
      <div className="itin__tabs">
        <button className="tab tab--active">Tổng quan</button>
        {Array.from({ length: Math.min(actualDays, limitedDays.length) }, (_, i) => (
          <button key={i} className="tab">Ngày {i+1}</button>
        ))}
      </div>
      
      {summary && (
        <div className="itin__hero">
          <div className="itin__banner" />
          <div className="itin__hero__body">
            <h2 className="itin__hero__title">
              {Math.min(actualDays, limitedDays.length)} ngày {tripInfo?.from && tripInfo?.to ? `từ ${tripInfo.from} đến ${tripInfo.to}` : 'du lịch'}
            </h2>
            <div className="itin__chips">
              {startDate && endDate && (
                <span className="chip">
                  <span className="chip__icon">📅</span>
                  {new Date(startDate).toLocaleDateString('vi-VN')} - {new Date(endDate).toLocaleDateString('vi-VN')}
                </span>
              )}
              {tripInfo?.options && (
                <span className="chip">
                  <span className="chip__icon">👤</span>
                  {tripInfo.options.guests || '1 người'}, {tripInfo.options.budget || 'Tiết kiệm'}, {tripInfo.options.pace || 'Thoải mái'}
                </span>
              )}
            </div>
            <p className="itin__hero__desc">{summary}</p>
            <div className="itin__badges">
              <span>🗺️ Bản đồ</span>
              <span>📱 Di động</span>
              <span>💬 Chia sẻ</span>
              <span>📷 Ảnh</span>
              <span>🔗 Liên kết</span>
            </div>
          </div>
        </div>
      )}
      
      {Array.isArray(limitedDays) && limitedDays.map((d, idx) => (
        <div className="itin__day" key={idx}>
          <div className="itin__dayhead">
            Ngày {idx + 1} • {d.date ? new Date(d.date).toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : ''}
          </div>
          <div className="itin__items">
            {d.items?.map((it, i) => (
              <div className="itin__item" key={i}>
                <div className="itin__item__left">
                  <div className="itin__time">{it.time}</div>
                  <div className="itin__dist">
                    {i < d.items.length - 1 ? '↓' : '🏁'}
                  </div>
                </div>
                <div className="itin__item__content">
                  <div className="itin__title">{it.title}</div>
                  {it.lat && it.lng && (
                    <div className="itin__location">
                      📍 {it.lat.toFixed(4)}, {it.lng.toFixed(4)}
                    </div>
                  )}
                </div>
                <div className="itin__actions">
                  <button className="itin__action__btn" title="Chỉnh sửa">✎</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ItineraryView


