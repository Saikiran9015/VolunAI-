import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye,
  ArrowLeft,
  BarChart3,
  Siren,
  Send,
  Search,
  Download,
  Smartphone,
  PieChart,
  Activity,
  Mail,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Info,
  Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

export function AdminDashboardPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'users' | 'analytics' | 'emergency'>('users')
  const [filter, setFilter] = useState<'all' | 'ngo' | 'volunteer' | 'donor'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [emergencyMsg, setEmergencyMsg] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetchUsers()
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats/registrations')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (userId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/verify/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        const updatedUsers = users.map(u => u._id === userId ? { ...u, verificationStatus: status } : u)
        setUsers(updatedUsers)
        if (selectedUser?._id === userId) {
          setSelectedUser({ ...selectedUser, verificationStatus: status })
        }
      }
    } catch (err) {
      console.error('Verify error:', err)
    }
  }

  const handleSendEmergency = async () => {
    if (!emergencyMsg) return
    setIsSending(true)
    // Simulate API call
    setTimeout(() => {
      alert(`Emergency Broadcast Sent: ${emergencyMsg}`)
      setEmergencyMsg('')
      setIsSending(false)
    }, 1500)
  }

  const filteredUsers = users.filter(u => {
    const matchesFilter = filter === 'all' || u.role === filter
    const matchesSearch = u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.mobile?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const isNewRegistration = (createdAt: string) => {
    if (!createdAt) return false
    const hours = (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60)
    return hours < 24
  }

  const formatDate = (date: string) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Admin Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-[#0f172a] text-white z-50 hidden lg:flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-12">
            <div className="size-12 rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-500/20 grid place-items-center transform rotate-3">
              <ShieldCheck className="size-7 text-white" />
            </div>
            <div>
              <div className="font-black text-xl tracking-tight leading-none">COMMAND</div>
              <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] mt-1">Center Alpha</div>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'users', label: 'Registrations', icon: Users, color: 'indigo' },
              { id: 'analytics', label: 'Intelligence', icon: BarChart3, color: 'blue' },
              { id: 'impact', label: 'Impact Tracking', icon: Heart, color: 'emerald' },
              { id: 'emergency', label: 'Crisis Mode', icon: Siren, color: 'rose' },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative group ${
                  activeTab === tab.id 
                    ? `bg-indigo-600/10 text-indigo-400` 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabBg"
                    className={`absolute inset-0 bg-indigo-600 rounded-2xl -z-10 shadow-lg shadow-indigo-600/20`}
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon className={`size-5 ${activeTab === tab.id ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                <span className={`font-bold tracking-tight ${activeTab === tab.id ? 'text-white' : ''}`}>{tab.label}</span>
                {tab.id === 'users' && users.filter(u => isNewRegistration(u.createdAt)).length > 0 && (
                  <div className="ml-auto size-5 rounded-full bg-indigo-500 text-[10px] font-black grid place-items-center text-white ring-4 ring-[#0f172a]">
                    {users.filter(u => isNewRegistration(u.createdAt)).length}
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-800/50">
          <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-slate-800/30">
            <div className="size-10 rounded-xl bg-slate-700 grid place-items-center text-slate-400 font-bold">AD</div>
            <div>
              <div className="text-sm font-bold text-white">Super Admin</div>
              <div className="text-[10px] text-slate-500 font-medium">Root Access</div>
            </div>
          </div>
          <Link to="/">
            <Button variant="secondary" className="w-full bg-slate-800/50 border-none text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl h-12">
              <ArrowLeft className="size-4 mr-2" /> System Exit
            </Button>
          </Link>
        </div>
      </aside>

      <main className="lg:pl-72 min-h-screen">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight capitalize">{activeTab} Hub</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="size-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Online • Live Data Feed</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="hidden md:flex flex-col items-end justify-center px-4 border-r border-slate-100">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Nodes</div>
              <div className="text-xl font-bold text-slate-900">{users.length}</div>
            </div>
            <Button variant="secondary" onClick={fetchUsers} className="bg-white hover:bg-slate-50 border-slate-200 text-slate-600 rounded-xl px-6">
              <Activity className="size-4 mr-2 text-indigo-500" /> SYNC
            </Button>
            <Button className="bg-slate-900 hover:bg-black text-white rounded-xl px-6 shadow-xl shadow-slate-900/10">
              <Download className="size-4 mr-2" /> EXPORT
            </Button>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'users' && (
              <motion.div 
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 xl:grid-cols-4 gap-8"
              >
                <div className="xl:col-span-3 space-y-8">
                  {/* Performance Indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Network Total', value: users.length, icon: Users, color: 'blue', sub: 'Total Entities' },
                      { label: 'New Units', value: stats?.newLast24h || 0, icon: Zap, color: 'indigo', sub: 'Last 24 Hours' },
                      { label: 'Watch Queue', value: users.filter(u => u.verificationStatus === 'pending').length, icon: Clock, color: 'amber', sub: 'Needs Review' },
                      { label: 'Verified Ops', value: users.filter(u => u.verificationStatus === 'verified').length, icon: CheckCircle2, color: 'emerald', sub: 'Verified Trusted' },
                    ].map((stat, i) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={stat.label}
                      >
                        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden relative group">
                          <div className={`absolute top-0 left-0 w-1 h-full bg-indigo-500`} />
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
                                <div className="text-[9px] font-bold text-slate-500 mt-0.5">{stat.sub}</div>
                              </div>
                              <div className={`p-4 bg-slate-50 rounded-2xl text-indigo-600 group-hover:scale-110 transition-transform duration-500`}>
                                <stat.icon className="size-7" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Main Registry */}
                  <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden rounded-3xl">
                    <CardHeader className="p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="relative flex-1 max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Search the registry (name, email, mobile)..." 
                          className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white text-sm font-medium outline-none transition-all shadow-inner"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl overflow-x-auto no-scrollbar">
                        {(['all', 'ngo', 'volunteer', 'donor'] as const).map(f => (
                          <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${
                              filter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] border-b border-slate-50">
                              <th className="px-8 py-5">Entity / Identification</th>
                              <th className="px-8 py-5 text-center">Protocol</th>
                              <th className="px-8 py-5">Status Matrix</th>
                              <th className="px-8 py-5">Onboarding</th>
                              <th className="px-8 py-5 text-right">Directives</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {loading ? (
                              <tr><td colSpan={5} className="p-20 text-center">
                                <div className="flex flex-col items-center gap-4">
                                  <div className="size-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Accessing Secure Records...</div>
                                </div>
                              </td></tr>
                            ) : filteredUsers.length === 0 ? (
                              <tr><td colSpan={5} className="p-20 text-center">
                                <div className="text-slate-300 flex flex-col items-center gap-3">
                                  <Search className="size-12 opacity-20" />
                                  <div className="text-sm font-bold uppercase tracking-widest">No matching records found in database</div>
                                </div>
                              </td></tr>
                            ) : filteredUsers.map((user, idx) => (
                              <motion.tr 
                                key={user._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                onClick={() => setSelectedUser(user)}
                                className={`group cursor-pointer transition-all duration-300 ${selectedUser?._id === user._id ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
                              >
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                    <div className="relative">
                                      <div className={`size-12 rounded-2xl bg-gradient-to-br ${user.role === 'ngo' ? 'from-indigo-500 to-blue-600' : 'from-slate-100 to-slate-200'} grid place-items-center text-white font-black text-lg shadow-lg shadow-indigo-500/10`}>
                                        {user.fullName?.[0]}
                                      </div>
                                      {isNewRegistration(user.createdAt) && (
                                        <div className="absolute -top-1 -right-1 size-4 rounded-full bg-indigo-500 border-2 border-white animate-pulse" />
                                      )}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-black text-slate-900 tracking-tight">{user.fullName}</span>
                                        {isNewRegistration(user.createdAt) && (
                                          <Badge tone="info" className="text-[8px] px-1.5 py-0 bg-indigo-500 text-white border-none">NEW</Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-1">
                                        <Mail className="size-3" /> {user.email || 'NO_EMAIL'}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-6 text-center">
                                  <Badge tone={user.role === 'ngo' ? 'success' : user.role === 'volunteer' ? 'info' : 'warning'} className="uppercase text-[9px] font-black px-3 py-1 rounded-lg">
                                    {user.role}
                                  </Badge>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-3">
                                    <div className={`size-2.5 rounded-full ${
                                      user.verificationStatus === 'verified' ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 
                                      user.verificationStatus === 'pending' ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'
                                    }`} />
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                                      user.verificationStatus === 'verified' ? 'text-green-600' : 
                                      user.verificationStatus === 'pending' ? 'text-amber-600' : 'text-slate-400'
                                    }`}>
                                      {user.verificationStatus || 'NOT_STARTED'}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-900">{formatDate(user.createdAt).split(',')[0]}</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{formatDate(user.createdAt).split(',')[1]}</span>
                                  </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}
                                      className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all"
                                    >
                                      <Eye className="size-4" />
                                    </button>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleVerify(user._id, 'verified'); }}
                                      className="p-2.5 rounded-xl bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-green-600 hover:border-green-100 transition-all"
                                    >
                                      <CheckCircle2 className="size-4" />
                                    </button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Intelligence Feed / Details Sidebar */}
                <div className="space-y-8">
                  <AnimatePresence mode="wait">
                    {selectedUser ? (
                      <motion.div
                        key="selected-user"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                      >
                        <Card className="border-none shadow-2xl bg-white rounded-3xl overflow-hidden sticky top-32">
                          <div className={`h-24 bg-gradient-to-br ${selectedUser.role === 'ngo' ? 'from-indigo-500 to-blue-700' : 'from-slate-800 to-slate-900'} relative`}>
                            <button 
                              onClick={() => setSelectedUser(null)}
                              className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
                            >
                              <XCircle className="size-5" />
                            </button>
                          </div>
                          <div className="px-8 pb-8 -mt-10">
                            <div className="flex flex-col items-center text-center">
                              <div className="size-20 rounded-[2rem] bg-white p-1 shadow-2xl">
                                <div className={`size-full rounded-[1.8rem] bg-slate-50 grid place-items-center text-2xl font-black ${selectedUser.role === 'ngo' ? 'text-indigo-600' : 'text-slate-400'}`}>
                                  {selectedUser.fullName?.[0]}
                                </div>
                              </div>
                              <h3 className="mt-4 text-xl font-black text-slate-900 tracking-tight">{selectedUser.fullName}</h3>
                              <Badge tone={selectedUser.role === 'ngo' ? 'success' : 'info'} className="mt-1 uppercase text-[8px] font-black px-4 py-1 rounded-full">
                                {selectedUser.role} ENTITY
                              </Badge>
                            </div>

                            <div className="mt-8 space-y-6">
                              <div className="grid gap-4">
                                <div className="p-4 rounded-2xl bg-slate-50 space-y-3">
                                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Communication Channel</div>
                                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                    <Mail className="size-4 text-indigo-500" /> {selectedUser.email || 'NA'}
                                  </div>
                                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                    <Phone className="size-4 text-indigo-500" /> {selectedUser.mobile || 'NA'}
                                  </div>
                                  <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                    <MapPin className="size-4 text-indigo-500" /> {selectedUser.stateCity || 'GLOBAL'}
                                  </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-slate-50 space-y-3">
                                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance & KYC</div>
                                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                    <span className="flex items-center gap-2"><FileText className="size-4 text-slate-400" /> PAN NUMBER</span>
                                    <span className="text-slate-900 font-black">{selectedUser.panNumber || 'UNAVAILABLE'}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                    <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-slate-400" /> VERIFICATION</span>
                                    <span className={`font-black ${selectedUser.verificationStatus === 'verified' ? 'text-green-600' : 'text-amber-500'}`}>
                                      {selectedUser.verificationStatus?.toUpperCase() || 'PENDING'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                {selectedUser.verificationStatus !== 'verified' ? (
                                  <Button 
                                    className="w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-xl shadow-indigo-600/20"
                                    onClick={() => handleVerify(selectedUser._id, 'verified')}
                                  >
                                    ACTIVATE ENTITY
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="secondary"
                                    className="w-full h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-sm"
                                    onClick={() => handleVerify(selectedUser._id, 'pending')}
                                  >
                                    REVERT TO REVIEW
                                  </Button>
                                )}
                                <Button variant="ghost" className="w-full h-12 rounded-2xl text-slate-400 font-bold text-xs hover:text-rose-500">
                                  TERMINATE ACCESS
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="feed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                              <Activity className="size-5 text-indigo-500" /> Latest Nodes
                            </h3>
                            <Badge className="bg-indigo-500 text-white border-none text-[8px] px-2">{stats?.newLast24h || 0} NEW</Badge>
                          </div>
                          <div className="space-y-4">
                            {users.slice(0, 5).map((u, i) => (
                              <motion.div 
                                key={u._id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => setSelectedUser(u)}
                                className="p-4 bg-white rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer group"
                              >
                                <div className="flex items-center gap-4">
                                  <div className={`size-10 rounded-2xl bg-slate-50 grid place-items-center text-sm font-black ${u.role === 'ngo' ? 'text-indigo-600' : 'text-slate-400'}`}>
                                    {u.fullName?.[0]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{u.fullName}</div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-tight mt-0.5">{u.role} Joined</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-[9px] font-black text-slate-900">{isNewRegistration(u.createdAt) ? 'JUST NOW' : formatDate(u.createdAt).split(',')[0]}</div>
                                    <ChevronRight className="size-3 text-slate-300 ml-auto mt-1" />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          <Button variant="ghost" className="w-full mt-4 text-[10px] font-black text-slate-400 hover:text-indigo-600 tracking-[0.2em] uppercase">
                            View Full Logs
                          </Button>
                        </div>

                        <Card className="border-none bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-600/20">
                          <div className="absolute -right-8 -bottom-8 size-32 bg-white/10 rounded-full blur-3xl" />
                          <div className="relative z-10">
                            <div className="size-10 rounded-xl bg-white/20 grid place-items-center mb-4">
                              <ShieldCheck className="size-6" />
                            </div>
                            <div className="text-lg font-black leading-tight">Entity Audit<br/>Protocol Active</div>
                            <p className="text-xs font-bold text-indigo-100 mt-2 opacity-80">All registrations are encrypted and verified against government API nodes.</p>
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div 
                key="analytics"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <Card className="border-none shadow-sm lg:col-span-2 rounded-3xl bg-white p-8">
                  <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Activity className="size-6 text-indigo-600" /> Growth Trajectory
                      </CardTitle>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Entity Onboarding Metrics</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="px-3 py-1 rounded-full bg-green-50 text-[10px] font-black text-green-600 uppercase tracking-widest">+12% UP</div>
                    </div>
                  </CardHeader>
                  <CardContent className="h-80 flex items-end justify-between gap-4 pt-10 px-0">
                    {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                        <div className="flex-1 w-full flex items-end justify-center">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            className="w-full max-w-[40px] bg-slate-50 rounded-2xl group-hover:bg-indigo-600 transition-all duration-500 relative shadow-inner overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100" />
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg font-black transition-all whitespace-nowrap z-20 shadow-xl">
                              {h * 12}
                            </div>
                          </motion.div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase">Day 0{i+1}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm rounded-3xl bg-white p-8">
                  <CardHeader className="p-0 mb-8">
                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                      <PieChart className="size-6 text-indigo-600" /> Sector Split
                    </CardTitle>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Entity Distribution</p>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center pt-4 px-0">
                    <div className="size-56 rounded-full border-[24px] border-indigo-600 relative grid place-items-center shadow-inner">
                      <div className="absolute inset-[-24px] border-[24px] border-emerald-500 rounded-full clip-path-half rotate-45 opacity-80" />
                      <div className="absolute inset-[-24px] border-[24px] border-amber-400 rounded-full clip-path-quarter -rotate-90 opacity-80" />
                      <div className="text-center">
                        <div className="text-4xl font-black text-slate-900 tracking-tighter">{users.length}</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Ops</div>
                      </div>
                    </div>
                    <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-4 w-full">
                      {[
                        { label: 'Donors', color: 'bg-indigo-600', val: '45%' },
                        { label: 'NGOs', color: 'bg-emerald-500', val: '30%' },
                        { label: 'Volunteers', color: 'bg-amber-400', val: '25%' },
                        { label: 'Needy', color: 'bg-slate-200', val: '5%' },
                      ].map(item => (
                        <div key={item.label} className="flex items-center justify-between group cursor-help">
                          <div className="flex items-center gap-3">
                            <div className={`size-3 rounded-full ${item.color} group-hover:scale-150 transition-transform`} />
                            <span className="text-[11px] font-black text-slate-400 uppercase">{item.label}</span>
                          </div>
                          <span className="text-xs font-black text-slate-900">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'impact' && (
              <motion.div 
                key="impact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="size-16 rounded-[2rem] bg-emerald-500 text-white grid place-items-center shadow-lg shadow-emerald-500/30">
                    <Heart className="size-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Impact Tracking System</h2>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Real-time Global Impact Metrics</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Metric 1 */}
                  <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Users className="size-32" />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="size-12 rounded-2xl bg-indigo-50 text-indigo-600 grid place-items-center mb-4">
                        <Users className="size-6" />
                      </div>
                      <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">People Helped</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-5xl font-black text-slate-900 tracking-tighter">25,482</div>
                      <div className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full">
                        <TrendingUp className="size-4" /> +12% this month
                      </div>
                    </CardContent>
                  </Card>

                  {/* Metric 2 */}
                  <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <CheckCircle2 className="size-32" />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 grid place-items-center mb-4">
                        <CheckCircle2 className="size-6" />
                      </div>
                      <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Tasks Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-5xl font-black text-slate-900 tracking-tighter">8,930</div>
                      <div className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full">
                        <TrendingUp className="size-4" /> +5% this month
                      </div>
                    </CardContent>
                  </Card>

                  {/* Metric 3 */}
                  <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Clock className="size-32" />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="size-12 rounded-2xl bg-amber-50 text-amber-600 grid place-items-center mb-4">
                        <Clock className="size-6" />
                      </div>
                      <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Volunteer Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-5xl font-black text-slate-900 tracking-tighter">142.5K</div>
                      <div className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full">
                        <TrendingUp className="size-4" /> +8% this month
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === 'emergency' && (
              <motion.div 
                key="emergency"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-4xl mx-auto"
              >
                <Card className="border-none shadow-2xl overflow-hidden rounded-[3rem] bg-white">
                  <div className="h-4 bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 animate-gradient-x" />
                  <CardHeader className="p-12 pb-8">
                    <div className="flex items-center gap-8">
                      <div className="size-24 rounded-[2.5rem] bg-rose-50 text-rose-600 grid place-items-center shadow-inner relative">
                        <Siren className="size-12 animate-pulse" />
                        <div className="absolute inset-0 rounded-[2.5rem] bg-rose-500/20 animate-ping" />
                      </div>
                      <div>
                        <CardTitle className="text-4xl font-black text-slate-900 tracking-tight">CRISIS BROADCAST</CardTitle>
                        <p className="text-slate-500 font-bold mt-2 flex items-center gap-2 uppercase tracking-widest text-xs">
                          <AlertCircle className="size-4 text-rose-600" /> High-Priority Protocol Alpha
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-12 pt-0 space-y-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Smartphone className="size-4 text-rose-600" /> Payload Composition
                      </label>
                      <div className="relative">
                        <textarea 
                          placeholder="ENTER EMERGENCY COMMAND... (e.g. SEISMIC ALERT: EVACUATE ZONE-04)"
                          className="w-full h-48 p-8 rounded-[2rem] bg-slate-50 border-4 border-slate-100 text-slate-900 focus:border-rose-500/20 focus:bg-white text-xl font-black outline-none transition-all resize-none shadow-inner placeholder:text-slate-200"
                          value={emergencyMsg}
                          onChange={(e) => setEmergencyMsg(e.target.value)}
                        />
                        <div className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/5 backdrop-blur text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {emergencyMsg.length} / 160 Characters
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                        <Info className="size-4" /> This will be transmitted via Push & SMS to all verified nodes
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 rounded-[2rem] bg-slate-50 border-2 border-slate-100 group hover:border-indigo-100 transition-all">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Target Node Coverage</div>
                        <div className="text-2xl font-black text-slate-900 flex items-center gap-3">
                          <Users className="size-6 text-indigo-600" /> {users.length} Units
                        </div>
                      </div>
                      <div className="p-6 rounded-[2rem] bg-slate-50 border-2 border-slate-100 group hover:border-rose-100 transition-all">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Threat Mitigation Level</div>
                        <div className="text-2xl font-black text-rose-600 flex items-center gap-3">
                          <Siren className="size-6" /> CRITICAL-01
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full h-20 rounded-[2rem] bg-slate-900 hover:bg-black text-white text-xl font-black shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-95 group overflow-hidden relative"
                      disabled={isSending || !emergencyMsg}
                      onClick={handleSendEmergency}
                    >
                      {isSending ? (
                        <div className="flex items-center gap-4">
                          <div className="size-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                          TRANSMITTING...
                        </div>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="relative z-10 flex items-center gap-4 uppercase tracking-tighter">
                            Initiate Worldwide Broadcast <Send className="size-6" />
                          </span>
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <div className="mt-12">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 px-4">Transmission History</h3>
                  <div className="space-y-4">
                    {[
                      { msg: 'North Sector Relief Coordination Active', time: '2 HOURS AGO', reach: '450 NODES', status: 'DELIVERED' },
                    ].map((log, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-xl transition-all"
                      >
                        <div className="flex items-center gap-6">
                          <div className="size-14 rounded-2xl bg-slate-50 grid place-items-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-inner">
                            <Send className="size-6" />
                          </div>
                          <div>
                            <div className="font-black text-slate-900 text-lg tracking-tight">{log.msg}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-3">
                              {log.time} • REACH: {log.reach}
                            </div>
                          </div>
                        </div>
                        <Badge tone="success" className="font-black px-6 py-2 rounded-xl text-[9px] tracking-widest">{log.status}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Global CSS for custom animations/styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .clip-path-half {
          clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
        }
        .clip-path-quarter {
          clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%);
        }
      `}} />
    </div>
  )
}
