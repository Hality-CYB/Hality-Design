interface BottomNavProps {
  user: { name: string; role: string }
  currentView: string
  onNavigate: (view: string) => void
}

const userTabs = [
  { view: 'user-dashboard', icon: '⊞', emoji: '🏠', label: 'Início' },
  { view: 'user-capture', icon: '', emoji: '📸', label: 'Capturar' },
  { view: 'user-diagnostics', icon: '', emoji: '🔬', label: 'Exames' },
  { view: 'user-tips', icon: '', emoji: '💡', label: 'Dicas' },
  { view: 'user-notifications', icon: '', emoji: '🔔', label: 'Avisos' },
]

const adminTabs = [
  { view: 'admin-dashboard', icon: '', emoji: '📊', label: 'Painel' },
  { view: 'admin-users', icon: '', emoji: '👥', label: 'Usuários' },
  { view: 'admin-diagnostics', icon: '', emoji: '🔬', label: 'Exames' },
  { view: 'admin-tips', icon: '', emoji: '💡', label: 'Dicas' },
  { view: 'admin-anamnesis', icon: '', emoji: '📋', label: 'Anamnese' },
]

const cybTabs = [
  { view: 'cyb-diagnostics', icon: '', emoji: '🔬', label: 'Diagnósticos' },
]

export default function BottomNav({ user, currentView, onNavigate }: BottomNavProps) {
  const tabs = user.role === 'admin' ? adminTabs : user.role === 'cyb' ? cybTabs : userTabs

  return (
    <div style={{
      background: '#fff',
      borderTop: '1px solid rgba(11,107,130,0.08)',
      display: 'flex',
      padding: '6px 8px 20px',
      flexShrink: 0,
      position: 'relative',
    }}>
      {tabs.map(tab => {
        const active = currentView === tab.view
        return (
          <button
            key={tab.view}
            onClick={() => onNavigate(tab.view)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              position: 'relative',
            }}
          >
            {/* Active indicator */}
            {active && (
              <div style={{
                position: 'absolute',
                top: 0,
                width: 32,
                height: 3,
                background: 'linear-gradient(90deg, #0B6B82, #16A34A)',
                borderRadius: '0 0 4px 4px',
              }} />
            )}
            <div style={{
              width: 44,
              height: 32,
              borderRadius: 12,
              background: active ? 'linear-gradient(135deg, rgba(11,107,130,0.12), rgba(22,163,74,0.08))' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 17,
              transition: 'all 0.2s',
            }}>
              {tab.emoji}
            </div>
            <span style={{
              fontSize: 10,
              fontFamily: 'Outfit',
              fontWeight: active ? 700 : 500,
              color: active ? '#0B6B82' : '#9CA3AF',
              letterSpacing: active ? 0.2 : 0,
            }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
