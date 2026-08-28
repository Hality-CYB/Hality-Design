import { useState } from 'react'
import AuthFlow, { type AuthUser } from './components/AuthFlow'
import PatientApp from './components/PatientApp'
import ProfessionalApp from './components/ProfessionalApp'
import AdminApp from './components/AdminApp'

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null)

  const handleLogout = () => setUser(null)

  if (!user) return <AuthFlow onLogin={setUser} />
  if (user.role === 'admin') return <AdminApp user={user} onLogout={handleLogout} />
  if (user.role === 'professional') return <ProfessionalApp user={user} onLogout={handleLogout} />
  return <PatientApp user={user} onLogout={handleLogout} />
}
