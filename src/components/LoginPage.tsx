import { useState } from 'react'
import halityLogo from '@/imports/Logo-Hality-rncwhngo9oo4u9tdlspy0644l1cpwnm78navwjh0jk.png'

interface LoginPageProps {
  onLogin: (user: { name: string; role: string; email: string }) => void
  onNavigate: (view: string) => void
  mode: 'login' | 'register'
}

export default function LoginPage({ onLogin, onNavigate: _onNavigate, mode }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [focused, setFocused] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Preencha todos os campos.'); return }
    if (!isLogin && !name) { setError('Informe seu nome.'); return }
    if (isLogin) {
      if (email === 'admin@hality.com' && password === '123456') {
        onLogin({ name: 'Dr. Marcelo Saldanha', role: 'admin', email })
      } else if (email === 'cyb@hality.com' && password === '123456') {
        onLogin({ name: 'Especialista CYB', role: 'cyb', email })
      } else if (password === '123456') {
        onLogin({ name: email.split('@')[0] || 'Usuário', role: 'user', email })
      } else {
        setError('E-mail ou senha inválidos.')
      }
    } else {
      onLogin({ name, role: 'user', email })
    }
  }

  const inputStyle = (field: string): React.CSSProperties => ({
    width: '100%',
    padding: '15px 16px',
    border: `1.5px solid ${focused === field ? '#0B6B82' : 'rgba(11,107,130,0.15)'}`,
    borderRadius: 14,
    fontSize: 15,
    fontFamily: 'Inter',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#0F2A35',
    background: focused === field ? '#fff' : 'rgba(255,255,255,0.7)',
    transition: 'all 0.2s',
    backdropFilter: 'blur(8px)',
  })

  return (
    <div style={{
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      background: '#0a3d4a',
    }}>
      {/* Animated gradient blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: -80, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(11,107,130,0.8) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', top: 60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.5) 0%, transparent 70%)', filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', top: 180, left: 60, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(11,107,130,0.4) 0%, transparent 70%)', filter: 'blur(24px)' }} />
      </div>

      {/* Hero top */}
      <div style={{ padding: '44px 28px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
        {/* Logo ring */}
        <div style={{
          width: 80, height: 80,
          borderRadius: 24,
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}>
          <img src={halityLogo} alt="Hality" style={{ height: 48, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 26, fontWeight: 800, color: '#fff', margin: '0 0 6px', letterSpacing: -0.5 }}>
            Check Your Breath
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter', margin: 0 }}>
            Diagnóstico inteligente do hálito com IA
          </p>
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: 8 }}>
          {['IA Avançada', 'Hality 10 anos', 'Seguro'].map(tag => (
            <span key={tag} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999, padding: '4px 10px', fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter', fontWeight: 500 }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Bottom card */}
      <div style={{
        flex: 1,
        background: 'rgba(240,249,255,0.97)',
        backdropFilter: 'blur(20px)',
        borderRadius: '32px 32px 0 0',
        padding: '28px 24px 24px',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 -20px 60px rgba(0,0,0,0.25)',
      }}>
        {/* Handle bar */}
        <div style={{ width: 36, height: 4, background: 'rgba(11,107,130,0.2)', borderRadius: 999, margin: '0 auto 24px' }} />

        {/* Tab toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(11,107,130,0.08)',
          borderRadius: 16,
          padding: 4,
          marginBottom: 24,
          gap: 4,
        }}>
          {(['Entrar', 'Cadastrar'] as const).map((label, i) => {
            const active = i === 0 ? isLogin : !isLogin
            return (
              <button
                key={label}
                onClick={() => setIsLogin(i === 0)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12, border: 'none',
                  background: active ? '#0B6B82' : 'transparent',
                  color: active ? '#fff' : '#5A7A85',
                  fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  transition: 'all 0.25s',
                  boxShadow: active ? '0 4px 12px rgba(11,107,130,0.3)' : 'none',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!isLogin && (
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>👤</span>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                placeholder="Seu nome completo"
                style={{ ...inputStyle('name'), paddingLeft: 42 }}
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>✉️</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              placeholder="seu@email.com"
              style={{ ...inputStyle('email'), paddingLeft: 42 }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔒</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              placeholder="••••••••"
              style={{ ...inputStyle('password'), paddingLeft: 42 }}
            />
          </div>

          {isLogin && (
            <div style={{ textAlign: 'right', marginTop: -8 }}>
              <button type="button" style={{ background: 'none', border: 'none', color: '#0B6B82', fontSize: 13, fontFamily: 'Inter', cursor: 'pointer', fontWeight: 600 }}>
                Esqueci minha senha
              </button>
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 12, padding: '10px 14px', color: '#DC2626', fontSize: 13, fontFamily: 'Inter' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #0B6B82 0%, #0d8aa6 100%)',
              color: '#fff', border: 'none', borderRadius: 16,
              padding: '17px',
              fontFamily: 'Outfit', fontWeight: 800, fontSize: 16,
              cursor: 'pointer', marginTop: 4,
              boxShadow: '0 8px 24px rgba(11,107,130,0.4)',
              letterSpacing: 0.3,
              transition: 'transform 0.1s',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isLogin ? 'Entrar na plataforma' : 'Criar minha conta'}
          </button>
        </form>

        {/* Demo */}
        <div style={{ background: 'linear-gradient(135deg, rgba(11,107,130,0.06), rgba(22,163,74,0.06))', border: '1px solid rgba(11,107,130,0.12)', borderRadius: 14, padding: '12px 14px', marginTop: 16 }}>
          <p style={{ fontSize: 11, color: '#5A7A85', fontFamily: 'Inter', margin: 0, lineHeight: 1.7 }}>
            <strong style={{ color: '#0B6B82' }}>Acesso Demo</strong><br />
            Usuário: qualquer email + <strong>123456</strong><br />
            Admin: <strong>admin@hality.com</strong> · CYB: <strong>cyb@hality.com</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
