import { motion } from 'framer-motion'
import {
  Activity,
  ArrowUpRight,
  Bell,
  Box,
  Building2,
  CheckCircle2,
  ChevronRight,
  History,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Search,
  Users
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSession } from '../app/session'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/cn'

export function NgoDashboardPage() {
  const { session } = useSession()

  const stats = [
    { label: 'Active Requests', value: '24', icon: Bell, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Volunteers Online', value: '156', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Impact Score', value: '98/100', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ]

  const recentActivity = [
    { id: 1, type: 'Request', title: 'Food needed in Dharavi', status: 'Assigned', time: '5m ago' },
    { id: 2, type: 'Donation', title: '₹50,000 received for Medical Fund', status: 'Verified', time: '12m ago' },
    { id: 3, type: 'Alert', title: 'Heatwave warning broadcasted', status: 'Sent', time: '45m ago' },
  ]

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-indigo-900 p-8 text-white md:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-indigo-950/80 to-transparent" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                NGO Portal: <span className="text-indigo-400">{session?.name || 'NGO Partner'}</span>
              </h1>
              <p className="mt-4 text-lg text-indigo-200 font-medium">
                Real-time operation management for your humanitarian missions. Track every request, volunteer, and resource.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/app/ngo/requests">
                  <Button size="lg" className="h-12 rounded-2xl bg-indigo-500 px-8 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/20">
                    <LayoutDashboard className="mr-2 size-5" /> Live Operations
                  </Button>
                </Link>
                <Link to="/app/ngo/emergency-alerts">
                  <Button size="lg" variant="secondary" className="h-12 rounded-2xl bg-white/10 px-8 text-white backdrop-blur-md hover:bg-white/20 border-white/10">
                    <Bell className="mr-2 size-5" /> Broadcast Alert
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="hidden md:block">
            <div className="size-48 rounded-[3rem] bg-white/10 backdrop-blur-3xl border border-white/20 grid place-items-center shadow-2xl">
              <Building2 className="size-20 text-white/50" />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className={cn("grid size-12 place-items-center rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("size-6", stat.color)} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Critical Operations */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/app/ngo/inventory">
              <div className="p-6 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 hover:shadow-lg transition-all group">
                <div className="size-14 rounded-2xl bg-white grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                  <Box className="size-7 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-indigo-900">Inventory Management</h3>
                <p className="text-sm text-indigo-700 mt-2">Check stock levels for food, medicine, and rescue gear.</p>
              </div>
            </Link>
            <Link to="/app/ngo/impact-reports">
              <div className="p-6 rounded-[2.5rem] bg-emerald-50 border border-emerald-100 hover:shadow-lg transition-all group">
                <div className="size-14 rounded-2xl bg-white grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="size-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-emerald-900">Impact Reports</h3>
                <p className="text-sm text-emerald-700 mt-2">Generate real-time analytics on lives touched.</p>
              </div>
            </Link>
          </section>

          {/* Quick Find */}
          <section className="p-8 rounded-[2.5rem] border border-slate-100 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Collaboration & Resources</h2>
              <Link to="/app/ngo/nearby-ngos" className="text-sm font-bold text-indigo-600">Find Partners</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/app/ngo/nearby-ngos" className="flex-1 min-w-[200px]">
                <Button variant="secondary" className="w-full h-14 rounded-2xl bg-slate-50 text-slate-700 border-none font-bold">
                  <Search className="size-4 mr-2" /> Nearby NGOs
                </Button>
              </Link>
              <Link to="/app/ngo/blood" className="flex-1 min-w-[200px]">
                <Button variant="secondary" className="w-full h-14 rounded-2xl bg-rose-50 text-rose-700 border-none font-bold">
                  <Users className="size-4 mr-2" /> Blood Bank
                </Button>
              </Link>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-8">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <History className="size-5 text-indigo-400" /> Real-time Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {recentActivity.map((act) => (
                <div key={act.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className={cn(
                    "size-10 rounded-xl grid place-items-center",
                    act.type === 'Request' ? 'bg-rose-50 text-rose-600' :
                    act.type === 'Donation' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                  )}>
                    {act.type === 'Request' ? <Bell className="size-4" /> : 
                     act.type === 'Donation' ? <Activity className="size-4" /> : <Users className="size-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{act.title}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">{act.time}</div>
                  </div>
                  <Badge tone={act.status === 'Sent' ? 'info' : act.status === 'Verified' ? 'success' : 'warning'}>
                    {act.status}
                  </Badge>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-indigo-600 text-sm mt-4 font-bold">
                View Operational Logs <ChevronRight className="size-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-white shadow-xl">
            <h3 className="text-xl font-bold mb-4">NGO Verification</h3>
            <p className="text-indigo-100 text-sm mb-6">Your NGO is currently under review. Uploading additional documents can speed up the process.</p>
            <Link to="/app/ngo/verification">
              <Button className="w-full rounded-2xl bg-white text-indigo-600 hover:bg-indigo-50 font-bold">
                Update Documents
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
