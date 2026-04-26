import { motion } from 'framer-motion'
import {
  BadgeCheck,
  BellRing,
  Building2,
  FileDown,
  HeartHandshake,
  Info,
  Lock,
  ShieldCheck,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { mockSendOtp, mockVerifyOtp } from '../app/otpMock'
import { useSession } from '../app/session'
import { useWebOtp } from '../app/webotp'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Tabs } from '../components/ui/Tabs'

type LoginTab = 'mobile' | 'email'

export function DonorLoginPage() {
  const OTP_EXPIRY_SECONDS = 10
  const nav = useNavigate()
  const { signIn } = useSession()
  const [tab, setTab] = useState<LoginTab>('mobile')

  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [secondsRemaining, setSecondsRemaining] = useState(0)
  const [otpExpired, setOtpExpired] = useState(false)
  const [demoOtp, setDemoOtp] = useState<string | null>(null)

  const [agreeAccuracy, setAgreeAccuracy] = useState(false)
  const [agreePolicies, setAgreePolicies] = useState(false)
  const [receiptByEmail, setReceiptByEmail] = useState(true)
  const [impactUpdates, setImpactUpdates] = useState(true)

  const canSubmit = useMemo(
    () => agreeAccuracy && agreePolicies,
    [agreeAccuracy, agreePolicies],
  )
  const otpActive = secondsRemaining > 0 && !otpExpired
  const generateDisabled = isSending || !canSubmit || otpActive

  useEffect(() => {
    if (secondsRemaining <= 0) return
    const timer = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer)
          setOtpExpired(true)
          setStatus('OTP Expired. Please generate a new OTP.')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [secondsRemaining])

  function clearOtpFlow() {
    setOtp('')
    setDemoOtp(null)
    setOtpExpired(false)
    setSecondsRemaining(0)
  }

  useWebOtp({
    enabled: tab === 'mobile' && canSubmit,
    onCode: (code) => {
      setOtp(code)
      setStatus('OTP detected from SMS. Verifying…')
      void verifyOtp(code)
    },
  })

  async function sendOtp() {
    if (!mobile.trim()) {
      setStatus('Enter mobile number first.')
      return
    }
    if (!canSubmit) {
      setStatus('Please accept mandatory declarations first.')
      return
    }

    setIsSending(true)
    clearOtpFlow()
    setStatus(null)
    try {
      // API-first (when backend is available)
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: mobile.trim(), role: 'donor' }),
      })

      if (res.ok) {
        const payload = await res.json().catch(() => ({}))
        if (payload?.demoOtp) setDemoOtp(payload.demoOtp)
        setSecondsRemaining(OTP_EXPIRY_SECONDS)
        setStatus('OTP sent successfully.')
        return
      }

      // fallback to local OTP (so UI remains usable during development)
      const code = mockSendOtp(mobile.trim())
      setDemoOtp(code)
      setSecondsRemaining(OTP_EXPIRY_SECONDS)
      setStatus('OTP sent successfully.')
    } catch {
      // fallback to local OTP (so UI remains usable during development)
      const code = mockSendOtp(mobile.trim())
      setDemoOtp(code)
      setSecondsRemaining(OTP_EXPIRY_SECONDS)
      setStatus('OTP sent successfully.')
    } finally {
      setIsSending(false)
    }
  }

  async function verifyOtp(code?: string) {
    const otpCode = (code ?? otp).trim()
    if (!mobile.trim() || !otpCode) {
      setStatus('Enter mobile number and OTP.')
      return
    }
    if (!otpActive) {
      setStatus('OTP Expired. Please generate a new OTP.')
      return
    }
    if (!canSubmit) {
      setStatus('Please accept mandatory declarations first.')
      return
    }

    setIsVerifying(true)
    setStatus(null)
    try {
      // API-first (when backend is available)
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: mobile.trim(), otp: otpCode, role: 'donor' }),
      })
      if (res.ok) {
        clearOtpFlow()
        onLogin()
        return
      }

      // fallback to mock
      const ok = mockVerifyOtp(mobile.trim(), otpCode)
      if (!ok) {
        setStatus('Invalid OTP (demo). Please retry.')
        return
      }
      clearOtpFlow()
      onLogin()
    } catch {
      const ok = mockVerifyOtp(mobile.trim(), otpCode)
      if (!ok) {
        setStatus('Invalid OTP (demo). Please retry.')
        return
      }
      clearOtpFlow()
      onLogin()
    } finally {
      setIsVerifying(false)
    }
  }

  const onLogin = async () => {
    if (!canSubmit) {
      setStatus('Please accept mandatory declarations first.')
      return
    }
    if (!email || !password) {
      setStatus('Enter both email and password.')
      return
    }

    setIsVerifying(true)
    setStatus(null)
    try {
      const res = await fetch('/api/auth/login-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'donor', email: email.trim(), password })
      })

      if (res.ok) {
        const data = await res.json()
        const userRole = data?.user?.role || 'donor'
        
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
        setStatus(err?.message || 'Incorrect credentials. Please check your email and password.')
      }
    } catch {
      setStatus('Unable to connect to the server. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute -left-24 -top-24 size-[520px] rounded-full bg-indigo-600/35 blur-3xl" />
        <div className="absolute -right-24 top-32 size-[520px] rounded-full bg-fuchsia-600/25 blur-3xl" />
        <div className="absolute bottom-[-240px] left-1/3 size-[640px] rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-2 md:items-stretch md:py-16">
        <motion.section
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col justify-between"
        >
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80 hover:bg-white/10"
            >
              <HeartHandshake className="size-4" /> VolunAI
              <span className="text-white/40">/</span>
              Donor Login Portal
            </Link>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
              Make Every Contribution Count
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-white/70">
              Securely sign in to support verified NGOs, disaster relief programs,
              healthcare campaigns, education drives, and community welfare
              initiatives.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge tone="info" className="bg-white/10 text-white ring-white/10">
                <ShieldCheck className="mr-1 size-3.5" /> Verified NGOs
              </Badge>
              <Badge
                tone="success"
                className="bg-white/10 text-white ring-white/10"
              >
                <Lock className="mr-1 size-3.5" /> Encrypted sessions
              </Badge>
              <Badge
                tone="warning"
                className="bg-white/10 text-white ring-white/10"
              >
                <BellRing className="mr-1 size-3.5" /> Emergency campaigns
              </Badge>
            </div>

            <div className="mt-10 grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold text-white/90">
                Welcome Donor
              </div>
              <div className="text-sm leading-relaxed text-white/70">
                Your contributions help create measurable social impact. Log in
                to donate funds, goods, services, or support verified causes
                across India through a secure and transparent platform.
              </div>

              <div className="mt-2 grid gap-2 text-sm text-white/70">
                <div className="inline-flex items-center gap-2">
                  <Building2 className="size-4 text-white/70" />
                  Support Education, Healthcare, Disaster Relief, Hunger Relief,
                  Women & Child Welfare, Rural Development
                </div>
                <div className="inline-flex items-center gap-2">
                  <FileDown className="size-4 text-white/70" />
                  Download receipts & view impact reports after login
                </div>
                <div className="inline-flex items-center gap-2">
                  <BadgeCheck className="size-4 text-white/70" />
                  NGO verification badges to build trust
                </div>
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs leading-relaxed text-white/50">
            This platform supports transparent social welfare initiatives in
            accordance with applicable Indian regulations and best digital
            governance practices.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
          className="flex"
        >
          <Card className="w-full border-white/10 bg-white/95 text-slate-900 shadow-2xl shadow-indigo-500/10">
            <CardHeader>
              <CardTitle>Secure Donor Access</CardTitle>
              <CardDescription>
                Login to contribute safely to verified causes and monitor your
                social impact.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <Tabs<LoginTab>
                value={tab}
                onChange={setTab}
                columns={2}
                options={[
                  {
                    id: 'mobile',
                    label: 'Mobile OTP',
                    content: (
                      <div className="grid gap-3">
                        <div className="grid gap-2">
                          <label className="text-sm font-medium text-slate-900">
                            Mobile Number
                          </label>
                          <input
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                            placeholder="Enter registered mobile number"
                            inputMode="numeric"
                            autoComplete="tel"
                          />
                          <div className="text-xs text-slate-600">
                            OTP will be sent to your registered mobile number.
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <label className="text-sm font-medium text-slate-900">
                            OTP
                          </label>
                          <input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                            placeholder="Enter OTP"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            disabled={!otpActive}
                          />
                        </div>

                        {otpActive && (
                          <div className="text-xs font-medium text-indigo-700">
                            Time Remaining: {secondsRemaining} seconds
                          </div>
                        )}

                        {demoOtp && (
                          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
                            Demo OTP: <span className="font-semibold">{demoOtp}</span>
                          </div>
                        )}

                        {status && (
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                            {status}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="secondary"
                            type="button"
                            onClick={() => void sendOtp()}
                            disabled={generateDisabled}
                          >
                            {isSending ? 'Sending…' : otpActive ? 'OTP Sent' : 'Send OTP'}
                          </Button>
                          <Button
                            type="button"
                            onClick={() => void verifyOtp()}
                            disabled={!canSubmit || isVerifying || !otpActive}
                          >
                            {isVerifying ? 'Verifying…' : 'Verify & Login'}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              clearOtpFlow()
                              setStatus(null)
                            }}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: 'email',
                    label: 'Email',
                    content: (
                      <div className="grid gap-3">
                        <div className="grid gap-2">
                          <label className="text-sm font-medium text-slate-900">
                            Email Address
                          </label>
                          <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                            placeholder="Enter registered email ID"
                            autoComplete="email"
                          />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium text-slate-900">
                            Password
                          </label>
                          <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                            placeholder="Enter password"
                            type="password"
                            autoComplete="current-password"
                          />
                        </div>

                        {status && (
                          <div className={`rounded-2xl border px-4 py-3 text-sm ${
                            status.includes('successful') 
                              ? 'border-green-200 bg-green-50 text-green-700' 
                              : 'border-rose-200 bg-rose-50 text-rose-700'
                          }`}>
                            {status}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <button
                            type="button"
                            className="text-sm font-semibold text-indigo-700 hover:text-indigo-800"
                          >
                            Forgot Password
                          </button>
                          <Button type="button" onClick={onLogin} disabled={!canSubmit}>
                            Login Securely
                          </Button>
                        </div>
                      </div>
                    ),
                  },
                ]}
              />

              <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 size-5 text-slate-500" />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">
                      Compliance Notice (Important)
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      By logging in, you agree to Platform Terms & Conditions,
                      Privacy Policy, Donation Transparency Guidelines, applicable
                      Indian IT Act and data protection rules, and anti-fraud/KYC
                      policies.
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 text-sm">
                  <label className="flex items-start gap-2 text-slate-700">
                    <input
                      type="checkbox"
                      checked={agreeAccuracy}
                      onChange={(e) => setAgreeAccuracy(e.target.checked)}
                      className="mt-1 size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30"
                    />
                    <span>I confirm information provided is accurate</span>
                  </label>
                  <label className="flex items-start gap-2 text-slate-700">
                    <input
                      type="checkbox"
                      checked={agreePolicies}
                      onChange={(e) => setAgreePolicies(e.target.checked)}
                      className="mt-1 size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30"
                    />
                    <span>I agree to privacy and compliance policies</span>
                  </label>

                  <div className="mt-1 grid gap-2 border-t border-slate-200 pt-3">
                    <label className="flex items-start gap-2 text-slate-700">
                      <input
                        type="checkbox"
                        checked={receiptByEmail}
                        onChange={(e) => setReceiptByEmail(e.target.checked)}
                        className="mt-1 size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30"
                      />
                      <span>Receive donation receipts by email</span>
                    </label>
                    <label className="flex items-start gap-2 text-slate-700">
                      <input
                        type="checkbox"
                        checked={impactUpdates}
                        onChange={(e) => setImpactUpdates(e.target.checked)}
                        className="mt-1 size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30"
                      />
                      <span>Receive impact updates</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">
                  KYC Notice (Government-friendly)
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  For higher-value donations, tax receipts, CSR-linked
                  contributions, or regulated campaigns, identity verification may
                  be required as per applicable laws (e.g., Name, PAN, Address,
                  OTP, organization details).
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                  to="/register"
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                >
                  ← Back
                </Link>
                <Button variant="secondary" type="button" onClick={() => nav('/register')}>
                  Register as New Donor
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}

