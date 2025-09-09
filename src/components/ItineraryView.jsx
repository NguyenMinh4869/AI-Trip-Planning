import React from 'react'

// Fallback itinerary generator for when AI returns invalid data
function createFallbackItinerary(data, tripInfo) {
  if (!data || typeof data !== 'string') return null
  
  // Calculate actual number of days from tripInfo
  let numDays = 1
  if (tripInfo?.dates?.start && tripInfo?.dates?.end) {
    const startDate = new Date(tripInfo.dates.start)
    const endDate = new Date(tripInfo.dates.end)
    numDays = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1)
  }
  
  // Try to extract some useful information from the raw text
  const lines = data.split('\n').filter(line => line.trim())
  const activities = []
  
  // Look for time patterns and activity descriptions
  lines.forEach(line => {
    const timeMatch = line.match(/(\d{1,2}:\d{2}|\d{1,2}\s*(am|pm))/i)
    if (timeMatch) {
      let timeStr = timeMatch[0]
      
      // Validate and fix invalid times
      if (timeStr.includes(':')) {
        const [hours, minutes] = timeStr.split(':').map(Number)
        if (hours >= 24) {
          timeStr = `${hours % 24}:${minutes.toString().padStart(2, '0')}`
        }
        if (minutes >= 60) {
          timeStr = `${hours}:${minutes % 60}`
        }
      }
      
      let activity = line.replace(timeMatch[0], '').trim()
      
      // Clean up and shorten the activity description
      if (activity && activity.length > 5) {
        let cleanActivity = activity
          .replace(/^[-•]\s*/, '') // Remove bullet points
          .replace(/^(We'll|We|analysis|analysisWe|JSON|object|schema|matching|output|need|to|a|the|and|or|but|in|on|at|to|for|of|with|by|lat|lng|Ing|coordinates)/i, '')
          .replace(/\s*\.\s*title:.*$/i, '') // Remove .title: parts
          .replace(/\s*lat\/Ing.*$/i, '') // Remove lat/lng parts
          .replace(/\s*\.\s*lat.*$/i, '') // Remove .lat parts
          .replace(/\s*\.\s*lng.*$/i, '') // Remove .lng parts
          .replace(/\s*\.\s*\.\.\..*$/i, '') // Remove ... parts
          .replace(/^[^a-zA-ZÀ-ỹ]*/, '') // Remove non-letter characters at start
          .replace(/\s+/g, ' ') // Normalize spaces
          .trim()
        
        // If still too long, try to extract the first meaningful sentence
        if (cleanActivity.length > 50) {
          const sentences = cleanActivity.split(/[.!?]/)
          cleanActivity = sentences[0] || cleanActivity.substring(0, 47) + '...'
        }
        
        // Only add if we have a meaningful activity
        if (cleanActivity.length > 2 && cleanActivity.length <= 50) {
          activities.push({
            time: timeStr,
            title: cleanActivity,
            lat: 10.8231 + (Math.random() - 0.5) * 0.1,
            lng: 106.6297 + (Math.random() - 0.5) * 0.1
          })
        }
      }
    }
  })
  
  // If no time-based activities found, create default activities
  if (activities.length === 0) {
    const defaultActivities = [
      { time: '08:00', title: 'Khởi hành từ khách sạn', lat: 10.8231, lng: 106.6297 },
      { time: '10:00', title: 'Tham quan điểm đến đầu tiên', lat: 10.8331, lng: 106.6397 },
      { time: '12:00', title: 'Ăn trưa tại nhà hàng địa phương', lat: 10.8131, lng: 106.6197 },
      { time: '14:00', title: 'Tham quan điểm thứ hai', lat: 10.8431, lng: 106.6497 },
      { time: '16:00', title: 'Nghỉ ngơi và thưởng thức cà phê', lat: 10.8531, lng: 106.6597 },
      { time: '18:00', title: 'Ăn tối và khám phá ẩm thực', lat: 10.8631, lng: 106.6697 }
    ]
    activities.push(...defaultActivities)
  }
  
  if (activities.length === 0) return null
  
  // Create days based on actual duration
  const days = []
  const startDate = tripInfo?.dates?.start ? new Date(tripInfo.dates.start) : new Date()
  
  // Create different activities for each day
  const dayTemplates = [
    [
      { time: '08:00', title: 'Chuyến bay đến điểm đến' },
      { time: '10:30', title: 'Nhận phòng khách sạn' },
      { time: '12:00', title: 'Ăn trưa tại nhà hàng địa phương' },
      { time: '14:00', title: 'Tham quan trung tâm thành phố' },
      { time: '16:00', title: 'Thưởng thức cà phê và nghỉ ngơi' },
      { time: '18:30', title: 'Ăn tối và khám phá ẩm thực' }
    ],
    [
      { time: '07:30', title: 'Ăn sáng tại khách sạn' },
      { time: '09:00', title: 'Tham quan bảo tàng và di tích' },
      { time: '11:30', title: 'Mua sắm tại chợ địa phương' },
      { time: '13:00', title: 'Ăn trưa món đặc sản' },
      { time: '15:00', title: 'Tham quan vườn quốc gia' },
      { time: '18:00', title: 'Ăn tối và xem biểu diễn văn hóa' }
    ],
    [
      { time: '08:00', title: 'Tham quan thác nước' },
      { time: '10:30', title: 'Hoạt động ngoài trời' },
      { time: '12:30', title: 'Picnic bên hồ' },
      { time: '14:30', title: 'Thăm làng nghề truyền thống' },
      { time: '17:00', title: 'Ngắm hoàng hôn' },
      { time: '19:00', title: 'Ăn tối BBQ ngoài trời' }
    ]
  ]
  
  for (let i = 0; i < numDays; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(currentDate.getDate() + i)
    
    // Use different template for each day, cycle if more days than templates
    const templateIndex = i % dayTemplates.length
    const dayActivities = dayTemplates[templateIndex].map(activity => ({
      ...activity,
      lat: 10.8231 + (Math.random() - 0.5) * 0.2,
      lng: 106.6297 + (Math.random() - 0.5) * 0.2
    }))
    
    days.push({
      date: currentDate.toISOString().split('T')[0],
      items: dayActivities
    })
  }
  
  return {
    summary: `Chuyến đi ${numDays} ngày từ ${tripInfo?.from || 'điểm xuất phát'} đến ${tripInfo?.to || 'điểm đến'} với các hoạt động đa dạng và phong phú.`,
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
    numDays = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1)
  }
  
  // Create different activity templates for variety
  const activityTemplates = [
    // Day 1 - Arrival and city exploration
    [
      { time: '08:00', title: 'Chuyến bay tới điểm đến', lat: 21.0285, lng: 105.8542 },
      { time: '11:00', title: 'Đến sân bay và di chuyển', lat: 14.1119, lng: 108.3596 },
      { time: '13:00', title: 'Nhận phòng và ăn trưa', lat: 14.1119, lng: 108.3596 },
      { time: '15:00', title: 'Tham quan trung tâm thành phố', lat: 14.1119, lng: 108.3596 },
      { time: '17:30', title: 'Thưởng thức cà phê địa phương', lat: 14.1119, lng: 108.3596 },
      { time: '19:00', title: 'Ăn tối tại nhà hàng đặc sản', lat: 14.1119, lng: 108.3596 }
    ],
    // Day 2 - Cultural exploration
    [
      { time: '07:30', title: 'Ăn sáng tại khách sạn', lat: 14.1119, lng: 108.3596 },
      { time: '09:00', title: 'Tham quan bảo tàng và di tích', lat: 14.1119, lng: 108.3596 },
      { time: '11:30', title: 'Khám phá chợ địa phương', lat: 14.1119, lng: 108.3596 },
      { time: '13:30', title: 'Ăn trưa món đặc sản vùng', lat: 14.1119, lng: 108.3596 },
      { time: '15:30', title: 'Tham quan làng nghề truyền thống', lat: 14.1119, lng: 108.3596 },
      { time: '18:30', title: 'Ăn tối và xem biểu diễn văn hóa', lat: 14.1119, lng: 108.3596 }
    ],
    // Day 3 - Nature and adventure
    [
      { time: '08:00', title: 'Khởi hành tham quan thiên nhiên', lat: 14.1119, lng: 108.3596 },
      { time: '10:00', title: 'Trekking và khám phá rừng', lat: 14.1119, lng: 108.3596 },
      { time: '12:30', title: 'Ăn trưa picnic ngoài trời', lat: 14.1119, lng: 108.3596 },
      { time: '14:30', title: 'Tham quan thác nước', lat: 14.1119, lng: 108.3596 },
      { time: '16:30', title: 'Nghỉ ngơi và ngắm cảnh', lat: 14.1119, lng: 108.3596 },
      { time: '18:30', title: 'Ăn tối BBQ ngoài trời', lat: 14.1119, lng: 108.3596 }
    ]
  ]
  
  // Create days based on actual duration
  const days = []
  const startDate = tripInfo?.dates?.start ? new Date(tripInfo.dates.start) : new Date()
  
  for (let i = 0; i < numDays; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(currentDate.getDate() + i)
    
    // Use different template for each day, cycle if more days than templates
    const templateIndex = i % activityTemplates.length
    const dayActivities = activityTemplates[templateIndex].map(activity => ({
      ...activity,
      lat: activity.lat + (Math.random() - 0.5) * 0.01, // Small variation in coordinates
      lng: activity.lng + (Math.random() - 0.5) * 0.01
    }))
    
    days.push({
      date: currentDate.toISOString().split('T')[0],
      items: dayActivities
    })
  }
  
  return {
    summary: `Chuyến đi ${numDays} ngày từ ${tripInfo?.from || 'điểm xuất phát'} đến ${tripInfo?.to || 'điểm đến'} với ${numDays * 6} hoạt động đa dạng.`,
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
    actualDays = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1)
  }
  
  // Ensure we have the correct number of days
  let finalDays = days || []
  
  // If we have fewer days than requested, create additional days
  if (finalDays.length < actualDays && tripInfo) {
    const startDate = tripInfo?.dates?.start ? new Date(tripInfo.dates.start) : new Date()
    
    const additionalDayTemplates = [
      [
        { time: '08:30', title: 'Khởi hành tour mới', lat: 10.8231, lng: 106.6297 },
        { time: '10:30', title: 'Tham quan địa danh nổi tiếng', lat: 10.8331, lng: 106.6397 },
        { time: '12:30', title: 'Ăn trưa tại nhà hàng view đẹp', lat: 10.8131, lng: 106.6197 },
        { time: '14:30', title: 'Trải nghiệm văn hóa địa phương', lat: 10.8431, lng: 106.6497 },
        { time: '17:00', title: 'Mua sắm quà lưu niệm', lat: 10.8531, lng: 106.6597 },
        { time: '19:00', title: 'Ăn tối buffet địa phương', lat: 10.8631, lng: 106.6697 }
      ],
      [
        { time: '07:45', title: 'Khám phá thiên nhiên hoang dã', lat: 10.8231, lng: 106.6297 },
        { time: '09:45', title: 'Trekking và leo núi nhẹ', lat: 10.8331, lng: 106.6397 },
        { time: '12:15', title: 'Ăn trưa tại suối', lat: 10.8131, lng: 106.6197 },
        { time: '14:45', title: 'Bơi lội và thư giãn', lat: 10.8431, lng: 106.6497 },
        { time: '16:45', title: 'Chụp ảnh hoàng hôn', lat: 10.8531, lng: 106.6597 },
        { time: '18:45', title: 'Ăn tối hải sản tươi sống', lat: 10.8631, lng: 106.6697 }
      ]
    ]
    
    for (let i = finalDays.length; i < actualDays; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(currentDate.getDate() + i)
      
      const templateIndex = i % additionalDayTemplates.length
      const dayActivities = additionalDayTemplates[templateIndex].map(activity => ({
        ...activity,
        lat: activity.lat + (Math.random() - 0.5) * 0.02,
        lng: activity.lng + (Math.random() - 0.5) * 0.02
      }))
      
      finalDays.push({
        date: currentDate.toISOString().split('T')[0],
        items: dayActivities
      })
    }
  }
  
  // If we have more days than requested, limit to requested days
  if (finalDays.length > actualDays) {
    finalDays = finalDays.slice(0, actualDays)
  }
  
  const totalDays = finalDays?.length || 0
  const startDate = finalDays?.[0]?.date
  const endDate = finalDays?.[totalDays - 1]?.date
  
  return (
    <div className="itin">
      <div className="itin__tabs">
        <button className="tab tab--active">Tổng quan</button>
        {Array.from({ length: totalDays }, (_, i) => (
          <button key={i} className="tab">Ngày {i+1}</button>
        ))}
      </div>
      
      {summary && (
        <div className="itin__hero">
          <div className="itin__banner" />
          <div className="itin__hero__body">
            <h2 className="itin__hero__title">
              {totalDays} ngày {tripInfo?.from && tripInfo?.to ? `từ ${tripInfo.from} đến ${tripInfo.to}` : 'du lịch'}
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
      
      {Array.isArray(finalDays) && finalDays.map((d, idx) => (
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