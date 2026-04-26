import { motion } from 'framer-motion'
import { ShieldCheck, ArrowLeft, Lock } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSession } from '../app/session'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'

export function AdminLoginPage() {
  const nav = useNavigate()
  const { signIn } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      setStatus('Please enter both email and password.')
      return
    }

    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch('/api/auth/login-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'donor', email, password }) // Admin bypass works with any role in backend
      })

      if (res.ok) {
        const data = await res.json()
        signIn({ 
          name: data.user.fullName, 
          role: 'admin', // Force admin role in session
          verificationStatus: 'verified' 
        })
        nav('/admin')
      } else {
        setStatus('Access Denied. Invalid admin credentials.')
      }
    } catch {
      setStatus('Server connection failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="inline-grid size-16 place-items-center rounded-3xl bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 mb-4">
            <ShieldCheck className="size-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Command Center</h1>
          <p className="text-slate-400 mt-2">Authorized Personnel Only</p>
        </div>

        <Card className="border-slate-800 bg-slate-900 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white">Secure Login</CardTitle>
            <CardDescription className="text-slate-500">Enter your administrative credentials to continue.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300">Admin Email</label>
              <input
                type="email"
                placeholder="admin@volunai.ai"
                className="h-11 rounded-xl bg-slate-800 border-slate-700 text-white px-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-300">Master Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="h-11 rounded-xl bg-slate-800 border-slate-700 text-white px-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {status && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-sm text-rose-400">
                {status}
              </div>
            )}

            <Button 
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 h-11 text-base font-bold shadow-lg shadow-indigo-500/25"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Establish Connection'}
            </Button>

            <Link to="/" className="inline-flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
              <ArrowLeft className="size-4" /> Back to Public Landing
            </Link>
          </CardContent>
        </Card>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-600 font-medium tracking-widest uppercase">
          <Lock className="size-3" /> Encrypted Session • Level 5 Auth
        </div>
      </motion.div>
    </div>
  )
}
