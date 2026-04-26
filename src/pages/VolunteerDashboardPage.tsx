import { motion } from 'framer-motion'
import {
  Award,
  BookOpen,
  Clock,
  Download,
  ExternalLink,
  PlayCircle,
  ShieldCheck,
  Search,
  LayoutDashboard,
  MessageSquare
} from 'lucide-react'
import { useSession } from '../app/session'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/cn'

export default function VolunteerDashboardPage() {
  const { session } = useSession()

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
