import { useState } from 'react'
import LandingPage from './components/LandingPage'
import AuthFlow, { type AuthUser } from './components/AuthFlow'
import PatientApp from './components/PatientApp'
import ProfessionalApp from './components/ProfessionalApp'
import AdminApp from './components/AdminApp'

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [showLanding, setShowLanding] = useState(true)
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login')

  const handleLogout = () => {
    setUser(null)
    setShowLanding(true)
  }

  const handleLandingNavigate = (view: string) => {
    setAuthScreen(view === 'register' ? 'register' : 'login')
    setShowLanding(false)
  }

  if (!user) {
    if (showLanding) return <LandingPage onNavigate={handleLandingNavigate} />
    return <AuthFlow onLogin={setUser} initialScreen={authScreen} />
  }
  if (user.role === 'admin') return <AdminApp user={user} onLogout={handleLogout} />
  if (user.role === 'professional') return <ProfessionalApp user={user} onLogout={handleLogout} />
  return <PatientApp user={user} onLogout={handleLogout} />
}
