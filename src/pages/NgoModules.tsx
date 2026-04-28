import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  Box, 
  FileText, 
  MapPin, 
  Droplets, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Search,
  Activity,
  History,
  ShieldCheck,
  Building2
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/cn'
import { useSession } from '../app/session'

// --- NGO MODULES ---

export function NgoRequestsModule() {
  const [requests, setRequests] = useState([
    { id: 1, type: 'Food', location: 'Dharavi, Mumbai', priority: 'High', status: 'Pending', time: '10 mins ago' },
    { id: 2, type: 'Medical', location: 'Koramangala, Bangalore', priority: 'Urgent', status: 'In Progress', time: '2 mins ago' },
    { id: 3, type: 'Clothes', location: 'Sector 62, Noida', priority: 'Medium', status: 'Pending', time: '1 hour ago' },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-900">Help Requests</h2>
        <Button className="rounded-2xl bg-indigo-600 text-white font-bold">New Request</Button>
      </div>
      <div className="grid gap-4">
        {requests.map(req => (
          <Card key={req.id} className="rounded-[2rem] border-slate-100 hover:shadow-lg transition-all p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "size-12 rounded-2xl grid place-items-center",
                  req.priority === 'Urgent' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
                )}>
                  <Bell className="size-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{req.type} Assistance Required</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><MapPin className="size-3" /> {req.location}</span>
                    <span className="flex items-center gap-1"><History className="size-3" /> {req.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={req.priority === 'Urgent' ? 'danger' : req.priority === 'High' ? 'warning' : 'info'}>
                  {req.priority}
                </Badge>
                <Button size="sm" variant="secondary" className="rounded-xl">Assign</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function NgoInventoryModule() {
  const inventory = [
    { id: 1, item: 'Rice Bags (25kg)', quantity: 45, unit: 'bags', status: 'In Stock' },
    { id: 2, item: 'First Aid Kits', quantity: 12, unit: 'kits', status: 'Low Stock' },
    { id: 3, item: 'Blankets', quantity: 0, unit: 'units', status: 'Out of Stock' },
    { id: 4, item: 'Water Bottles', quantity: 150, unit: 'units', status: 'In Stock' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-900">Inventory Management</h2>
        <Button className="rounded-2xl bg-indigo-600 text-white font-bold"><Plus className="size-4 mr-2" /> Add Stock</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inventory.map(item => (
          <Card key={item.id} className="rounded-[2rem] border-slate-100 p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="size-12 rounded-2xl bg-slate-50 text-slate-600 grid place-items-center">
                <Box className="size-6" />
              </div>
              <Badge tone={item.status === 'In Stock' ? 'success' : item.status === 'Low Stock' ? 'warning' : 'danger'}>
                {item.status}
              </Badge>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{item.item}</h3>
              <p className="text-3xl font-black text-slate-900 mt-1">{item.quantity} <span className="text-sm font-medium text-slate-500 uppercase">{item.unit}</span></p>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-1000",
                  item.status === 'In Stock' ? 'bg-emerald-500' : item.status === 'Low Stock' ? 'bg-amber-500' : 'bg-rose-500'
                )}
                style={{ width: `${Math.min((item.quantity / 200) * 100, 100)}%` }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function NgoImpactReportsModule() {
  const stats = [
    { label: 'Families Helped', value: '1,240', change: '+12%', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Meals Served', value: '45,800', change: '+8%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Volunteer Hours', value: '8,420', change: '+15%', icon: History, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-slate-900">Impact Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="rounded-[2rem] border-slate-100 p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className={cn("size-14 rounded-2xl grid place-items-center", stat.bg)}>
              <stat.icon className={cn("size-7", stat.color)} />
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900">{stat.value}</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
            <div className="text-xs font-black text-emerald-600">{stat.change} from last month</div>
          </Card>
        ))}
      </div>

      <Card className="rounded-[2.5rem] border-none bg-slate-900 text-white p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <FileText className="size-32" />
        </div>
        <div className="relative z-10 max-w-xl space-y-6">
          <h3 className="text-3xl font-black">Generate Annual Transparency Report</h3>
          <p className="text-slate-400">Download a detailed audit-ready PDF containing all fund utilizations, campaign impacts, and volunteer activities.</p>
          <Button className="h-14 px-10 rounded-2xl bg-white text-slate-900 font-bold hover:bg-slate-100">
            Export PDF Report <ArrowUpRight className="ml-2 size-5" />
          </Button>
        </div>
      </Card>
    </div>
  )
}

export function NgoEmergencyAlertsModule() {
  const [alerts, setAlerts] = useState([
    { id: 1, title: 'Flood Warning: North Region', time: 'Active Now', severity: 'Critical', reached: 4500 },
    { id: 2, title: 'Heat Wave Protocol', time: '2 hours ago', severity: 'High', reached: 1200 },
  ])

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-900">Emergency Alerts</h2>
        <Button className="rounded-2xl bg-rose-600 text-white font-bold">Broadcast New Alert</Button>
      </div>

      <div className="grid gap-6">
        {alerts.map(alert => (
          <Card key={alert.id} className="rounded-[2.5rem] border-rose-100 bg-rose-50/30 p-8 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="size-16 rounded-3xl bg-rose-100 text-rose-600 grid place-items-center animate-pulse">
                <AlertTriangle className="size-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{alert.title}</h3>
                <div className="flex items-center gap-4 text-sm font-bold text-rose-700 mt-1">
                  <span>{alert.time}</span>
                  <span>•</span>
                  <span>{alert.reached} users notified via SMS/Push</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" className="text-rose-600 font-bold hover:bg-rose-100">End Alert</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function NgoNearbyNgoFinderModule() {
  const ngos = [
    { name: 'Helping Hands Foundation', distance: '1.2 km', expertise: 'Medical', status: 'Online' },
    { name: 'Green Earth Trust', distance: '3.5 km', expertise: 'Environment', status: 'Away' },
    { name: 'Care & Cure', distance: '4.8 km', expertise: 'Food', status: 'Online' },
  ]

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-slate-900">Nearby NGO Network</h2>
      <div className="grid gap-4">
        {ngos.map((ngo, i) => (
          <Card key={i} className="rounded-[2rem] border-slate-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-indigo-50 text-indigo-600 grid place-items-center">
                <Building2 className="size-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{ngo.name}</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{ngo.expertise} Expert • {ngo.distance} away</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone={ngo.status === 'Online' ? 'success' : 'neutral'}>{ngo.status}</Badge>
              <Button size="sm" variant="secondary" className="rounded-xl">Collaborate</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function NgoBloodDonationModule() {
  const bloodRequests = [
    { group: 'O+', units: 2, hospital: 'City General', status: 'Urgent' },
    { group: 'A-', units: 1, hospital: 'Apollo Clinic', status: 'Pending' },
    { group: 'B+', units: 4, hospital: 'Red Cross Center', status: 'Critical' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-900">Blood Donation Requests</h2>
        <Button className="rounded-2xl bg-rose-600 text-white font-bold">Find Donors</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bloodRequests.map((req, i) => (
          <Card key={i} className="rounded-[2rem] border-rose-50 bg-rose-50/20 p-8 space-y-4 text-center">
            <div className="size-16 rounded-full bg-rose-100 text-rose-600 grid place-items-center mx-auto text-xl font-black">
              {req.group}
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-900">{req.units} Units Needed</h4>
              <p className="text-sm font-bold text-slate-500">{req.hospital}</p>
            </div>
            <Badge tone={req.status === 'Critical' ? 'danger' : 'warning'}>{req.status}</Badge>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function NgoProfileModule() {
  const { session } = useSession()
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-slate-900">NGO Profile</h2>
      <Card className="rounded-[2.5rem] border-slate-100 p-10">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="size-32 rounded-[2.5rem] bg-indigo-100 grid place-items-center text-indigo-600">
            <Building2 className="size-16" />
          </div>
          <div className="flex-1 space-y-6 w-full">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-400">NGO Name</label>
                <p className="text-lg font-bold">{session?.name || 'NGO Partner'}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-400">Registration ID</label>
                <p className="text-lg font-bold">NGO-IND-2024-X92</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-400">Verification Status</label>
                <div className="flex items-center gap-2">
                  <Badge tone="success">Fully Verified</Badge>
                  <ShieldCheck className="size-4 text-emerald-600" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-400">Tax Exemption</label>
                <p className="text-lg font-bold">80G, 12A Certified</p>
              </div>
            </div>
            <Button className="rounded-2xl">Edit Profile Details</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
