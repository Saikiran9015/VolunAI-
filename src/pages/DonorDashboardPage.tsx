import { motion } from 'framer-motion'
import {
  Wallet,
  Heart,
  Shirt,
  Droplets,
  ShieldCheck,
  History,
  TrendingUp,
  Award,
  ChevronRight,
  Plus
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../app/session'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { cn } from '../lib/cn'

const urgentCauses = [
  {
    id: 1,
    title: 'Disaster Relief: Kerala Floods',
    raised: '₹8.5L',
    goal: '₹10L',
    progress: 85,
    tag: 'Emergency',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Medical Help: Heart Surgery',
    raised: '₹1.2L',
    goal: '₹3L',
    progress: 40,
    tag: 'Medical',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=400&auto=format&fit=crop'
  }
]

export function DonorDashboardPage() {
  const { session } = useSession()
  const [walletBalance, setWalletBalance] = useState(0)
  const [activity, setActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const totalDonated = activity
    .filter(act => act.type === 'cash')
    .reduce((acc, act) => acc + (Number(act.amount) || 0), 0)
    
  const causesHelped = new Set(activity.map(act => act.to)).size
  const impactScore = totalDonated / 10

  const stats = [
    { label: 'Total Donated', value: `₹${totalDonated.toLocaleString()}`, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Causes Helped', value: causesHelped.toString(), icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Impact Score', value: Math.floor(impactScore).toString(), icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bRes = await fetch('http://localhost:4999/api/donor/wallet')
        const bData = await bRes.json()
        setWalletBalance(bData.balance)

        const hRes = await fetch('http://localhost:4999/api/donor/history')
        const hData = await hRes.json()
        setActivity(hData.donations || [])
      } catch (err) {
        console.error('Dashboard Fetch Error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-indigo-900 p-8 text-white md:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-indigo-950/80 to-transparent" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Hello, <span className="text-indigo-400">{session?.name?.split(' ')[0] || 'Donor'}!</span>
              </h1>
              <p className="mt-4 text-lg text-indigo-200">
                Your generosity is driving real change. Every contribution helps build a better world.
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/app/donor/fund-causes">
                  <Button size="lg" className="h-12 rounded-2xl bg-indigo-500 px-8 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/20">
                    <Heart className="mr-2 size-5" /> Start Donating
                  </Button>
                </Link>
                <Link to="/app/donor/wallet">
                  <Button size="lg" variant="secondary" className="h-12 rounded-2xl bg-white/10 px-8 text-white backdrop-blur-md hover:bg-white/20 border-white/10">
                    <Wallet className="mr-2 size-5" /> Add Funds
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full md:w-80 rounded-[3rem] bg-white/10 backdrop-blur-2xl border border-white/20 p-8 shadow-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-indigo-200 text-sm font-black uppercase tracking-widest">Wallet Balance</div>
              <div className="size-10 rounded-2xl bg-indigo-500/20 grid place-items-center">
                <Wallet className="size-5 text-indigo-400" />
              </div>
            </div>
            <div className="text-4xl font-black text-white mb-8 tracking-tighter">₹{walletBalance.toLocaleString()}</div>
            <Link to="/app/donor/wallet">
              <Button className="w-full h-12 rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 font-black shadow-lg">
                <Plus className="size-4 mr-2" /> Top-up Wallet
              </Button>
            </Link>
          </motion.div>
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
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Featured Causes */}
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Urgent Causes</h2>
              <Link to="/app/donor/fund-causes" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center">
                View All <ChevronRight className="size-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {urgentCauses.map((cause, i) => (
                <motion.div
                  key={cause.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="group overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={cause.image} alt={cause.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute left-4 top-4 rounded-full bg-rose-500 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                      {cause.tag}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900">{cause.title}</h3>
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>{cause.raised} raised</span>
                        <span>{cause.progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${cause.progress}%` }}
                          className="h-full bg-indigo-500" 
                        />
                      </div>
                    </div>
                    <Button className="mt-6 w-full rounded-2xl bg-indigo-500 py-6 text-white hover:bg-indigo-600">
                      Donate Now
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/app/donor/donate-clothes">
              <div className="p-6 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 hover:shadow-lg transition-all group">
                <div className="size-14 rounded-2xl bg-white grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                  <Shirt className="size-7 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-indigo-900">Donate Clothes</h3>
                <p className="text-sm text-indigo-700 mt-2">Request pickup for blankets, shoes, and essentials.</p>
              </div>
            </Link>
            <Link to="/app/donor/blood">
              <div className="p-6 rounded-[2.5rem] bg-rose-50 border border-rose-100 hover:shadow-lg transition-all group">
                <div className="size-14 rounded-2xl bg-white grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                  <Droplets className="size-7 text-rose-600" />
                </div>
                <h3 className="text-lg font-bold text-rose-900">Blood Donation</h3>
                <p className="text-sm text-rose-700 mt-2">Register as a donor or find emergency requests.</p>
              </div>
            </Link>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Recent Activity */}
          <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-8">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <History className="size-5 text-indigo-400" /> My Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {activity.length > 0 ? (
                activity.slice(0, 4).map((act) => (
                  <div key={act.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className={cn(
                      "size-10 rounded-xl grid place-items-center",
                      act.type === 'cash' ? 'bg-emerald-50 text-emerald-600' :
                      act.type === 'clothes' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
                    )}>
                      {act.type === 'cash' ? <Heart className="size-5" /> : 
                       act.type === 'clothes' ? <Shirt className="size-5" /> : <Droplets className="size-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{act.to}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{act.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900">
                        {typeof act.amount === 'number' ? `₹${act.amount}` : act.amount}
                      </div>
                      <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-tight">{act.status}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm font-medium">No recent activity</div>
              )}
              <Link to="/app/donor/my-donations">
                <Button variant="ghost" className="w-full text-indigo-600 text-sm mt-4 font-bold">
                  View All History <ChevronRight className="size-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* KYC Status */}
          <div className="p-8 rounded-[2.5rem] bg-indigo-600 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <ShieldCheck className="size-32" />
            </div>
            <h3 className="text-xl font-bold mb-2">KYC Verification</h3>
            <p className="text-indigo-100 text-sm mb-6">Verify your identity to get tax exemption certificates and higher donation limits.</p>
            <Link to="/app/donor/kyc">
              <Button className="w-full rounded-2xl bg-white text-indigo-600 hover:bg-indigo-50 font-bold">
                {session?.verificationStatus === 'verified' ? 'View Status' : 'Verify Now'}
              </Button>
            </Link>
          </div>

          {/* Help Center */}
          <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Need Assistance?</h3>
            <p className="text-sm text-slate-600 mt-2">Our support team is available 24/7 for any donation-related queries.</p>
            <Button variant="ghost" className="w-full mt-6 text-slate-600 border border-slate-200 rounded-2xl bg-white hover:bg-slate-50">
              Contact Support
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
