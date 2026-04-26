import { motion } from 'framer-motion'
import {
  BellRing,
  HeartHandshake,
  MapPin,
  Siren,
  Star,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSession } from '../app/session'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Tabs } from '../components/ui/Tabs'

type Tab = 'login' | 'register' | 'skills'

const skills = [
  'Teaching',
  'Medical Support',
  'First Aid',
  'Driving',
  'Event Management',
  'Food Distribution',
  'IT / Technical Support',
  'Counseling',
  'Translation',
  'Rescue Support',
]

export function VolunteerPortalPage() {
  const nav = useNavigate()
  const { signIn } = useSession()
  const [tab, setTab] = useState<Tab>('login')
  const [fullName, setFullName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [agreed, setAgreed] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    )
  }

  const completeLogin = async () => {
    if (!mobile.trim() || !password.trim()) {
      setStatus('Mobile and Password/OTP are required.')
      return
    }

    setStatus(null)
    try {
      // Try email login if it looks like an email, or just attempt login-email endpoint
      const res = await fetch('/api/auth/login-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'volunteer', email: mobile.trim(), password })
      })

      if (res.ok) {
        const data = await res.json()
        const userRole = data?.user?.role || 'volunteer'

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
      // setIsLoggingIn(false) // Removed
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-2">
        <motion.section
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80">
            <HeartHandshake className="size-4" /> VolunAI / Volunteer Access Portal
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
            Be the Reason Someone Smiles Today
          </h1>
          <p className="mt-3 text-white/70">
            Join verified social service activities, emergency response programs, and NGO missions
            with secure volunteer access.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="info" className="bg-white/10 text-white ring-white/10">
              Verified tasks
            </Badge>
            <Badge tone="success" className="bg-white/10 text-white ring-white/10">
              Certificates
            </Badge>
            <Badge tone="warning" className="bg-white/10 text-white ring-white/10">
              Emergency alerts
            </Badge>
          </div>

          <div className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/75">
            <div className="inline-flex items-center gap-2">
              <MapPin className="size-4" /> Nearby opportunities and campaigns
            </div>
            <div className="inline-flex items-center gap-2">
              <Star className="size-4" /> Reward points, badges, digital certificates
            </div>
            <div className="inline-flex items-center gap-2">
              <Siren className="size-4" /> Urgent requests: blood, flood, food distribution
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <Card className="border-white/10 bg-white/95 text-slate-900">
            <CardHeader>
              <CardTitle>Serve with Purpose. Lead with Action.</CardTitle>
              <CardDescription>
                Secure access to meaningful volunteer opportunities.
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
                          placeholder="Enter registered mobile number"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                        />
                        <input
                          className="h-11 rounded-xl border border-slate-200 px-3"
                          placeholder="Enter OTP / password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
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
                    label: 'Register',
                    content: (
                      <div className="grid gap-3">
                        <input
                          className="h-11 rounded-xl border border-slate-200 px-3"
                          placeholder="Full Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                        <input
                          className="h-11 rounded-xl border border-slate-200 px-3"
                          placeholder="Mobile Number"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                        />
                        <input
                          className="h-11 rounded-xl border border-slate-200 px-3"
                          placeholder="Email ID"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className="flex items-start gap-2 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="mt-1"
                          />
                          <span>I agree to volunteer conduct policy and safety rules.</span>
                        </label>
                        <Button disabled={!agreed} onClick={completeLogin}>
                          Register as Volunteer
                        </Button>
                      </div>
                    ),
                  },
                  {
                    id: 'skills',
                    label: 'Skills',
                    content: (
                      <div className="grid gap-3">
                        <div className="text-sm font-medium text-slate-900">Select your skills</div>
                        <div className="grid grid-cols-2 gap-2">
                          {skills.map((skill) => (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => toggleSkill(skill)}
                              className={[
                                'rounded-xl border px-3 py-2 text-left text-sm',
                                selectedSkills.includes(skill)
                                  ? 'border-indigo-200 bg-indigo-50 text-indigo-900'
                                  : 'border-slate-200 bg-white text-slate-700',
                              ].join(' ')}
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                        <Button variant="secondary" onClick={completeLogin}>
                          Save Skills Profile
                        </Button>
                      </div>
                    ),
                  },
                ]}
              />

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">Security & Compliance</div>
                OTP verification, encrypted data storage, verified NGO tasks, and secure
                communication channels.
              </div>

              <div className="flex items-center justify-between">
                <Link to="/register" className="text-sm font-semibold text-slate-700">
                  ← Back
                </Link>
                <Button variant="ghost">
                  Forgot Password <BellRing className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}

