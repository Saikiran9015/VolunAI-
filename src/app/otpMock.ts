const KEY_PREFIX = 'ngo-connect.otp.mock.'

function random6() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function mockSendOtp(mobile: string) {
  const code = random6()
  localStorage.setItem(`${KEY_PREFIX}${mobile}`, JSON.stringify({ code, at: Date.now() }))
  return code
}

export function mockVerifyOtp(mobile: string, code: string) {
  const raw = localStorage.getItem(`${KEY_PREFIX}${mobile}`)
  if (!raw) return false
  try {
    const parsed = JSON.parse(raw) as { code: string; at: number }
    return parsed.code === code
  } catch {
    return false
  }
}

