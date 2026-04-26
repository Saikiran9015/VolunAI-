import { Building2, HeartHandshake, LogOut, MapPin, Siren, ShieldCheck, CheckCircle2, User as UserIcon } from 'lucide-react'
import { NavLink, Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { modulesForRole } from '../app/modules'
import type { UserRole } from '../app/roles'
import { USER_ROLES } from '../app/roles'
import { useSession } from '../app/session'
import { cn } from '../lib/cn'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'

function labelForRole(role: UserRole) {
  return USER_ROLES.find((r) => r.role === role)?.label ?? role
}

export function AppShell() {
  const { role } = useParams()
  const safeRole = (role ?? 'donor') as UserRole
  const links = modulesForRole(safeRole)
  const { session, signOut } = useSession()
  const nav = useNavigate()
  const loc = useLocation()

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-2xl bg-indigo-600 text-white shadow-sm">
                <HeartHandshake className="size-5" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-slate-900">
                  VolunAI
                </div>
                <div className="text-xs text-slate-600">AI-powered relief platform</div>
              </div>
            </div>
            <Badge tone="info">{labelForRole(safeRole)}</Badge>
          </div>

          <div className="p-3 flex-1">
            <div className="mb-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Modules
            </div>
            <nav className="flex flex-col gap-1">
              <NavLink
                to={`/app/${safeRole}`}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-50 text-indigo-800'
                      : 'text-slate-700 hover:bg-slate-100',
                  )
                }
                end
              >
                <span className="inline-flex items-center gap-2">
                  <Building2 className="size-4" />
                  Dashboard
                </span>
              </NavLink>

              <NavLink
                to={`/app/${safeRole}/kyc`}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-50 text-indigo-800'
                      : 'text-slate-700 hover:bg-slate-100',
                  )
                }
              >
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="size-4" />
                  KYC Verification
                </span>
              </NavLink>

              <NavLink
                to={`/app/${safeRole}/profile`}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-50 text-indigo-800'
                      : 'text-slate-700 hover:bg-slate-100',
                  )
                }
              >
                <span className="inline-flex items-center gap-2">
                  <UserIcon className="size-4" />
                  My Profile
                </span>
              </NavLink>

              {safeRole === 'admin' && (
                <Link
                  to="/admin"
                  className="mt-4 rounded-xl px-3 py-2 text-sm font-bold bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="size-4" />
                    Admin Command
                  </span>
                </Link>
              )}

              {links.filter(m => m.id !== 'verification').map((m) => (
                <NavLink
                  key={m.id}
                  to={`/app/${safeRole}/${m.id}`}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-indigo-50 text-indigo-800'
                        : 'text-slate-700 hover:bg-slate-100',
                    )
                  }
                >
                  <span className="inline-flex items-center gap-2">
                    {m.id === 'nearby-ngos' ? (
                      <MapPin className="size-4" />
                    ) : m.id === 'emergency-alerts' ? (
                      <Siren className="size-4" />
                    ) : (
                      <HeartHandshake className="size-4" />
                    )}
                    {m.label}
                  </span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="border-t border-slate-200 p-3">
            <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 border border-slate-100">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 truncate text-sm font-medium text-slate-900">
                  {session?.name ?? 'Demo User'}
                  {session?.verificationStatus === 'verified' && (
                    <CheckCircle2 className="size-3.5 text-green-600" />
                  )}
                </div>
                <div className="flex items-center gap-2 truncate text-xs text-slate-600">
                  {session?.role ? labelForRole(session.role) : 'Not signed in'}
                  {session?.verificationStatus === 'verified' ? (
                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-tighter bg-green-100 px-1 rounded">Verified</span>
                  ) : (
                    <Link to={`/app/${safeRole}/kyc`} className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-tighter underline-offset-2">Verify Now</Link>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-slate-200"
                onClick={() => {
                  signOut()
                  if (loc.pathname.startsWith('/app')) nav('/register')
                }}
              >
                <LogOut className="size-4 text-slate-500" />
              </Button>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
