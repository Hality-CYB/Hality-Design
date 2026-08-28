import halityLogo from '@/imports/Logo-Hality-rncwhngo9oo4u9tdlspy0644l1cpwnm78navwjh0jk.png'

interface AppHeaderProps {
  user: { name: string; role: string; email: string }
  currentView: string
  onNavigate: (view: string) => void
  onLogout: () => void
}

const viewTitles: Record<string, string> = {
  'user-dashboard': '',
  'user-capture': 'Capturar Imagem',
  'user-diagnostics': 'Meus Diagnósticos',
  'user-tips': 'Dicas de Tratamento',
  'user-notifications': 'Avisos',
  'user-profile': 'Meu Perfil',
  'admin-dashboard': '',
  'admin-users': 'Usuários',
  'admin-diagnostics': 'Diagnósticos',
  'admin-tips': 'Dicas',
  'admin-notifications': 'Avisos',
  'admin-anamnesis': 'Anamnese',
  'cyb-diagnostics': '',
}

export default function AppHeader({ user, currentView, onNavigate, onLogout }: AppHeaderProps) {
  const title = viewTitles[currentView]
  const homeView = user.role === 'admin' ? 'admin-dashboard' : user.role === 'cyb' ? 'cyb-diagnostics' : 'user-dashboard'
  const isHome = currentView === homeView

  return (
    <div style={{
      background: '#fff',
      borderBottom: '1px solid rgba(11,107,130,0.08)',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      zIndex: 10,
    }}>
      {/* Left */}
      <div style={{ width: 40 }}>
        {!isHome ? (
          <button
            onClick={() => onNavigate(homeView)}
            style={{
              width: 36, height: 36, background: 'rgba(11,107,130,0.08)', border: 'none',
              borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#0B6B82', fontSize: 18, lineHeight: 1,
            }}
          >
            ‹
          </button>
        ) : (
          <img src={halityLogo} alt="Hality" style={{ height: 24, objectFit: 'contain' }} />
        )}
      </div>

      {/* Center */}
      <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 16, color: '#0F2A35' }}>
        {isHome ? 'Check Your Breath' : title}
      </span>

      {/* Right */}
      <button
        onClick={() => user.role === 'user' ? onNavigate('user-profile') : onLogout()}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        title={user.role === 'user' ? 'Perfil' : 'Sair'}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 12,
          background: 'linear-gradient(135deg, #0B6B82, #0d8aa6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontFamily: 'Outfit', fontWeight: 800, fontSize: 15,
          boxShadow: '0 2px 8px rgba(11,107,130,0.3)',
        }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
      </button>
    </div>
  )
}
