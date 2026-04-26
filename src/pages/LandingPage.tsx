import { motion } from 'framer-motion'
import {
  BellRing,
  Brain,
  Building2,
  Globe2,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sparkles,
  Timer,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'

export function LandingPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white">
      {/* animated glow blobs */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 size-[520px] rounded-full bg-indigo-400/25 blur-3xl"
        animate={{ x: [0, 22, 0], y: [0, 12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-28 size-[520px] rounded-full bg-fuchsia-400/20 blur-3xl"
        animate={{ x: [0, -18, 0], y: [0, 14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-220px] left-1/3 size-[640px] rounded-full bg-cyan-300/15 blur-3xl"
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-indigo-600 text-white shadow-sm">
              <HeartHandshake className="size-5" />
            </div>
            <div>
              <div className="text-base font-semibold text-slate-900">VolunAI</div>
              <div className="text-sm text-slate-600">AI-powered donation and volunteer platform</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth/donor">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-indigo-600">Get Started</Button>
            </Link>
          </div>
        </header>

        <section className="mt-10 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="info">AI Matching</Badge>
              <Badge tone="warning">Emergency Alerts</Badge>
              <Badge tone="neutral">Multi-language</Badge>
              <Badge tone="neutral">Transparency</Badge>
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
              A trusted platform for{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                donations, volunteers
              </span>{' '}
              and real-time relief.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              Connect verified NGOs, donors, volunteers, corporates, and people in need—using
              geolocation, automation, and measurable impact tracking.
            </p>

            <div className="mt-10">
              <div className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Sparkles className="size-4" /> Select Your Path to Impact
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link to="/register?role=donor" className="group">
                  <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-indigo-500 hover:shadow-indigo-100 hover:-translate-y-1">
                    <div className="size-12 rounded-2xl bg-indigo-50 text-indigo-600 grid place-items-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <HeartHandshake className="size-6" />
                    </div>
                    <div className="font-bold text-slate-900">Donor</div>
                    <div className="text-sm text-slate-500 mt-1">Donate funds or essential items.</div>
                  </div>
                </Link>

                <Link to="/register?role=volunteer" className="group">
                  <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-fuchsia-500 hover:shadow-fuchsia-100 hover:-translate-y-1">
                    <div className="size-12 rounded-2xl bg-fuchsia-50 text-fuchsia-600 grid place-items-center mb-4 group-hover:bg-fuchsia-600 group-hover:text-white transition-colors">
                      <Users className="size-6" />
                    </div>
                    <div className="font-bold text-slate-900">Volunteer</div>
                    <div className="text-sm text-slate-500 mt-1">Offer skills and time on ground.</div>
                  </div>
                </Link>

                <Link to="/register?role=ngo" className="group">
                  <div className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-500 hover:shadow-emerald-100 hover:-translate-y-1">
                    <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 grid place-items-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Building2 className="size-6" />
                    </div>
                    <div className="font-bold text-slate-900">NGO Admin</div>
                    <div className="text-sm text-slate-500 mt-1">Manage campaigns & relief operations.</div>
                  </div>
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="text-sm text-slate-500 font-medium">Quick Access Login:</div>
                  <div className="flex flex-wrap gap-2">
                    <Link to="/auth/donor" className="text-sm font-bold text-slate-700 hover:text-indigo-600">Donor</Link>
                    <span className="text-slate-300">•</span>
                    <Link to="/auth/volunteer" className="text-sm font-bold text-slate-700 hover:text-indigo-600">Volunteer</Link>
                    <span className="text-slate-300">•</span>
                    <Link to="/auth/ngo" className="text-sm font-bold text-slate-700 hover:text-indigo-600">NGO</Link>
                    <span className="text-slate-300">•</span>
                    <Link to="/auth/admin" className="text-sm font-bold text-slate-900 hover:text-indigo-600 underline underline-offset-4">Admin Command</Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  title: 'Verification first',
                  desc: 'NGO & volunteer verification for trust.',
                },
                {
                  icon: MapPin,
                  title: 'Nearby response',
                  desc: 'Geo-based alerts and task assignment.',
                },
                {
                  icon: Timer,
                  title: 'Faster operations',
                  desc: 'Automation for campaigns & requests.',
                },
              ].map((x) => (
                <div
                  key={x.title}
                  className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm backdrop-blur"
                >
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <x.icon className="size-4 text-indigo-700" /> {x.title}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">{x.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
            className="grid gap-4"
          >
            <Card className="overflow-hidden bg-white/80 backdrop-blur">
              <CardHeader className="bg-white/60">
                <CardTitle>Live-ready modules</CardTitle>
                <CardDescription>
                  Designed to scale from college project → SIH demo → production.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 size-5 text-indigo-700" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Role dashboards + navigation
                    </div>
                    <div className="text-sm text-slate-600">
                      Donor, Volunteer, NGO Admin, Corporate, People in Need.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BellRing className="mt-0.5 size-5 text-indigo-700" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Emergency alerts + tracking
                    </div>
                    <div className="text-sm text-slate-600">
                      Push/SMS/WhatsApp ready (backend integration next).
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 size-5 text-indigo-700" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      Donation transparency
                    </div>
                    <div className="text-sm text-slate-600">
                      Usage tracking, receipts, impact reports.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Brain,
                  title: 'AI Smart Matching',
                  desc: 'Donor → NGO need, Volunteer → task.',
                },
                {
                  icon: Globe2,
                  title: 'Multi-language',
                  desc: 'English / Hindi / Telugu / Tamil / Kannada / Urdu.',
                },
              ].map((x) => (
                <Card key={x.title} className="bg-white/80 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <x.icon className="size-5 text-indigo-700" />
                      {x.title}
                    </CardTitle>
                    <CardDescription>{x.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mt-12 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Government-friendly trust features
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Verification, audit trail, fraud monitoring, receipts, and transparent reporting.
              </div>
            </div>
            <Link to="/register">
              <Button variant="secondary">Open registration</Button>
            </Link>
          </div>
        </motion.section>

        <footer className="mt-10 pb-6 text-xs text-slate-500">
          Built with React + Tailwind (latest). Designed for SIH / Final Year Project / NGO pilots.
        </footer>
      </div>
    </div>
  )
}

