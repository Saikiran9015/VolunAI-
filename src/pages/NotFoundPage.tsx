import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'

export function NotFoundPage() {
  return (
    <div className="min-h-dvh bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Page not found</CardTitle>
            <CardDescription>
              The page you’re looking for doesn’t exist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button variant="secondary">Go home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

