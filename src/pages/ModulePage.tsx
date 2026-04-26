import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { AppModule } from '../app/modules'
import { modulesForRole } from '../app/modules'
import type { UserRole } from '../app/roles'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'

export function ModulePage() {
  const { role, moduleId } = useParams()
  const safeRole = (role ?? 'donor') as UserRole
  const safeModule = (moduleId ?? 'settings') as AppModule

  const module = useMemo(
    () => modulesForRole(safeRole).find((m) => m.id === safeModule),
    [safeRole, safeModule],
  )

  if (!module) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-amber-600" />
            Module not available for this role
          </CardTitle>
          <CardDescription>
            Pick another module from the sidebar or return to dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to={`/app/${safeRole}`}>
            <Button variant="secondary">Back to dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center justify-between gap-3">
            <span>{module.label}</span>
            <div className="flex items-center gap-2">
              <Badge tone="info">{safeRole}</Badge>
              <Badge tone="neutral">{module.id}</Badge>
            </div>
          </CardTitle>
          <CardDescription>{module.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="secondary" disabled>
            Connect backend API (next)
          </Button>
          <Link to={`/app/${safeRole}`}>
            <Button variant="ghost">Back to dashboard</Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-emerald-600" />
              UI ready
            </CardTitle>
            <CardDescription>
              This page is wired into routing + navigation, and can be expanded
              with forms, tables, map views, and realtime updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Suggested next steps: add API client, create CRUD endpoints, and
            connect this module with real data.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planned features</CardTitle>
            <CardDescription>
              Based on your VolunAI requirements.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-700">
            <ul className="list-disc pl-5">
              <li>Verification + fraud checks</li>
              <li>Donation tracking + receipts</li>
              <li>Geo-based task assignment</li>
              <li>Emergency push/SMS/WhatsApp alerts</li>
              <li>Impact reports & dashboards</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

