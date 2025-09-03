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
        { role: 'system', content: 'You are a travel planner that outputs concise JSON.' },
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
    try { return await callModel(prompt, apiKey, model) } catch (e) { lastErr = e }
  }
  throw lastErr || new Error('All models failed')
}

export function buildItineraryPrompt({ from, to, dates, options }) {
  const start = dates?.start || 'TBD'
  const end = dates?.end || 'TBD'
  const guests = options?.guests || 'solo'
  const budget = options?.budget || '$'
  const pace = options?.pace || 'Relax'
  return (
    `You are a trip planner.
Return ONLY valid JSON (no prose, no markdown). Schema: {"summary": string, "days": [{"date": string, "items": [{"time": string, "title": string, "lat": number, "lng": number}]}]}.
Trip: from ${from} to ${to}. Dates: ${start} to ${end}. Guests: ${guests}. Budget: ${budget}. Pace: ${pace}.
3 days preferred. Times in local time. Include realistic lat/lng for each item.
Reply with the JSON object only.`
  )
}


