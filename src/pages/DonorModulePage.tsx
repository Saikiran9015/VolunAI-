import { useParams, Link } from 'react-router-dom'
import { 
  WalletModule, 
  FundCausesModule, 
  DonateClothesModule, 
  BloodDonationModule, 
  MyDonationsModule, 
  SettingsModule 
} from './DonorModules'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { AlertTriangle, ChevronLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export function DonorModulePage() {
  const { moduleId } = useParams()

  const renderModule = () => {
    switch (moduleId) {
      case 'wallet':
        return <WalletModule />
      case 'fund-causes':
        return <FundCausesModule />
      case 'donate-clothes':
        return <DonateClothesModule />
      case 'blood':
        return <BloodDonationModule />
      case 'my-donations':
        return <MyDonationsModule />
      case 'profile':
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
                The requested donor module does not exist or is under construction.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/app/donor">
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
        <Link to="/app/donor" className="group flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
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
