import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { FloatingChatbot } from './components/FloatingChatbot'
import { GoogleTranslate } from './components/GoogleTranslate'
import { ChatBoxPage } from './pages/ChatBoxPage'
import { DonorLoginPage } from './pages/DonorLoginPage'
import { LandingPage } from './pages/LandingPage'
import { ModulePage } from './pages/ModulePage'
import { NgoAdminPortalPage } from './pages/NgoAdminPortalPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RegisterPage } from './pages/RegisterPage'
import { RoleHomePage } from './pages/RoleHomePage'
import { VolunteerPortalPage } from './pages/VolunteerPortalPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { ProfilePage } from './pages/ProfilePage'
import VolunteerDashboardPage from './pages/VolunteerDashboardPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { KycModulePage } from './pages/KycModulePage'
import { DonorDashboardPage } from './pages/DonorDashboardPage'
import { Languages } from 'lucide-react'

export default function App() {
  const [showLang, setShowLang] = useState(false)

  return (
    <BrowserRouter>
      <div className="fixed right-3 top-3 z-50 flex items-start gap-2">
        <button
          type="button"
          onClick={() => setShowLang((v) => !v)}
          className="grid size-11 place-items-center rounded-2xl border border-slate-200 bg-white/85 shadow-sm backdrop-blur transition-colors hover:bg-white"
          aria-label="Language"
          title="Language"
        >
          <Languages className="size-5 text-slate-700" />
        </button>

        {showLang && (
          <div className="translate-popover rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-sm backdrop-blur">
            <GoogleTranslate />
          </div>
        )}
      </div>
      <FloatingChatbot />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatBoxPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/donor" element={<DonorLoginPage />} />
        <Route path="/auth/volunteer" element={<VolunteerPortalPage />} />
        <Route path="/auth/ngo" element={<NgoAdminPortalPage />} />
        <Route path="/auth/admin" element={<AdminLoginPage />} />

        <Route element={<AppShell />}>
          <Route path="/app/volunteer" element={<VolunteerDashboardPage />} />
          <Route path="/app/donor" element={<DonorDashboardPage />} />
          <Route path="/app/:role" element={<RoleHomePage />} />
          <Route path="/app/:role/kyc" element={<KycModulePage />} />
          <Route path="/app/:role/profile" element={<ProfilePage />} />
          <Route path="/app/:role/:moduleId" element={<ModulePage />} />
        </Route>

        <Route path="/admin" element={<AdminDashboardPage />} />

        <Route path="/app" element={<Navigate to="/register" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
