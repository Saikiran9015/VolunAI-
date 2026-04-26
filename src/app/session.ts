import { useEffect, useMemo, useState } from 'react'
import type { UserRole } from './roles'

type Session = {
  role: UserRole
  name: string
  verificationStatus?: 'not_started' | 'pending' | 'verified' | 'rejected'
}

const STORAGE_KEY = 'ngo-connect.session.v1'

export function readSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

export function writeSession(session: Session | null) {
  if (!session) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    setSession(readSession())
  }, [])

  return useMemo(
    () => ({
      session,
      signIn: (next: Session) => {
        writeSession(next)
        setSession(next)
      },
      signOut: () => {
        writeSession(null)
        setSession(null)
      },
    }),
    [session],
  )
}

