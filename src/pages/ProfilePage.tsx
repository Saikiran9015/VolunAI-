
import { 
  User as UserIcon, 
  ShieldCheck, 
  Settings, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3,
  BadgeCheck,
  Clock
} from 'lucide-react'
import { useSession } from '../app/session'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Link } from 'react-router-dom'

export function ProfilePage() {
  const { session } = useSession()
  const role = session?.role || 'donor'

  return (
    <div className="grid gap-6">
      <Card className="overflow-hidden border-none shadow-sm bg-white">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-fuchsia-600" />
        <CardContent className="relative pt-12 pb-6 px-8">
          <div className="absolute -top-12 left-8 p-1 bg-white rounded-3xl shadow-lg">
            <div className="size-24 rounded-2xl bg-slate-100 grid place-items-center text-slate-400">
              <UserIcon className="size-12" />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                {session?.name || 'User Name'}
                {session?.verificationStatus === 'verified' && (
                  <BadgeCheck className="size-6 text-green-600" />
                )}
              </h1>
              <div className="flex items-center gap-3 mt-1 text-slate-600">
                <Badge tone="info" className="uppercase text-[10px]">{role}</Badge>
                <span className="text-sm">• Registered since April 2026</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                <Edit3 className="size-4 mr-2" /> Edit Profile
              </Button>
              <Button size="sm">
                <Settings className="size-4 mr-2" /> Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-slate-700">
                <Mail className="size-4 text-slate-400" />
                <span className="text-sm">{(session as any)?.email || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <Phone className="size-4 text-slate-400" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <MapPin className="size-4 text-slate-400" />
                <span className="text-sm">Telangana, India</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Verification Status</CardTitle>
                <p className="text-sm text-slate-500">Keep your profile trusted and verified.</p>
              </div>
              <Badge tone={session?.verificationStatus === 'verified' ? 'success' : 'warning'}>
                {session?.verificationStatus === 'verified' ? 'Verified' : 'Pending Verification'}
              </Badge>
            </CardHeader>
            <CardContent>
              {session?.verificationStatus === 'verified' ? (
                <div className="rounded-2xl bg-green-50 border border-green-100 p-4 flex items-start gap-4">
                  <div className="p-2 bg-green-100 rounded-xl text-green-600">
                    <ShieldCheck className="size-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-green-900">All set! You are verified.</div>
                    <div className="text-sm text-green-700 mt-1">Your trust score is high. You can now access all restricted features and manage high-value relief operations.</div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 flex items-start gap-4">
                  <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                    <Clock className="size-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-amber-900">Identity Verification Required</div>
                    <div className="text-sm text-amber-700 mt-1">Please complete your KYC to unlock full platform capabilities, including tax receipts and emergency broadcasts.</div>
                    <Link to={`/app/${role}/kyc`} className="inline-block mt-3">
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                        Complete Verification Now
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                  <div className="text-xs font-bold text-slate-500 uppercase">KYC Tier</div>
                  <div className="mt-1 font-semibold text-slate-900">Standard Verification</div>
                </div>
                <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                  <div className="text-xs font-bold text-slate-500 uppercase">Trust Level</div>
                  <div className="mt-1 font-semibold text-slate-900">Level 2 (Active)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
