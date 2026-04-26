import { HeartHandshake } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserRole } from '../app/roles'
import { USER_ROLES } from '../app/roles'
import { useSession } from '../app/session'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'

export function AuthPage() {
  const { signIn } = useSession()
  const nav = useNavigate()
  const [role, setRole] = useState<UserRole>('donor')
  const [name, setName] = useState('Demo User')

  const roleLabel = useMemo(
    () => USER_ROLES.find((r) => r.role === role)?.label ?? role,
    [role],
  )

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-xl px-4 py-12">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-indigo-600 text-white shadow-sm">
            <HeartHandshake className="size-5" />
          </div>
          <div>
            <div className="text-base font-semibold text-slate-900">
              VolunAI
            </div>
            <div className="text-sm text-slate-600">
              Demo sign-in (replace with OTP/email later)
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Pick a role to preview dashboards and module pages.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-900">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/40"
                placeholder="Your name"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-900">Role</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {USER_ROLES.map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => setRole(r.role)}
                    className={[
                      'rounded-xl border px-3 py-2 text-left text-sm font-medium transition-colors',
                      role === r.role
                        ? 'border-indigo-200 bg-indigo-50 text-indigo-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800',
                    ].join(' ')}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <div>
                <Badge tone="info">Selected: {roleLabel}</Badge>
              </div>
            </div>

            <Button
              onClick={() => {
                if (role === 'donor') {
                  nav('/auth/donor')
                  return
                }
                signIn({ name: name.trim() || 'Demo User', role })
                nav(`/app/${role}`)
              }}
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

