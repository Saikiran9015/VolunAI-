/**
 * Gemini Multi-modal helper for Document KYC.
 * Extracts data and verifies authenticity from images.
 */

export type KycResult = {
  is_verified: boolean
  confidence_score: number
  rejection_reason: string | null
  extracted_data: Record<string, any>
}

export async function verifyDocumentWithAI(
  base64Image: string,
  docType: 'AADHAAR' | 'PAN' | 'NGO_REG' | '80G'
): Promise<KycResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY_MISSING')

  const prompt = `You are an expert KYC verification AI. Analyze this ${docType} document.
  1. Extract all relevant fields (Name, ID number, Expiry, etc.).
  2. Check for: Blurriness, Cropped edges, Tampering, or Expired dates.
  3. Return a JSON object with:
     {
       "is_verified": boolean,
       "confidence_score": number (0-100),
       "rejection_reason": string | null,
       "extracted_data": { ... }
     }`

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

  // Format: strip the "data:image/jpeg;base64," prefix
  const rawBase64 = base64Image.split(',')[1] || base64Image

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: rawBase64,
              },
            },
          ],
        },
      ],
    }),
  })

  if (!response.ok) throw new Error('GEMINI_API_ERROR')

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  
  // Extract JSON from the AI response
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('INVALID_AI_RESPONSE')
  
  return JSON.parse(jsonMatch[0])
}
