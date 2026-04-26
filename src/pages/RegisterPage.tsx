import { motion } from 'framer-motion'
import { BadgeCheck, FileCheck2, HeartHandshake, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { UserRole } from '../app/roles'
import { USER_ROLES } from '../app/roles'
import { useSession } from '../app/session'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/Card'

type VerificationStatus = 'not_started' | 'pending' | 'verified'

function roleLabel(role: UserRole) {
  return USER_ROLES.find((r) => r.role === role)?.label ?? role
}

function verificationTone(status: VerificationStatus) {
  switch (status) {
    case 'verified':
      return { tone: 'success' as const, text: 'Verified' }
    case 'pending':
      return { tone: 'warning' as const, text: 'Verification: Pending' }
    default:
      return { tone: 'neutral' as const, text: 'Verification: Not started' }
  }
}

export function RegisterPage() {
  const nav = useNavigate()
  const { signIn } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<string | null>(null)

  const [searchParams] = useSearchParams()
  const initialRole = (searchParams.get('role') as UserRole) || 'donor'
  const [role, setRole] = useState<UserRole>(initialRole)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [stateCity, setStateCity] = useState('')
  const [pan, setPan] = useState('')
  const [panName, setPanName] = useState('')
  const [panDob, setPanDob] = useState('')

  // Document “uploads” (UI placeholders; real upload will be backend later)
  const [volunteerAadhaar, setVolunteerAadhaar] = useState<File | null>(null)
  const [volunteerPhoto, setVolunteerPhoto] = useState<File | null>(null)
  const [volunteerSkillCert, setVolunteerSkillCert] = useState<File | null>(null)
  const [volunteerPolice, setVolunteerPolice] = useState<File | null>(null)

  const [ngoRegCert, setNgoRegCert] = useState<File | null>(null)
  const [ngoPan, setNgoPan] = useState<File | null>(null)
  const [ngoGst, setNgoGst] = useState<File | null>(null)
  const [ngoTrustDeed, setNgoTrustDeed] = useState<File | null>(null)
  const [ngoAddressProof, setNgoAddressProof] = useState<File | null>(null)

  const [agreeAccuracy, setAgreeAccuracy] = useState(false)
  const [agreePolicies, setAgreePolicies] = useState(false)

  const verificationStatus = useMemo<VerificationStatus>(() => {
    if (role === 'volunteer') {
      const any =
        !!volunteerAadhaar || !!volunteerPhoto || !!volunteerSkillCert || !!volunteerPolice
      return any ? 'pending' : 'not_started'
    }
    if (role === 'ngo') {
      const any =
        !!ngoRegCert || !!ngoPan || !!ngoGst || !!ngoTrustDeed || !!ngoAddressProof
      return any ? 'pending' : 'not_started'
    }
    if (role === 'donor') {
      return pan.trim() ? 'pending' : 'not_started'
    }
    return 'not_started'
  }, [
    role,
    volunteerAadhaar,
    volunteerPhoto,
    volunteerSkillCert,
    volunteerPolice,
    ngoRegCert,
    ngoPan,
    ngoGst,
    ngoTrustDeed,
    ngoAddressProof,
    pan,
  ])

  const verificationBadge = verificationTone(verificationStatus)

  const canContinue = useMemo(() => {
    if (!agreeAccuracy || !agreePolicies) return false
    if (!fullName.trim()) return false
    if (!email.trim()) return false
    if (!password.trim() && email.trim()) return false
    if (email.trim() && password !== confirmPassword) return false
    return true
  }, [agreeAccuracy, agreePolicies, fullName, email, password, confirmPassword])

  return (
    <div className="min-h-dvh bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-indigo-600 text-white shadow-sm">
              <HeartHandshake className="size-5" />
            </div>
            <div>
              <div className="text-base font-semibold text-slate-900">
                Government-Compliant Registration
              </div>
              <div className="text-sm text-slate-600">
                Select your role and complete verification (where applicable).
              </div>
            </div>
          </div>
          <Badge tone={verificationBadge.tone}>{verificationBadge.text}</Badge>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Role</CardTitle>
                <CardDescription>
                  Choose an official role to access the correct portal and compliance flow.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {USER_ROLES.map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setRole(r.role)}
                      className={[
                        'rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition-colors',
                        role === r.role
                          ? 'border-indigo-200 bg-indigo-50 text-indigo-900'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-900',
                      ].join(' ')}
                    >
                      {r.label}
                      <div className="mt-1 text-xs font-medium text-slate-600">
                        {r.role}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      if (role === 'donor') nav('/auth/donor')
                      else if (role === 'volunteer') nav('/auth/volunteer')
                      else if (role === 'ngo') nav('/auth/ngo')
                    }}
                  >
                    Open {roleLabel(role)} Portal
                  </Button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 size-4 text-indigo-700" />
                    <div>
                      <div className="font-semibold text-slate-900">
                        Verification rule
                      </div>
                      <div className="mt-1 text-slate-600">
                        If you provide verification fields/documents now, the system will mark your
                        account as <span className="font-semibold">Verification: Pending</span> until
                        the Admin approves it.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{roleLabel(role)} Registration</CardTitle>
                <CardDescription>
                  Fill the details required for your role (government-friendly & professional).
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-900">Full Name</label>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-900">Email</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                      placeholder="Enter email ID"
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-900">Password</label>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                      placeholder="Create password"
                      type="password"
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-900">Confirm Password</label>
                    <input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                      placeholder="Confirm password"
                      type="password"
                      autoComplete="new-password"
                    />
                    {email.trim() && confirmPassword && password !== confirmPassword && (
                      <div className="text-xs text-rose-600">Password and confirm password do not match.</div>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-900">State / City</label>
                    <input
                      value={stateCity}
                      onChange={(e) => setStateCity(e.target.value)}
                      className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                      placeholder="Ex: Telangana / Hyderabad"
                    />
                  </div>
                </div>

                {role === 'donor' && (
                  <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-semibold text-slate-900">
                      PAN Card Verification Details
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <input
                        value={pan}
                        onChange={(e) => setPan(e.target.value.toUpperCase())}
                        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                        placeholder="PAN Number (optional)"
                      />
                      <input
                        value={panName}
                        onChange={(e) => setPanName(e.target.value)}
                        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                        placeholder="Name as per PAN"
                      />
                      <input
                        value={panDob}
                        onChange={(e) => setPanDob(e.target.value)}
                        className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
                        placeholder="Date of Birth"
                      />
                    </div>
                    <div className="text-xs text-slate-600">
                      PAN details will be marked as pending verification for tax receipts / regulated donations.
                    </div>
                  </div>
                )}

                {role === 'volunteer' && (
                  <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-semibold text-slate-900">
                      Volunteer Verification Documents
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="grid gap-1 text-sm font-medium text-slate-900">
                        Aadhaar (upload)
                        <input type="file" onChange={(e) => setVolunteerAadhaar(e.target.files?.[0] ?? null)} />
                      </label>
                      <label className="grid gap-1 text-sm font-medium text-slate-900">
                        Photo (upload)
                        <input type="file" onChange={(e) => setVolunteerPhoto(e.target.files?.[0] ?? null)} />
                      </label>
                      <label className="grid gap-1 text-sm font-medium text-slate-900">
                        Skills Certificate (upload)
                        <input type="file" onChange={(e) => setVolunteerSkillCert(e.target.files?.[0] ?? null)} />
                      </label>
                      <label className="grid gap-1 text-sm font-medium text-slate-900">
                        Police Verification (optional)
                        <input type="file" onChange={(e) => setVolunteerPolice(e.target.files?.[0] ?? null)} />
                      </label>
                    </div>
                    <div className="inline-flex items-center gap-2 text-xs text-slate-600">
                      <FileCheck2 className="size-4" /> Uploading any document will set verification to “Pending”.
                    </div>
                  </div>
                )}

                {role === 'ngo' && (
                  <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-semibold text-slate-900">NGO Verification Documents</div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="grid gap-1 text-sm font-medium text-slate-900">
                        Registration Certificate
                        <input type="file" onChange={(e) => setNgoRegCert(e.target.files?.[0] ?? null)} />
                      </label>
                      <label className="grid gap-1 text-sm font-medium text-slate-900">
                        PAN
                        <input type="file" onChange={(e) => setNgoPan(e.target.files?.[0] ?? null)} />
                      </label>
                      <label className="grid gap-1 text-sm font-medium text-slate-900">
                        GST
                        <input type="file" onChange={(e) => setNgoGst(e.target.files?.[0] ?? null)} />
                      </label>
                      <label className="grid gap-1 text-sm font-medium text-slate-900">
                        Trust Deed
                        <input type="file" onChange={(e) => setNgoTrustDeed(e.target.files?.[0] ?? null)} />
                      </label>
                      <label className="grid gap-1 text-sm font-medium text-slate-900 sm:col-span-2">
                        Address Proof
                        <input type="file" onChange={(e) => setNgoAddressProof(e.target.files?.[0] ?? null)} />
                      </label>
                    </div>
                    <div className="inline-flex items-center gap-2 text-xs text-slate-600">
                      <BadgeCheck className="size-4" /> NGO will be visible as “Verified” only after Admin approval.
                    </div>
                  </div>
                )}

                <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-900">Mandatory declarations</div>
                  <label className="flex items-start gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={agreeAccuracy}
                      onChange={(e) => setAgreeAccuracy(e.target.checked)}
                      className="mt-1 size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30"
                    />
                    <span>I confirm information provided is accurate</span>
                  </label>
                  <label className="flex items-start gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={agreePolicies}
                      onChange={(e) => setAgreePolicies(e.target.checked)}
                      className="mt-1 size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30"
                    />
                    <span>I agree to privacy and compliance policies</span>
                  </label>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => nav('/')}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    disabled={!canContinue || isSubmitting}
                    onClick={async () => {
                      setIsSubmitting(true)
                      setSubmitStatus(null)

                      try {
                        const res = await fetch('/api/auth/register', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            role,
                            fullName: fullName.trim(),
                            email: email.trim() || undefined,
                            password: password.trim() || undefined,
                            stateCity: stateCity.trim() || undefined,
                            panNumber: role === 'donor' ? pan.trim() || undefined : undefined,
                            panName: role === 'donor' ? panName.trim() || undefined : undefined,
                            panDob: role === 'donor' ? panDob.trim() || undefined : undefined,
                            verificationStatus:
                              verificationStatus === 'pending' ? 'pending' : 'not_started',
                          }),
                        })

                        if (!res.ok) {
                          const status = res.status
                          const err = await res.json().catch(() => null)
                          const msg = err?.message || err?.error || `Server Error (${status})`
                          setSubmitStatus(`Registration failed: ${msg}. Please try 'npm run dev:all' to start the backend.`)
                          return
                        }

                        const data = await res.json()
                        signIn({ 
                          name: data?.user?.fullName || fullName.trim(), 
                          role,
                          verificationStatus: data?.user?.verificationStatus || (pan.trim() ? 'pending' : 'not_started')
                        })
                        setSubmitStatus('Registration successful.')
                        nav(`/app/${role}`)
                      } catch (e: any) {
                        setSubmitStatus(`Connection Error: ${e.message}. Ensure backend is running on port 4000.`)
                      } finally {
                        setIsSubmitting(false)
                      }
                    }}
                  >
                    {isSubmitting ? 'Registering…' : 'Register & Continue'}
                  </Button>
                </div>
                {submitStatus && (
                  <div className={`rounded-2xl border px-4 py-3 text-sm ${
                    submitStatus.includes('successful') 
                      ? 'border-green-200 bg-green-50 text-green-700' 
                      : 'border-rose-200 bg-rose-50 text-rose-700'
                  }`}>
                    {submitStatus}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

