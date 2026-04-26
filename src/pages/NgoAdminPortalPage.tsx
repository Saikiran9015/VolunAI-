import { motion } from 'framer-motion'
import {
  Activity,
  BadgeIndianRupee,
  FileCheck2,
  HeartHandshake,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSession } from '../app/session'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Tabs } from '../components/ui/Tabs'

type Tab = 'login' | 'register' | 'verify'

export function NgoAdminPortalPage() {
  const nav = useNavigate()
  const { signIn } = useSession()
  const [tab, setTab] = useState<Tab>('login')
  const [ngoName, setNgoName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [accepted, setAccepted] = useState(false)

  const [status, setStatus] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const completeLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setStatus('Email and Password are required.')
      return
    }

    setIsLoggingIn(true)
    setStatus(null)
    try {
      const res = await fetch('/api/auth/login-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'ngo', email: email.trim(), password })
      })

      if (res.ok) {
        const data = await res.json()
        const userRole = data?.user?.role || 'ngo'

        signIn({ 
          name: data?.user?.fullName || 'User', 
          role: userRole,
          verificationStatus: data?.user?.verificationStatus
        })
        
        if (userRole === 'admin') {
          nav('/admin')
        } else {
          nav(`/app/${userRole}`)
        }
      } else {
        const err = await res.json().catch(() => ({}))
        setStatus(err?.message || 'Incorrect details. Please check your credentials.')
      }
    } catch {
      setStatus('Connection error. Please try again.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
            <HeartHandshake className="size-4 text-indigo-700" /> VolunAI / NGO Administration Portal
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Manage Impact with Confidence
          </h1>
          <p className="mt-3 text-slate-600">
            Manage donations, volunteers, campaigns, relief operations, and organizational impact
            through a secure digital dashboard.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="success">Verified NGO badge</Badge>
            <Badge tone="info">Audit logs</Badge>
            <Badge tone="warning">Fraud alerts</Badge>
          </div>

          <div className="mt-8 grid gap-3 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700">
            <div className="inline-flex items-center gap-2">
              <BadgeIndianRupee className="size-4 text-indigo-700" />
              Donation management + receipts + utilization
            </div>
            <div className="inline-flex items-center gap-2">
              <Users className="size-4 text-indigo-700" />
              Volunteer approval + attendance + certificates
            </div>
            <div className="inline-flex items-center gap-2">
              <Activity className="size-4 text-indigo-700" />
              Reports, analytics, and campaign operations
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Lead Change. Manage Smarter.</CardTitle>
              <CardDescription>
                Secure access for verified NGOs and nonprofit organizations.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Tabs<Tab>
                value={tab}
                onChange={setTab}
                columns={3}
                options={[
                  {
                    id: 'login',
                    label: 'Login',
                    content: (
                      <div className="grid gap-3">
                        <input
                          className="h-11 rounded-xl border border-slate-200 px-3"
                          placeholder="Official NGO Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                          className="h-11 rounded-xl border border-slate-200 px-3"
                          placeholder="Password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        {status && (
                          <div className={`rounded-xl border px-3 py-2 text-sm ${
                            status.includes('successful') 
                              ? 'border-green-200 bg-green-50 text-green-700' 
                              : 'border-rose-200 bg-rose-50 text-rose-700'
                          }`}>
                            {status}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <Button variant="secondary">Send OTP</Button>
                          <Button onClick={completeLogin}>Login Securely</Button>
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: 'register',
                    label: 'Register NGO',
                    content: (
                      <div className="grid gap-3">
                        <input
                          className="h-11 rounded-xl border border-slate-200 px-3"
                          placeholder="NGO Name"
                          value={ngoName}
                          onChange={(e) => setNgoName(e.target.value)}
                        />
                        <input
                          className="h-11 rounded-xl border border-slate-200 px-3"
                          placeholder="Registration Number"
                        />
                        <input
                          className="h-11 rounded-xl border border-slate-200 px-3"
                          placeholder="Official Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                          className="h-11 rounded-xl border border-slate-200 px-3"
                          placeholder="Official Phone"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                        />
                        <Button onClick={completeLogin}>Register NGO</Button>
                      </div>
                    ),
                  },
                  {
                    id: 'verify',
                    label: 'Verify Docs',
                    content: (
                      <div className="grid gap-3">
                        <label className="grid gap-1 text-sm font-medium text-slate-900">
                          NGO Registration Certificate
                          <input type="file" />
                        </label>
                        <label className="grid gap-1 text-sm font-medium text-slate-900">
                          PAN / 12A / 80G / Signatory ID
                          <input type="file" />
                        </label>
                        <label className="flex items-start gap-2 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={accepted}
                            onChange={(e) => setAccepted(e.target.checked)}
                            className="mt-1"
                          />
                          <span>I certify submitted details are accurate and compliant.</span>
                        </label>
                        <Button disabled={!accepted}>
                          Submit Verification <FileCheck2 className="size-4" />
                        </Button>
                      </div>
                    ),
                  },
                ]}
              />

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <div className="inline-flex items-center gap-2 font-semibold text-slate-900">
                  <ShieldCheck className="size-4 text-indigo-700" /> Government-Friendly Security
                </div>
                <div className="mt-1">
                  Encrypted admin sessions, role-based permissions, document verification, and
                  transparent fund usage policy.
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link to="/register" className="text-sm font-semibold text-slate-700">
                  ← Back
                </Link>
                <Button variant="ghost">Forgot Password</Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}

