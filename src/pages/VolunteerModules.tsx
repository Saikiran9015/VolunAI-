import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, 
  Clock, 
  Award, 
  BookOpen, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  PlayCircle,
  Star,
  Trophy,
  UserCheck,
  Building2,
  ArrowUpRight
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/cn'
import { useSession } from '../app/session'

const API_BASE = '/api/volunteer' // We'll need to create this

// --- MODULES ---

export function VolunteerTasksModule() {
  const tasks = [
    { id: 1, title: 'Food Distribution', location: 'City Center', time: '10:00 AM', status: 'Assigned', category: 'Food' },
    { id: 2, title: 'Teaching Kids', location: 'Community School', time: '2:00 PM', status: 'Pending', category: 'Education' },
    { id: 3, title: 'First Aid Support', location: 'NGO Camp', time: '4:00 PM', status: 'Completed', category: 'Medical' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-900">Assigned Tasks</h2>
        <Button className="rounded-2xl bg-indigo-600 text-white font-bold">Find New Tasks</Button>
      </div>
      <div className="grid gap-4">
        {tasks.map(task => (
          <Card key={task.id} className="rounded-[2rem] border-slate-100 hover:shadow-lg transition-all p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-indigo-50 text-indigo-600 grid place-items-center">
                  <Calendar className="size-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{task.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><MapPin className="size-3" /> {task.location}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3" /> {task.time}</span>
                  </div>
                </div>
              </div>
              <Badge tone={task.status === 'Completed' ? 'success' : task.status === 'Assigned' ? 'info' : 'warning'}>
                {task.status}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function AttendanceModule() {
  const [checkedIn, setCheckedIn] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)

  useEffect(() => {
    let interval: any
    if (checkedIn) {
      interval = setInterval(() => setSessionTime(s => s + 1), 1000)
    } else {
      setSessionTime(0)
    }
    return () => clearInterval(interval)
  }, [checkedIn])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-slate-900">Daily Attendance</h2>
      <Card className="rounded-[2.5rem] border-none bg-slate-900 text-white p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-50" />
        <div className="relative z-10">
          <div className="size-24 rounded-full bg-white/10 border border-white/20 grid place-items-center mx-auto mb-6">
            <UserCheck className={cn("size-12", checkedIn ? "text-emerald-400" : "text-white/40")} />
          </div>
          <h3 className="text-4xl font-black">{checkedIn ? "Session in Progress" : "Ready to Serve?"}</h3>
          <p className="text-slate-400 font-medium">Your contribution counts. Check-in to start tracking your hours.</p>
          
          {checkedIn && (
            <div className="text-6xl font-black font-mono text-emerald-400 py-6">
              {formatTime(sessionTime)}
            </div>
          )}

          <Button 
            onClick={() => setCheckedIn(!checkedIn)}
            className={cn(
              "h-16 px-12 rounded-3xl text-lg font-black transition-all shadow-xl",
              checkedIn 
                ? "bg-rose-500 hover:bg-rose-600 text-white" 
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            )}
          >
            {checkedIn ? "Check Out" : "Check In Now"}
          </Button>
        </div>
      </Card>
    </div>
  )
}

export function RewardsModule() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-slate-900">Volunteer Rewards</h2>
        <div className="flex gap-2">
          <Badge tone="success" className="px-4 py-2 rounded-xl text-sm">450 Points</Badge>
          <Badge tone="info" className="px-4 py-2 rounded-xl text-sm">Level 4</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Trophy, label: 'Top Contributor', color: 'text-amber-500', bg: 'bg-amber-50' },
          { icon: Star, label: '5 Star Rated', color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { icon: Award, label: 'Emergency Hero', color: 'text-emerald-500', bg: 'bg-emerald-50' },
        ].map((badge, i) => (
          <Card key={i} className="rounded-[2rem] border-slate-100 p-8 text-center space-y-4 hover:shadow-md transition-shadow">
            <div className={cn("size-20 rounded-3xl mx-auto grid place-items-center", badge.bg, badge.color)}>
              <badge.icon className="size-10" />
            </div>
            <h4 className="font-black text-slate-900">{badge.label}</h4>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Earned April 2024</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

// --- CERTIFICATE MODAL ---

function CertificateModal({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void; data: any }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-[800px] w-full bg-white rounded-lg shadow-2xl overflow-hidden overflow-y-auto max-h-[90dvh]"
      >
        <div className="absolute right-4 top-4 z-10">
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full size-10 p-0 hover:bg-slate-100">
            ✕
          </Button>
        </div>

        {/* A4 Content */}
        <div className="p-12 bg-white" id="certificate-content">
          <div className="border-[12px] border-double border-indigo-600 p-8 relative">
            {/* Watermark Logo */}
            <div className="absolute inset-0 grid place-items-center opacity-[0.03] pointer-events-none">
              <Building2 className="size-[400px]" />
            </div>

            <div className="relative z-10 text-center space-y-8">
              <div className="flex justify-center mb-4">
                <div className="size-20 rounded-2xl bg-indigo-600 text-white grid place-items-center shadow-lg">
                  <ShieldCheck className="size-12" />
                </div>
              </div>

              <div className="space-y-2">
                <h1 className="text-sm font-black uppercase tracking-[0.5em] text-indigo-600">Certificate of Achievement</h1>
                <p className="text-slate-400 italic text-sm">This official document recognizes the humanitarian impact of</p>
              </div>

              <div className="py-4">
                <h2 className="text-5xl font-black text-slate-900 font-serif italic border-b-2 border-slate-100 inline-block px-12 pb-2">
                  {data.name}
                </h2>
              </div>

              <div className="max-w-xl mx-auto space-y-4">
                <p className="text-slate-600 leading-relaxed">
                  For outstanding contribution and selfless service during the 
                  <span className="font-bold text-slate-900"> {data.event} </span> 
                  relief operations. Your dedication to the <span className="font-bold text-indigo-600">{data.module}</span> module 
                  has demonstrated exceptional skill and compassion.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-12">
                <div className="space-y-2">
                  <div className="h-px bg-slate-300 w-full" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date Issued</p>
                  <p className="text-sm font-bold text-slate-900">{data.date}</p>
                </div>
                <div className="grid place-items-center">
                  <div className="size-24 rounded-full border-4 border-indigo-100 grid place-items-center relative">
                    <div className="size-20 rounded-full border border-indigo-200 border-dashed animate-spin-slow absolute" />
                    <Award className="size-10 text-indigo-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-px bg-slate-300 w-full" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Official Signature</p>
                  <p className="text-sm font-serif italic text-slate-900">VolunAI Global Trust</p>
                </div>
              </div>

              <div className="pt-8 text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                Verification ID: {data.id} • volunai.org/verify
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button className="bg-indigo-600 text-white font-bold px-8">
            <Download className="mr-2 size-4" /> Download PDF
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export function TeachingCertificationModule() {
  const { session } = useSession()
  const [selectedCert, setSelectedCert] = useState<any>(null)

  const certifications = [
    { id: 'TCH-001', title: 'Advanced Pedagogy Certificate', event: '2024 Education Outreach', date: 'March 15, 2024', status: 'Issued', module: 'Teaching' },
    { id: 'TCH-002', title: 'Child Psychology Basics', event: 'Rural School Program', date: 'April 10, 2024', status: 'Issued', module: 'Psychology' },
    { id: 'TCH-003', title: 'Interactive Learning Methods', event: 'Digital Literacy Drive', status: 'In Progress', module: 'Technology' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Teaching Certifications</h2>
          <p className="text-slate-500 font-medium">Verify your skills and impact as an educator.</p>
        </div>
        <Button className="rounded-2xl bg-indigo-600 text-white font-bold">New Assessment</Button>
      </div>

      <div className="space-y-4">
        {certifications.map(cert => (
          <Card key={cert.id || cert.title} className="rounded-[2rem] border-slate-100 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="size-16 rounded-2xl bg-emerald-50 text-emerald-600 grid place-items-center">
                  <ShieldCheck className="size-10" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{cert.title}</h3>
                  <p className="text-sm text-slate-500 font-bold">{cert.date ? `Issued on ${cert.date}` : 'Not yet issued'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {cert.status === 'Issued' ? (
                  <Button 
                    variant="ghost" 
                    className="text-indigo-600 font-bold"
                    onClick={() => setSelectedCert({ ...cert, name: session?.name || 'Volunteer' })}
                  >
                    <ArrowUpRight className="size-4 mr-2" /> View Certificate
                  </Button>
                ) : (
                  <Badge tone="warning">In Progress</Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <CertificateModal 
        isOpen={!!selectedCert} 
        onClose={() => setSelectedCert(null)} 
        data={selectedCert || {}} 
      />
    </div>
  )
}

export function TrainingModule() {
  const courses = [
    { title: 'First Aid Essentials', duration: '2 hours', level: 'Beginner', progress: 100 },
    { title: 'Crisis Management', duration: '4 hours', level: 'Intermediate', progress: 45 },
    { title: 'Crowd Control Basics', duration: '3 hours', level: 'Intermediate', progress: 0 },
  ]

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black text-slate-900">Training Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map(course => (
          <Card key={course.title} className="rounded-[2rem] border-slate-100 p-8 space-y-6 hover:shadow-xl transition-all">
            <div className="flex justify-between items-start">
              <div className="size-14 rounded-2xl bg-indigo-50 text-indigo-600 grid place-items-center">
                <BookOpen className="size-8" />
              </div>
              <Badge tone={course.progress === 100 ? 'success' : course.progress > 0 ? 'info' : 'neutral'}>
                {course.progress === 100 ? 'Completed' : course.progress > 0 ? 'In Progress' : 'Locked'}
              </Badge>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">{course.title}</h3>
              <div className="flex items-center gap-4 text-xs text-slate-500 font-bold mt-1">
                <span>{course.duration}</span>
                <span>•</span>
                <span>{course.level}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-1000" 
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
            <Button className="w-full rounded-2xl py-6 font-bold bg-slate-900 text-white hover:bg-indigo-600">
              {course.progress === 100 ? 'Review Course' : course.progress > 0 ? 'Continue' : 'Start Now'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
