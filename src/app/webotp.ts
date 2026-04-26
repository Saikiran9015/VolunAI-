import { useEffect, useRef } from 'react'

type OtpCredential = { code: string; type: 'otp' }

export function useWebOtp({
  enabled,
  onCode,
}: {
  enabled: boolean
  onCode: (code: string) => void
}) {
  const latestOnCode = useRef(onCode)
  latestOnCode.current = onCode

  useEffect(() => {
    if (!enabled) return
    if (!('OTPCredential' in window)) return
    if (!navigator.credentials?.get) return

    const ac = new AbortController()

    ;(async () => {
      try {
        const otp = (await navigator.credentials.get({
          otp: { transport: ['sms'] },
          signal: ac.signal,
        } as CredentialRequestOptions)) as unknown as OtpCredential

        if (otp?.code) latestOnCode.current(otp.code)
      } catch {
        // ignore: user denied, timeout, or unsupported environment
      }
    })()

    return () => ac.abort()
  }, [enabled])
}

