import halityLogo from '@/imports/Logo-Hality-rncwhngo9oo4u9tdlspy0644l1cpwnm78navwjh0jk.png'

interface NavbarProps {
  user: { name: string; role: string } | null
  onNavigate: (view: string) => void
  currentView: string
  onLogout: () => void
}

export default function Navbar({ user, onNavigate, currentView, onLogout }: NavbarProps) {
  const isLanding = !user

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #C5E2EA', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <button onClick={() => onNavigate(user ? (user.role === 'admin' ? 'admin-dashboard' : user.role === 'cyb' ? 'cyb-diagnostics' : 'user-dashboard') : 'landing')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <img src={halityLogo} alt="Hality" style={{ height: 40, objectFit: 'contain' }} />
        </button>

        {isLanding && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ display: 'flex', gap: 24 }}>
              {['Quem Somos', 'Diagnóstico', 'Tratamento', 'Halitose'].map(item => (
                <button key={item} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0B6B82', fontFamily: 'Inter', fontSize: 14, fontWeight: 500 }}>{item}</button>
              ))}
            </div>
            <button
              onClick={() => onNavigate('login')}
              style={{ background: '#0B6B82', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: 'Outfit', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
            >
              Entrar
            </button>
          </div>
        )}

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {user.role === 'user' && (
              <div style={{ display: 'flex', gap: 4 }}>
                {[
                  { label: 'Início', view: 'user-dashboard' },
                  { label: 'Diagnósticos', view: 'user-diagnostics' },
                  { label: 'Dicas', view: 'user-tips' },
                  { label: 'Avisos', view: 'user-notifications' },
                ].map(item => (
                  <button
                    key={item.view}
                    onClick={() => onNavigate(item.view)}
                    style={{
                      background: currentView === item.view ? '#E0F4F8' : 'none',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      color: currentView === item.view ? '#0B6B82' : '#5A7A85',
                      fontFamily: 'Inter',
                      fontSize: 14,
                      fontWeight: currentView === item.view ? 600 : 400,
                      padding: '6px 14px',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {user.role === 'admin' && (
              <div style={{ display: 'flex', gap: 4 }}>
                {[
                  { label: 'Usuários', view: 'admin-users' },
                  { label: 'Dicas', view: 'admin-tips' },
                  { label: 'Diagnósticos', view: 'admin-diagnostics' },
                  { label: 'Avisos', view: 'admin-notifications' },
                  { label: 'Anamnese', view: 'admin-anamnesis' },
                ].map(item => (
                  <button
                    key={item.view}
                    onClick={() => onNavigate(item.view)}
                    style={{
                      background: currentView === item.view ? '#E0F4F8' : 'none',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      color: currentView === item.view ? '#0B6B82' : '#5A7A85',
                      fontFamily: 'Inter',
                      fontSize: 14,
                      fontWeight: currentView === item.view ? 600 : 400,
                      padding: '6px 14px',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {user.role === 'cyb' && (
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  onClick={() => onNavigate('cyb-diagnostics')}
                  style={{
                    background: '#E0F4F8',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    color: '#0B6B82',
                    fontFamily: 'Inter',
                    fontSize: 14,
                    fontWeight: 600,
                    padding: '6px 14px',
                  }}
                >
                  Diagnósticos CYB
                </button>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0B6B82', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Outfit', fontWeight: 700, fontSize: 15 }}>
                {user.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F2A35', fontFamily: 'Outfit' }}>{user.name}</div>
                <div style={{ fontSize: 11, color: '#5A7A85' }}>{user.role === 'admin' ? 'Administrador' : user.role === 'cyb' ? 'Diagnóstico CYB' : 'Usuário'}</div>
              </div>
              <button
                onClick={onLogout}
                style={{ background: 'none', border: '1px solid #C5E2EA', borderRadius: 8, cursor: 'pointer', color: '#5A7A85', fontSize: 13, padding: '6px 12px', fontFamily: 'Inter' }}
              >
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
