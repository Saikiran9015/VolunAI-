/**
 * Gemini AI helper for VolunAI chatbot.
 * Uses gemini-1.5-flash via REST — key from VITE_GEMINI_API_KEY in .env
 */

const SYSTEM_PROMPT = `You are VolunAI, a friendly and knowledgeable AI assistant for an NGO management and volunteer coordination platform.

Platform overview:
- VolunAI connects verified NGOs, donors, volunteers, corporates, and people in need
- Uses geolocation, AI matching, and impact tracking
- Supports emergency relief coordination and real-time alerts
- Provides transparency through receipts, audit trails, and impact reports
- Multi-language support: English, Hindi, Telugu, Tamil, Kannada, Urdu

Roles on the platform:
1. Donor: Register, browse verified NGOs, donate to campaigns, get receipts, track impact
2. Volunteer: Register, find tasks by skill/location, log hours, earn rewards/badges
3. NGO Admin: Register NGO, get verified, create campaigns, post volunteer tasks, manage teams, view analytics
4. Corporate: CSR module, partner with NGOs, log contributions, get impact reports
5. People in Need: Submit aid requests, get matched with NGOs/volunteers

Key features:
- AI Smart Matching: Donors matched to NGO needs; Volunteers matched to tasks by skill + location
- Emergency Alerts: Push/SMS/WhatsApp alerts to nearby volunteers and NGOs
- Volunteer Rewards: Gamification with points, badges, leaderboards
- Impact Tracking: Hours logged, tasks completed, donation utilization
- Donation Transparency: Full audit trail, receipts, usage reports
- Geo-based response: Location-aware task assignment and alerts
- Verification: NGO and volunteer verification for trust and safety

Answer any question the user asks — not just about VolunAI but general questions too.
Be warm, concise, helpful, and informative. Keep answers under 3 short paragraphs unless more detail is needed.`

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export async function sendToGemini(messages: ChatMessage[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('NO_API_KEY')
  }

  // Prepend system context as opening exchange
  const contents = [
    { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
    { role: 'model', parts: [{ text: 'Understood! I am VolunAI, ready to help with any questions about donations, volunteering, NGOs, or anything else.' }] },
    ...messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  ]

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        topP: 0.95,
      },
    }),
  })

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    console.error('[VolunAI Gemini] API error:', res.status, errBody)
    throw new Error(`GEMINI_${res.status}`)
  }

  const data = await res.json()
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  if (!text) throw new Error('EMPTY_RESPONSE')
  return text
}
