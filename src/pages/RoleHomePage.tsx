import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { modulesForRole } from '../app/modules'
import type { UserRole } from '../app/roles'
import { USER_ROLES } from '../app/roles'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'

function roleLabel(role: UserRole) {
  return USER_ROLES.find((r) => r.role === role)?.label ?? role
}

export function RoleHomePage() {
  const { role } = useParams()
  const safeRole = (role ?? 'donor') as UserRole
  const modules = useMemo(() => modulesForRole(safeRole), [safeRole])

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{roleLabel(safeRole)} Dashboard</CardTitle>
          <CardDescription>
            This is a starter UI shell. Each module page is ready for API
            integration (Node/Django backend).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          <Badge tone="success">Verified entities</Badge>
          <Badge tone="warning">Geo-based alerts</Badge>
          <Badge tone="info">Impact tracking</Badge>
          <Badge tone="neutral">Multi-language (UI ready)</Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((m) => (
          <Card key={m.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3">
                <span>{m.label}</span>
                <Badge tone="neutral">{m.id}</Badge>
              </CardTitle>
              <CardDescription>{m.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={m.id === 'verification' ? `/app/${safeRole}/kyc` : `/app/${safeRole}/${m.id}`}>
                <Button variant={m.id === 'verification' ? 'primary' : 'secondary'}>
                  {m.id === 'verification' ? 'Start KYC' : 'Open'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

