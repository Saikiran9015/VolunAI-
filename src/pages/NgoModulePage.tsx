import { useParams, Link } from 'react-router-dom'
import { 
  NgoRequestsModule,
  NgoInventoryModule,
  NgoImpactReportsModule,
  NgoEmergencyAlertsModule,
  NgoNearbyNgoFinderModule,
  NgoBloodDonationModule,
  NgoProfileModule
} from './NgoModules'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { AlertTriangle, ChevronLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { SettingsModule } from './DonorModules' // Reusing donor settings for consistency or we can customize

export function NgoModulePage() {
  const { moduleId } = useParams()

  const renderModule = () => {
    switch (moduleId) {
      case 'requests':
        return <NgoRequestsModule />
      case 'inventory':
        return <NgoInventoryModule />
      case 'impact-reports':
        return <NgoImpactReportsModule />
      case 'emergency-alerts':
        return <NgoEmergencyAlertsModule />
      case 'nearby-ngos':
        return <NgoNearbyNgoFinderModule />
      case 'blood':
        return <NgoBloodDonationModule />
      case 'profile':
        return <NgoProfileModule />
      case 'settings':
        return <SettingsModule />
      default:
        return (
          <Card className="rounded-[2rem] border-none shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-amber-600" />
                Module not found
              </CardTitle>
              <CardDescription>
                The requested NGO module is under development.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/app/ngo">
                <Button variant="secondary" className="rounded-xl">
                  <ChevronLeft className="size-4 mr-2" /> Back to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-12"
    >
      <div className="mb-8 flex items-center justify-between">
        <Link to="/app/ngo" className="group flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
          <div className="size-8 rounded-full bg-slate-100 group-hover:bg-indigo-50 grid place-items-center mr-3 transition-colors">
            <ChevronLeft className="size-4" />
          </div>
          Back to Dashboard
        </Link>
      </div>

      {renderModule()}
    </motion.div>
  )
}
