import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  History, 
  Heart, 
  TrendingUp, 
  Target, 
  Clock, 
  ChevronRight,
  Shirt,
  MapPin,
  Calendar,
  Package,
  Droplets,
  Search,
  Bell,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Lock,
  User,
  LogOut,
  Settings as SettingsIcon,
  HelpCircle,
  FileText
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/cn'
import { useSession } from '../app/session'

// --- MOCK DATA ---
const causes = [
  {
    id: 1,
    title: "Education for All",
    description: "Support underprivileged children with school supplies and tuition.",
    raised: 45000,
    goal: 100000,
    category: "Education",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop",
    donors: 124
  },
  {
    id: 2,
    title: "Medical Relief Fund",
    description: "Emergency medical assistance for families in distress.",
    raised: 78000,
    goal: 150000,
    category: "Medical",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=500&auto=format&fit=crop",
    donors: 89
  },
  {
    id: 3,
    title: "Clean Water Project",
    description: "Installing water filtration systems in rural communities.",
    raised: 25000,
    goal: 50000,
    category: "Environment",
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=500&auto=format&fit=crop",
    donors: 56
  }
]

const donationHistory = [
  { id: 1, type: 'cash', amount: 500, to: 'Education for All', date: '2024-04-25', status: 'Success' },
  { id: 2, type: 'clothes', amount: '12 Items', to: 'Winter Warmth Drive', date: '2024-04-20', status: 'Picked Up' },
  { id: 3, type: 'blood', amount: '1 Unit', to: 'City Blood Bank', date: '2024-04-15', status: 'Completed' },
  { id: 4, type: 'cash', amount: 1200, to: 'Medical Relief Fund', date: '2024-04-10', status: 'Success' },
]

// --- API CONFIG ---
const API_BASE = 'http://localhost:4999/api/donor'

// --- RAZORPAY HELPER ---
const loadRazorpay = (amount: number, onSuccess: (response: any) => void) => {
  const options = {
    key: "rzp_test_YourKeyHere", // Replace with your key
    amount: amount * 100, // amount in the smallest currency unit
    currency: "INR",
    name: "VolunAI",
    description: "Donation Payment",
    image: "https://example.com/your_logo",
    handler: function (response: any) {
      onSuccess(response);
    },
    prefill: {
      name: "Donor Name",
      email: "donor@example.com",
      contact: "9999999999"
    },
    notes: {
      address: "VolunAI Office"
    },
    theme: {
      color: "#4F46E5"
    }
  };

  if (!(window as any).Razorpay) {
    alert("Razorpay SDK not loaded. Please check your internet connection.")
    return
  }

  const rzp1 = new (window as any).Razorpay(options);
  rzp1.open();
}

// --- COMPONENTS ---

