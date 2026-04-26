import { motion } from 'framer-motion'
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageSquare,
  Award,
  BookOpen,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Trophy,
  User,
  Users,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Plus,
  PlayCircle,
  Download
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../app/session'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { cn } from '../lib/cn'

const stats = [
  { label: 'Volunteers Joined', value: '1200+', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Events Completed', value: '500+', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Lives Supported', value: '25,000+', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
]

const opportunities = [
  {
    id: 1,
    title: 'Teach Children Weekend Program',
    location: 'Pune, Maharashtra',
    duration: '4 hrs / Weekends',
    needed: '12 Volunteers Needed',
    tag: 'Teaching',
    tagColor: 'bg-emerald-100 text-emerald-700',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Food Distribution Drive',
    location: 'Mumbai, Maharashtra',
    duration: '3 hrs / Weekends',
    needed: '20 Volunteers Needed',
    tag: 'Food',
    tagColor: 'bg-orange-100 text-orange-700',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Blood Donation Camp Support',
    location: 'Nashik, Maharashtra',
    duration: '5 hrs / One Day',
    needed: '15 Volunteers Needed',
    tag: 'Health',
    tagColor: 'bg-rose-100 text-rose-700',
    image: 'https://images.unsplash.com/photo-1615461066841-6116ecaabb04?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Flood Relief Volunteer',
    location: 'Kolhapur, Maharashtra',
    duration: 'Flexible',
    needed: '30 Volunteers Needed',
    tag: 'Relief',
    tagColor: 'bg-blue-100 text-blue-700',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=400&auto=format&fit=crop',
  },
]

const activities = [
  { date: '25 MAY', title: 'Teach Children - Session 1', time: '10:00 AM - 01:00 PM', location: 'Pune, Maharashtra', status: 'Upcoming' },
  { date: '28 MAY', title: 'Food Distribution Drive', time: '04:00 PM - 07:00 PM', location: 'Mumbai, Maharashtra', status: 'Upcoming' },
  { date: '02 JUN', title: 'Blood Donation Camp Support', time: '09:00 AM - 02:00 PM', location: 'Nashik, Maharashtra', status: 'Upcoming' },
]

const skills = ['Teaching', 'Communication', 'Event Management', 'Social Media', 'Team Work']

export default function VolunteerDashboardPage() {
  const { session } = useSession()
  const [activeTab, setActiveTab] = useState('upcoming')

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 text-white md:p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559027615-cd26735550b4?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Welcome, <span className="text-emerald-400">{session?.name?.split(' ')[0] || 'Volunteer'}!</span>
            </h1>
            <p className="mt-4 text-lg text-slate-300 md:text-xl">
              Your time and skills can change lives. Ready to make an impact today?
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="h-12 rounded-2xl bg-emerald-500 px-8 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20">
                <Search className="mr-2 size-5" /> Browse Opportunities
              </Button>
              <Button size="lg" variant="secondary" className="h-12 rounded-2xl bg-white/10 px-8 text-white backdrop-blur-md hover:bg-white/20 border-white/10">
                <LayoutDashboard className="mr-2 size-5" /> My Dashboard
              </Button>
              <Button size="lg" variant="secondary" className="h-12 rounded-2xl bg-white/10 px-8 text-white backdrop-blur-md hover:bg-white/20 border-white/10">
                <MessageSquare className="mr-2 size-5" /> Contact Support
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Training & Certification Sections */}
      <div className="grid grid-cols-1 gap-8">
        {/* Training Section */}
        <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Training Notifications & Courses</h2>
              <p className="text-sm text-slate-500">Enhance your skills with certified training programs.</p>
            </div>
            <Button variant="ghost" className="text-emerald-600">Explore All Courses</Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { title: 'First Aid Essentials', duration: '2 hours', lessons: 5, level: 'Beginner', color: 'bg-rose-50 text-rose-700' },
              { title: 'Crisis Management', duration: '4 hours', lessons: 8, level: 'Intermediate', color: 'bg-blue-50 text-blue-700' },
              { title: 'Food Safety Standards', duration: '1.5 hours', lessons: 4, level: 'Beginner', color: 'bg-orange-50 text-orange-700' },
              { title: 'Crowd Control Basics', duration: '3 hours', lessons: 6, level: 'Intermediate', color: 'bg-emerald-50 text-emerald-700' },
            ].map((course, i) => (
              <div key={i} className="flex items-center gap-4 rounded-3xl border border-slate-50 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md hover:border-slate-100">
                <div className={cn("grid size-12 place-items-center rounded-2xl", course.color)}>
                  <BookOpen className="size-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">{course.title}</h4>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="size-3" /> {course.duration}</span>
                    <span className="flex items-center gap-1"><PlayCircle className="size-3" /> {course.lessons} Lessons</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="rounded-full size-8 p-0 text-slate-400 hover:text-emerald-600">
                  <ExternalLink className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Certification Section */}
        <section className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Award className="size-32" />
          </div>
          <div className="relative z-10">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Your Certifications</h2>
                <p className="text-sm text-slate-400">Download and share your verified accomplishments.</p>
              </div>
              <Button className="rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600">Get New Certificate</Button>
            </div>

            <div className="space-y-4">
              {[
                { id: 'CERT-2024-001', title: 'Outstanding Educator Award', date: 'March 12, 2024', issuer: 'VolunAI Global' },
                { id: 'CERT-2024-002', title: 'Relief Operation Specialist', date: 'April 05, 2024', issuer: 'Red Cross Partner' },
              ].map((cert, i) => (
                <div key={i} className="flex items-center gap-6 rounded-3xl bg-white/5 p-5 border border-white/10 backdrop-blur-sm transition-all hover:bg-white/10">
                  <div className="grid size-14 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                    <ShieldCheck className="size-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{cert.title}</h4>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span>ID: {cert.id}</span>
                      <span>Issued on {cert.date}</span>
                      <span>By {cert.issuer}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" className="bg-white/10 border-white/5 text-white hover:bg-white/20">
                      <Download className="mr-2 size-4" /> Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
