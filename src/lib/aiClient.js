// Lightweight AI client using Hugging Face OpenAI-compatible router
// Reads token from env (Vite: import.meta.env.VITE_HF_TOKEN)

const DEFAULT_MODELS = [
  // Prefer router canonical naming with provider suffix when available
  'openai/gpt-oss-20b:together',
  'Qwen/Qwen2.5-72B-Instruct',
  'meta-llama/Meta-Llama-3.1-8B-Instruct',
  'mistralai/Mixtral-8x7B-Instruct-v0.1',
]

async function callModel(prompt, apiKey, model) {
  const res = await fetch('https://router.huggingface.co/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are a travel planner. You MUST respond with valid JSON only. No explanations, no markdown, no code blocks. Follow the exact schema provided by the user.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.6,
      max_tokens: 1024,
      stream: false,
      response_format: { type: 'json_object' },
    }),
  })
  if (!res.ok) {
    let details = ''
    try { details = (await res.json())?.error?.message || (await res.text()) } catch {}
    throw new Error(`AI request failed (${res.status}): ${details}`)
  }
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content || ''
  return text
}

export async function generateItinerary(prompt) {
  const apiKey = import.meta.env.VITE_HF_TOKEN
  if (!apiKey) throw new Error('Missing VITE_HF_TOKEN')

  const preferred = import.meta.env.VITE_HF_MODEL
  const modelsToTry = preferred ? [preferred, ...DEFAULT_MODELS] : DEFAULT_MODELS
  let lastErr
  for (const model of modelsToTry) {
    try { 
      const result = await callModel(prompt, apiKey, model)
      console.log('AI response from', model, ':', result)
      return result
    } catch (e) { 
      console.log('Model', model, 'failed:', e.message)
      lastErr = e 
    }
  }
  throw lastErr || new Error('All models failed')
}

export function buildItineraryPrompt({ from, to, dates, options }) {
  const start = dates?.start || 'TBD'
  const end = dates?.end || 'TBD'
  const guests = options?.guests || 'solo'
  const budget = options?.budget || '$'
  const pace = options?.pace || 'Relax'
  
  // Calculate actual number of days
  let numDays = 1
  if (start && end && start !== 'TBD' && end !== 'TBD') {
    const startDate = new Date(start)
    const endDate = new Date(end)
    numDays = Math.max(1, Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)))
  }
  
  // Map options to more descriptive text
  const guestDesc = {
    'solo': 'solo traveler',
    'couple': 'couple',
    'friends': 'group of friends',
    'family': 'family with children'
  }[guests] || 'solo traveler'
  
  const budgetDesc = {
    '$': 'budget/low-cost',
    '$$': 'mid-range/moderate',
    '$$$': 'luxury/high-end'
  }[budget] || 'budget'
  
  const paceDesc = {
    'Relax': 'relaxed and leisurely pace',
    'Normal': 'moderate pace with some activities',
    'Active': 'active and adventurous pace'
  }[pace] || 'relaxed'
  
  return `You are a travel planner. Create a detailed itinerary in JSON format.

CRITICAL: Return ONLY valid JSON. No explanations, no markdown, no code blocks, no additional text before or after the JSON.

Required JSON schema:
{
  "summary": "Brief description of the trip",
  "days": [
    {
      "date": "YYYY-MM-DD",
      "items": [
        {
          "time": "HH:MM",
          "title": "Activity description",
          "lat": 10.1234,
          "lng": 106.5678
        }
      ]
    }
  ]
}

Trip details:
- From: ${from}
- To: ${to}
- Dates: ${start} to ${end}
- Duration: ${numDays} day${numDays > 1 ? 's' : ''}
- Travelers: ${guestDesc}
- Budget level: ${budgetDesc}
- Travel pace: ${paceDesc}

Requirements:
- Create EXACTLY ${numDays} day${numDays > 1 ? 's' : ''} itinerary - NO MORE, NO LESS
- If ${numDays} = 1, create only ONE day with all activities in that single day
- If ${numDays} = 2, create exactly TWO days
- Use realistic times in HH:MM format
- Include accurate lat/lng coordinates for each location
- Make activities suitable for ${budgetDesc} budget and ${paceDesc}
- Include transportation, accommodation, meals, and attractions
- Consider that this is for ${guestDesc}

SPECIFIC LOCATION REQUIREMENTS:
- Use REAL, SPECIFIC place names (hotels, restaurants, attractions)
- Research actual places in ${to} and use their real names
- For hotels: Use actual hotel names like "Hotel A25", "Dak Lak Hotel", "Sakura Hotel"
- For restaurants: Use actual restaurant names like "Nhà hàng Cơm Niêu", "Quán ăn Đặc sản", "Café Trung Nguyên"
- For attractions: Use actual attraction names like "Bảo tàng Đắk Lắk", "Chợ Buôn Ma Thuột", "Thác Dray Nur"
- For transportation: Use specific details like "Sân bay Liên Khương", "Ga xe lửa Buôn Ma Thuột"

CRITICAL: The "days" array must contain EXACTLY ${numDays} objects. Do not create extra days.

EXAMPLE FOR ${numDays} DAY${numDays > 1 ? 'S' : ''}:
${numDays === 1 ? 
  `{
    "summary": "1 day trip from ${from} to ${to}",
    "days": [
      {
        "date": "${start}",
        "items": [
          {"time": "08:00", "title": "Activity 1", "lat": 10.1234, "lng": 106.5678},
          {"time": "10:00", "title": "Activity 2", "lat": 10.1234, "lng": 106.5678},
          {"time": "12:00", "title": "Activity 3", "lat": 10.1234, "lng": 106.5678}
        ]
      }
    ]
  }` :
  `{
    "summary": "${numDays} day trip from ${from} to ${to}",
    "days": [
      {
        "date": "${start}",
        "items": [
          {"time": "08:00", "title": "Day 1 Activity 1", "lat": 10.1234, "lng": 106.5678},
          {"time": "10:00", "title": "Day 1 Activity 2", "lat": 10.1234, "lng": 106.5678}
        ]
      },
      {
        "date": "${end}",
        "items": [
          {"time": "08:00", "title": "Day 2 Activity 1", "lat": 10.1234, "lng": 106.5678},
          {"time": "10:00", "title": "Day 2 Activity 2", "lat": 10.1234, "lng": 106.5678}
        ]
      }
    ]
  }`
}

IMPORTANT FORMATTING RULES:
- Each activity title must be SHORT and CONCISE (max 40 characters)
- Use SPECIFIC location names, not generic terms
- Examples of good titles: "Chuyến bay Hà Nội - Đắk Lắk", "Nhận phòng tại Hotel A25", "Ăn trưa tại Nhà hàng Cơm Niêu", "Tham quan Bảo tàng Đắk Lắk", "Cà phê tại Trung Nguyên Legend"
- Use real, specific place names when possible
- Avoid generic terms like "hotel", "restaurant", "museum" - use actual names
- Keep titles in Vietnamese
- Each title should be a single, clear action with specific location

Return only the JSON object:`
}