export function WalletModule() {
  const [balance, setBalance] = useState(0)
  const [history, setHistory] = useState<any[]>([])
  const [topupAmount, setTopupAmount] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const bRes = await fetch(`${API_BASE}/wallet`)
      const bData = await bRes.json()
      setBalance(bData.balance)

      const hRes = await fetch(`${API_BASE}/history`)
      const hData = await hRes.json()
      setHistory(hData.donations || [])
    } catch (err) {
      console.error('Error fetching wallet data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleTopup = () => {
    const amount = Number(topupAmount)
    if (!amount || amount <= 0) return

    loadRazorpay(amount, async (response) => {
      try {
        const res = await fetch(`${API_BASE}/wallet/topup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, razorpay_payment_id: response.razorpay_payment_id })
        })
        const data = await res.json()
        setBalance(data.balance)
        setTopupAmount('')
        fetchData()
        alert('Wallet topped up successfully!')
      } catch (err) {
        alert('Failed to update wallet on server.')
      }
    })
  }

  const totalDonated = history
    .filter(d => d.type === 'cash')
    .reduce((acc, d) => acc + (Number(d.amount) || 0), 0)
    
  const goalAmount = 50000
  const progressPercent = Math.min(Math.round((totalDonated / goalAmount) * 100), 100)

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="h-64 rounded-[2rem] bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 font-bold">
          Loading Wallet...
        </div>
      ) : (
        <section className="relative overflow-hidden rounded-[2rem] bg-indigo-600 p-8 text-white shadow-2xl">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 size-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <p className="text-indigo-100 font-black uppercase tracking-widest text-xs">Available Balance</p>
              <h2 className="text-6xl font-black tracking-tighter">₹{balance.toLocaleString()}</h2>
            </div>
            <div className="flex flex-col gap-3 min-w-[240px]">
              <div className="relative group">
                <input 
                  type="number" 
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full h-14 bg-white/10 border border-white/20 rounded-2xl px-5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-md font-bold"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-bold">INR</span>
              </div>
              <Button 
                onClick={handleTopup}
                className="h-14 bg-white text-indigo-600 hover:bg-indigo-50 font-black rounded-2xl shadow-lg transition-transform active:scale-95"
              >
                <Plus className="size-5 mr-2" /> Top-up Wallet
              </Button>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
          <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
            <CardTitle className="text-lg font-black flex items-center gap-2">
              <History className="size-5 text-indigo-600" /> Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {history.length > 0 ? (
                history.slice(0, 5).map((don, i) => (
                  <div key={don.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "size-10 rounded-xl grid place-items-center",
                        don.type === 'cash' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                      )}>
                        {don.type === 'cash' ? <ArrowUpRight className="size-5" /> : <Plus className="size-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{don.to || 'Wallet Top-up'}</p>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{don.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn("font-black text-sm", don.type === 'cash' ? 'text-slate-900' : 'text-emerald-600')}>
                        {don.type === 'cash' ? `-₹${don.amount}` : `+₹${don.amount}`}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase">{don.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-slate-400 font-bold text-sm">No transactions yet</div>
              )}
            </div>
            <Link to="/app/donor/my-donations">
              <Button variant="ghost" className="w-full py-5 text-indigo-600 font-black text-sm rounded-none border-t border-slate-50">View Full History</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
          <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
            <CardTitle className="text-lg font-black flex items-center gap-2">
              <Target className="size-5 text-indigo-600" /> Saving Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Annual Donation Goal</p>
                  <p className="text-3xl font-black text-slate-900">₹{totalDonated.toLocaleString()} <span className="text-slate-300 text-lg font-bold">/ ₹{goalAmount.toLocaleString()}</span></p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-indigo-600">{progressPercent}%</span>
                </div>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner p-1">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full shadow-lg"
                />
              </div>
              <div className="flex items-center gap-2 p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                <Heart className="size-5 text-indigo-600" />
                <p className="text-xs text-indigo-800 font-bold leading-tight">"Small steps lead to big changes. You've helped {history.length} causes so far!"</p>
              </div>
            </div>
            <Button className="w-full h-12 rounded-2xl bg-slate-900 text-white hover:bg-indigo-600 font-black shadow-xl transition-all">Set New Annual Goal</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function FundCausesModule() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const categories = ['All', 'Education', 'Medical', 'Environment', 'Food', 'Orphan Care']

  const handleDonate = (cause: any) => {
    const amountStr = prompt("Enter donation amount for " + cause.title + ":", "500")
    const amount = Number(amountStr)
    if (!amountStr || isNaN(amount) || amount <= 0) return

    loadRazorpay(amount, async (response) => {
      try {
        const res = await fetch(API_BASE + "/donate", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            type: 'cash', 
            amount, 
            to: cause.title,
            razorpay_payment_id: response.razorpay_payment_id 
          })
        })
        if (res.ok) {
          alert("Thank you for donating ₹" + amount + " to " + cause.title + "!")
        } else {
          const err = await res.json()
          alert("Error: " + err.error)
        }
      } catch (err) {
        alert('Failed to record donation on server.')
      }
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap",
              selectedCategory === cat 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {causes
            .filter(c => selectedCategory === 'All' || c.category === selectedCategory)
            .map((cause) => (
            <motion.div
              layout
              key={cause.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative flex flex-col rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden"
            >
              <div className="relative h-56 overflow-hidden">
                <img src={cause.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cause.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 left-4">
                  <Badge tone="info" className="bg-white/90 backdrop-blur text-indigo-900 font-bold px-4 py-1.5 rounded-full shadow-sm">
                    {cause.category}
                  </Badge>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{cause.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-2 mb-6">{cause.description}</p>
                
                <div className="mt-auto space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                      <span>₹{cause.raised.toLocaleString()} Raised</span>
                      <span>{Math.round((cause.raised / cause.goal) * 100)}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: (cause.raised / cause.goal * 100) + "%" }}
                        className="h-full bg-indigo-500"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                      <TrendingUp className="size-3" /> {cause.donors} donors contributed
                    </div>
                  </div>
                  <Button 
                    onClick={() => handleDonate(cause)}
                    className="w-full rounded-2xl bg-slate-900 py-6 text-white hover:bg-indigo-600 font-bold transition-all shadow-lg shadow-slate-200 group-hover:shadow-indigo-200"
                  >
                    Donate Now
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// --- SHIPROCKET HELPER ---
const schedulePickup = async (pickupData: any) => {
  console.log('Scheduling Shiprocket Pickup:', pickupData)
  // In a real app, this would call your server which then calls Shiprocket API
  // Shiprocket requires authentication and specific payload structure
  try {
    const res = await fetch(`${API_BASE}/clothes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pickupData)
    })
    return await res.json()
  } catch (err) {
    console.error('Shiprocket Error:', err)
    throw err
  }
}

export function DonateClothesModule() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    items: '',
    address: '',
    city: '',
    pincode: '',
    date: '',
    time: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await schedulePickup(formData)
      setStep(2)
    } catch (err) {
      alert('Failed to schedule pickup. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="rounded-[2.5rem] overflow-hidden border-none shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="bg-indigo-600 p-10 text-white flex flex-col justify-between relative overflow-hidden">
                   <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
                    <Shirt className="size-80" />
                  </div>
                  <div className="relative z-10">
                    <h2 className="text-3xl font-black mb-4 tracking-tight">NGO x Shiprocket <br/>Pickup Service</h2>
                    <p className="text-indigo-100">We've partnered with Shiprocket to provide free doorstep pickup for your donations. Pack your items in a box or bag and our courier partner will collect it.</p>
                  </div>
                  <div className="relative z-10 space-y-4 pt-8">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-white/20 grid place-items-center"><CheckCircle2 className="size-4" /></div>
                      <span className="text-sm font-medium">Real-time Tracking</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-white/20 grid place-items-center"><CheckCircle2 className="size-4" /></div>
                      <span className="text-sm font-medium">Professional Courier Service</span>
                    </div>
                  </div>
                </div>
                <div className="p-10 bg-white">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Donation Items</label>
                      <textarea 
                        className="w-full rounded-2xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px] p-4 text-sm font-medium"
                        placeholder="e.g. 5 Shirts, 2 Blankets"
                        required
                        value={formData.items}
                        onChange={(e) => setFormData({...formData, items: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Address</label>
                      <textarea 
                        className="w-full rounded-2xl border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 p-4 text-sm font-medium"
                        placeholder="House No, Street, Locality"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">City</label>
                        <input type="text" required className="w-full rounded-2xl border-slate-200 p-3 text-sm font-bold" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Pincode</label>
                        <input type="text" required className="w-full rounded-2xl border-slate-200 p-3 text-sm font-bold" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Date</label>
                        <input type="date" required className="w-full rounded-2xl border-slate-200 p-3 text-sm font-bold" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Time Slot</label>
                        <select className="w-full rounded-2xl border-slate-200 p-3 text-sm font-bold" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required>
                          <option value="">Select</option>
                          <option>10AM - 2PM</option>
                          <option>2PM - 6PM</option>
                        </select>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full rounded-2xl bg-indigo-600 py-6 text-white font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-100 disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Schedule Shiprocket Pickup'}
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 p-10"
          >
            <div className="size-24 rounded-full bg-emerald-100 text-emerald-600 grid place-items-center mx-auto shadow-inner">
              <CheckCircle2 className="size-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Shipment Confirmed!</h2>
              <p className="text-slate-600">A Shiprocket courier partner will arrive on <span className="font-bold text-indigo-600">{formData.date}</span>.</p>
              <p className="text-xs text-slate-400 uppercase font-black tracking-widest mt-4">Tracking ID: SR-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 max-w-sm mx-auto text-left space-y-4">
              <div className="flex gap-4">
                <div className="size-10 rounded-xl bg-white shadow-sm grid place-items-center shrink-0">
                  <Package className="size-5 text-indigo-600" />
                </div>
                <div className="text-sm">
                  <p className="font-black text-slate-400 uppercase text-[10px] tracking-widest mb-1">Items for Pickup</p>
                  <p className="font-bold text-slate-800 leading-tight">{formData.items}</p>
                </div>
              </div>
              <div className="flex gap-4 border-t border-slate-100 pt-4">
                 <div className="size-10 rounded-xl bg-white shadow-sm grid place-items-center shrink-0">
                  <MapPin className="size-5 text-indigo-600" />
                </div>
                <div className="text-sm">
                  <p className="font-black text-slate-400 uppercase text-[10px] tracking-widest mb-1">Location</p>
                  <p className="font-bold text-slate-800 leading-tight">{formData.address}, {formData.city} - {formData.pincode}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setStep(1)} variant="secondary" className="rounded-xl px-8 h-12 font-bold">New Pickup</Button>
              <Button className="rounded-xl bg-indigo-600 text-white px-8 h-12 font-bold shadow-lg shadow-indigo-100">Track Order</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function BloodDonationModule() {
  const [isRegistered, setIsRegistered] = useState(false)

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-rose-600 p-10 text-white">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
          <Droplets className="size-96" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-6">
          <h2 className="text-4xl font-black tracking-tight">Be a Lifesaver. <br/>Donate Blood.</h2>
          <p className="text-rose-50 opacity-90 text-lg">Your single donation can save up to three lives. Join our network of emergency donors and get notified when there's a match nearby.</p>
          <div className="flex flex-wrap gap-4 pt-4">
             {!isRegistered ? (
               <Button 
                onClick={() => {
                  alert('Thank you for registering as a blood donor!')
                  setIsRegistered(true)
                }}
                className="h-14 px-8 rounded-2xl bg-white text-rose-600 hover:bg-rose-50 font-black shadow-xl"
               >
                 Register as Donor
               </Button>
             ) : (
               <Badge className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-2xl text-lg font-bold">
                 ✓ Registered Donor
               </Badge>
             )}
             <Button variant="secondary" className="h-14 px-8 rounded-2xl bg-rose-700 border-none text-white hover:bg-rose-800 font-bold backdrop-blur">
               Find Urgent Requests
             </Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-black text-slate-900">Urgent Blood Requests</h3>
          <div className="grid gap-4">
            {[1, 2].map((i) => (
              <Card key={i} className="rounded-[2rem] border-slate-100 hover:border-rose-200 transition-all group overflow-hidden">
                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="size-16 rounded-3xl bg-rose-50 text-rose-600 grid place-items-center font-black text-2xl shadow-inner shrink-0">
                      {i === 1 ? 'O+' : 'AB-'}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg">Urgent: City Hospital</h4>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><MapPin className="size-3" /> 2.4 km away</span>
                        <span className="flex items-center gap-1"><Clock className="size-3" /> Needed within 4 hrs</span>
                      </div>
                    </div>
                  </div>
                  <Button className="rounded-2xl bg-rose-600 text-white hover:bg-rose-700 font-bold px-8 h-12 shadow-lg shadow-rose-100">
                    Contact Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
           <Card className="rounded-[2.5rem] bg-slate-900 text-white border-none p-8 overflow-hidden relative">
            <div className="absolute right-0 top-0 opacity-10">
              <Calendar className="size-32" />
            </div>
            <h4 className="text-xl font-black mb-4 relative z-10">Upcoming Donation Camps</h4>
            <div className="space-y-6 relative z-10">
              {[1, 2].map(i => (
                <div key={i} className="space-y-1">
                  <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest">May {i * 5}, 2024</p>
                  <p className="font-bold text-sm">Central Park Community Center</p>
                  <p className="text-xs text-slate-400">09:00 AM - 04:00 PM</p>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-indigo-400 p-0 h-auto font-bold hover:bg-transparent">View All Camps <ChevronRight className="size-4 ml-1" /></Button>
            </div>
           </Card>
        </aside>
      </div>
    </div>
  )
}

export function MyDonationsModule() {
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/history`)
        const data = await res.json()
        setHistory(data.donations || [])
      } catch (err) {
        console.error('Error fetching history:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const stats = [
    { label: 'Total Cash', value: `₹${history.filter(d => d.type === 'cash').reduce((acc, d) => acc + (Number(d.amount) || 0), 0).toLocaleString()}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Items Donated', value: history.filter(d => d.type === 'clothes').length.toString(), icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Blood (Units)', value: history.filter(d => d.type === 'blood').length.toString(), icon: Droplets, color: 'text-rose-600', bg: 'bg-rose-50' },
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-[2rem] border-slate-100 shadow-sm p-6 flex items-center gap-4">
            <div className={cn("size-14 rounded-2xl grid place-items-center shrink-0", stat.bg)}>
              <stat.icon className={cn("size-7", stat.color)} />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="rounded-[2.5rem] border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between p-8">
          <div>
            <CardTitle className="text-2xl font-black">Donation History</CardTitle>
            <CardDescription className="font-medium text-slate-500">Track all your contributions and download receipts.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl"><Search className="size-4 mr-2" /> Search</Button>
            <Button variant="outline" size="sm" className="rounded-xl text-indigo-600 border-indigo-100"><FileText className="size-4 mr-2" /> Export PDF</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Donated To</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Value/Amount</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.length > 0 ? (
                  history.map((don) => (
                    <tr key={don.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "size-10 rounded-xl grid place-items-center",
                            don.type === 'cash' ? 'bg-emerald-50 text-emerald-600' :
                            don.type === 'clothes' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
                          )}>
                            {don.type === 'cash' ? <Wallet className="size-5" /> : 
                             don.type === 'clothes' ? <Shirt className="size-5" /> : <Droplets className="size-5" />}
                          </div>
                          <span className="font-bold text-slate-700 capitalize">{don.type}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-500 font-medium">{don.date}</td>
                      <td className="px-8 py-6 font-bold text-slate-900">{don.to}</td>
                      <td className="px-8 py-6 text-right font-black text-slate-900">
                        {typeof don.amount === 'number' ? `₹${don.amount.toLocaleString()}` : don.amount}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <Badge tone={don.status === 'Success' || don.status === 'Completed' ? 'success' : 'info'} className="rounded-full px-4 py-1">
                          {don.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-40">
                        <History className="size-16 text-slate-300" />
                        <div>
                          <p className="text-lg font-black text-slate-900">No donations yet</p>
                          <p className="text-sm font-medium text-slate-500">Your impact journey starts with your first contribution.</p>
                        </div>
                        <Link to="/app/donor/fund-causes">
                          <Button className="rounded-xl bg-indigo-600 text-white font-bold mt-2">Start Donating</Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function SettingsModule() {
  const { session } = useSession()
  const [profile, setProfile] = useState({
    name: session?.name || '',
    email: 'donor@example.com',
    phone: '+91 99999 99999',
    bloodGroup: 'A+'
  })
  const [notifs, setNotifs] = useState({ email: true, push: true, sms: false })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/profile`)
        const data = await res.json()
        setProfile({
          name: data.name,
          email: data.email,
          phone: data.phone,
          bloodGroup: data.bloodGroup
        })
        setNotifs(data.notifications)
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, notifications: notifs })
      })
      if (res.ok) {
        alert('Profile updated successfully!')
      }
    } catch (err) {
      alert('Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-20 text-center font-bold text-slate-400">Loading settings...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="space-y-1">
          {['Profile', 'Notifications', 'Payments', 'Security', 'Privacy'].map((tab, i) => (
            <button
              key={tab}
              className={cn(
                "w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all",
                i === 0 ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              {tab}
            </button>
          ))}
        </aside>

        <div className="md:col-span-3 space-y-8">
          <section className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="size-24 rounded-3xl bg-indigo-100 grid place-items-center text-indigo-600">
                <User className="size-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">{profile.name}</h3>
                <p className="text-slate-500 font-medium">{profile.email}</p>
                <button className="text-indigo-600 text-sm font-bold mt-1 hover:underline">Change Avatar</button>
              </div>
            </div>

            <Card className="rounded-[2rem] border-slate-100 p-8 space-y-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.name} 
                    onChange={e => setProfile({...profile, name: e.target.value})}
                    className="w-full rounded-2xl border-slate-200 p-3 text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    value={profile.email} 
                    onChange={e => setProfile({...profile, email: e.target.value})}
                    className="w-full rounded-2xl border-slate-200 p-3 text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                  <input 
                    type="tel" 
                    value={profile.phone} 
                    onChange={e => setProfile({...profile, phone: e.target.value})}
                    className="w-full rounded-2xl border-slate-200 p-3 text-sm font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Blood Group</label>
                  <select 
                    value={profile.bloodGroup}
                    onChange={e => setProfile({...profile, bloodGroup: e.target.value})}
                    className="w-full rounded-2xl border-slate-200 p-3 text-sm font-bold"
                  >
                    <option>O+</option>
                    <option>A+</option>
                    <option>B+</option>
                    <option>AB+</option>
                  </select>
                </div>
              </div>
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="rounded-2xl bg-slate-900 text-white hover:bg-indigo-600 font-bold px-8 shadow-xl"
              >
                {saving ? 'Updating...' : 'Update Profile'}
              </Button>
            </Card>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-black text-slate-900">Notification Preferences</h3>
            <Card className="rounded-[2rem] border-slate-100 overflow-hidden">
               <div className="divide-y divide-slate-100">
                {[
                  { id: 'email', label: 'Email Notifications', desc: 'Summary of your impact and receipts.' },
                  { id: 'push', label: 'Push Notifications', desc: 'Real-time alerts for urgent causes.' },
                  { id: 'sms', label: 'SMS Alerts', desc: 'Emergency blood requests nearby.' },
                ].map((item) => (
                  <div key={item.id} className="p-6 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-700">{item.label}</p>
                      <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                    </div>
                    <button 
                      onClick={() => setNotifs({...notifs, [item.id]: !notifs[item.id as keyof (typeof notifs)]})}
                      className={cn(
                        "w-12 h-6 rounded-full transition-colors relative",
                        notifs[item.id as keyof (typeof notifs)] ? "bg-indigo-600" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 size-4 bg-white rounded-full transition-transform",
                        notifs[item.id as keyof (typeof notifs)] ? "translate-x-6" : "translate-x-1"
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
