import { useState } from 'react'
import halityLogo from '@/imports/Logo-Hality-rncwhngo9oo4u9tdlspy0644l1cpwnm78navwjh0jk.png'
import { Btn, Alert } from './shared/UI'
import { Icon } from './shared/Icons'

export type AuthUser = { name: string; role: 'patient' | 'professional' | 'admin'; email: string }

type Screen = 'login' | 'register' | 'forgot' | 'reset'

// ─── Shared field component (used by register / forgot / reset) ───────────────
function Field({ label, value, onChange, type = 'text', placeholder, autoComplete }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; autoComplete?: string }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit' }}>{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} autoComplete={autoComplete}
        style={{ width: '100%', padding: '15px 16px', background: focused ? '#fff' : 'var(--bg)', border: `1.5px solid ${focused ? 'var(--teal-800)' : 'transparent'}`, boxShadow: focused ? '0 0 0 3px rgba(11,107,130,0.10)' : 'none', borderRadius: 14, fontSize: 16, fontFamily: 'inherit', outline: 'none', color: 'var(--body)', transition: 'all 0.18s' }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  )
}

function PasswordField({ label, value, onChange, autoComplete }: { label: string; value: string; onChange: (v: string) => void; autoComplete?: string }) {
  const [show, setShow] = useState(false)
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
          placeholder="••••••••" autoComplete={autoComplete}
          style={{ width: '100%', padding: '15px 48px 15px 16px', background: focused ? '#fff' : 'var(--bg)', border: `1.5px solid ${focused ? 'var(--teal-800)' : 'transparent'}`, boxShadow: focused ? '0 0 0 3px rgba(11,107,130,0.10)' : 'none', borderRadius: 14, fontSize: 16, fontFamily: 'inherit', outline: 'none', color: 'var(--body)', transition: 'all 0.18s' }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-3)', display: 'flex', padding: 4 }}>
          <Icon name={show ? 'eyeOff' : 'eye'} size={18} />
        </button>
      </div>
    </div>
  )
}

// ─── Card wrapper for register / forgot / reset ───────────────────────────────
function AuthPage({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 68, height: 68, borderRadius: 20, background: 'var(--gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 20px rgba(11,107,130,0.3)' }}>
            <img src={halityLogo} alt="Hality" style={{ height: 42, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          </div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 900, color: 'var(--body)', margin: '0 0 4px', letterSpacing: -0.5 }}>Check Your Breath</h1>
          <p style={{ fontSize: 13, color: 'var(--gray-text)', margin: 0 }}>Diagnóstico inteligente do hálito com IA</p>
        </div>
        <div style={{ background: '#fff', borderRadius: 24, padding: '28px 24px', boxShadow: 'var(--shadow-md)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AuthFlow({ onLogin }: { onLogin: (user: AuthUser) => void }) {
  const [screen, setScreen] = useState<Screen>('login')

  // Login state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showLoginPw, setShowLoginPw] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Register state
  const [rName, setRName] = useState('')
  const [rEmail, setREmail] = useState('')
  const [rPhone, setRPhone] = useState('')
  const [rPw, setRPw] = useState('')
  const [rPw2, setRPw2] = useState('')
  const [rTerms, setRTerms] = useState(false)
  const [rError, setRError] = useState('')

  // Forgot state
  const [fEmail, setFEmail] = useState('')
  const [fSent, setFSent] = useState(false)

  // Reset state
  const [newPw, setNewPw] = useState('')
  const [newPw2, setNewPw2] = useState('')
  const [resetDone, setResetDone] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    if (!email || !password) { setLoginError('Preencha todos os campos.'); return }
    if (email === 'admin@hality.com' && password === '123456') {
      onLogin({ name: 'Dr. Marcelo Saldanha', role: 'admin', email })
    } else if (email === 'prof@hality.com' && password === '123456') {
      onLogin({ name: 'Dra. Ana Beatriz Costa', role: 'professional', email })
    } else if (password === '123456') {
      onLogin({ name: email.split('@')[0].replace(/[._]/g, ' ') || 'Usuário', role: 'patient', email })
    } else {
      setLoginError('E-mail ou senha incorretos.')
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setRError('')
    if (!rName || !rEmail || !rPw || !rPw2) { setRError('Preencha todos os campos obrigatórios.'); return }
    if (rPw !== rPw2) { setRError('As senhas não coincidem.'); return }
    if (!rTerms) { setRError('Aceite os termos para continuar.'); return }
    onLogin({ name: rName, role: 'patient', email: rEmail })
  }

  // ── Login ─────────────────────────────────────────────────────────────────────
  if (screen === 'login') return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Logo area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px 32px 32px' }}>
        <img src={halityLogo} alt="Hality" style={{ height: 120, objectFit: 'contain' }} />
      </div>

      {/* Form area */}
      <div style={{ padding: '0 24px 52px' }}>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--body)', marginBottom: 8, fontFamily: 'Outfit' }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="abc@abc.com" autoComplete="email"
              style={{ width: '100%', padding: '16px', background: '#fff', border: '1.5px solid #D1D5DB', borderRadius: 12, fontSize: 16, fontFamily: 'inherit', outline: 'none', color: 'var(--body)', transition: 'border-color 0.18s' }}
              onFocus={e => (e.target.style.borderColor = 'var(--teal-800)')}
              onBlur={e => (e.target.style.borderColor = '#D1D5DB')}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--body)', fontFamily: 'Outfit' }}>Senha</label>
              <button type="button" onClick={() => setScreen('forgot')} style={{ background: 'none', border: 'none', color: 'var(--teal-800)', fontSize: 13, fontFamily: 'Outfit', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Esqueceu sua senha?</button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showLoginPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••" autoComplete="current-password"
                style={{ width: '100%', padding: '16px 48px 16px 16px', background: '#fff', border: '1.5px solid #D1D5DB', borderRadius: 12, fontSize: 16, fontFamily: 'inherit', outline: 'none', color: 'var(--body)', transition: 'border-color 0.18s' }}
                onFocus={e => (e.target.style.borderColor = 'var(--teal-800)')}
                onBlur={e => (e.target.style.borderColor = '#D1D5DB')}
              />
              <button type="button" onClick={() => setShowLoginPw(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-3)', display: 'flex', padding: 4 }}>
                <Icon name={showLoginPw ? 'eyeOff' : 'eye'} size={18} />
              </button>
            </div>
          </div>

          {loginError && <div style={{ marginBottom: 16 }}><Alert message={loginError} /></div>}

          {/* Login button — pill style */}
          <button type="submit"
            style={{ width: '100%', padding: '17px', background: 'var(--teal-800)', color: '#fff', border: 'none', borderRadius: 999, fontFamily: 'Outfit', fontWeight: 700, fontSize: 17, cursor: 'pointer', letterSpacing: -0.2, transition: 'opacity 0.15s' }}
            onMouseDown={e => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
            onMouseUp={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}>
            Login
          </button>
        </form>

        {/* Demo hint */}
        <div style={{ background: 'rgba(11,107,130,0.06)', borderRadius: 10, padding: '10px 14px', marginTop: 20 }}>
          <p style={{ fontSize: 11.5, color: 'var(--gray-text)', margin: 0, lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--body)' }}>Demo:</strong> qualquer email + <strong>123456</strong><br />
            <strong>prof@hality.com</strong> · <strong>admin@hality.com</strong>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 15, color: 'var(--gray-text)' }}>
          Não possui conta?{' '}
          <button onClick={() => setScreen('register')} style={{ background: 'none', border: 'none', color: 'var(--teal-800)', fontFamily: 'Outfit', fontWeight: 700, fontSize: 15, cursor: 'pointer', padding: 0 }}>Registrar</button>
        </p>
      </div>
    </div>
  )

  // ── Register ──────────────────────────────────────────────────────────────────
  if (screen === 'register') return (
    <AuthPage>
      <h2 style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 900, color: 'var(--body)', margin: '0 0 4px' }}>Criar conta</h2>
      <p style={{ fontSize: 14, color: 'var(--gray-text)', marginBottom: 24 }}>Preencha seus dados para começar</p>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Nome completo *" value={rName} onChange={setRName} placeholder="Seu nome completo" autoComplete="name" />
        <Field label="E-mail *" value={rEmail} onChange={setREmail} type="email" placeholder="seu@email.com" autoComplete="email" />
        <Field label="Telefone" value={rPhone} onChange={setRPhone} placeholder="(11) 99999-9999" autoComplete="tel" />
        <PasswordField label="Senha *" value={rPw} onChange={setRPw} autoComplete="new-password" />
        <PasswordField label="Confirmar senha *" value={rPw2} onChange={setRPw2} autoComplete="new-password" />
        <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', marginTop: 2 }}>
          <input type="checkbox" checked={rTerms} onChange={e => setRTerms(e.target.checked)} style={{ marginTop: 3, accentColor: 'var(--teal-800)', width: 16, height: 16, flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: 'var(--gray-text)', lineHeight: 1.5 }}>
            Li e aceito os{' '}
            <span style={{ color: 'var(--teal-800)', fontWeight: 600 }}>Termos de Uso</span>
            {' '}e a{' '}
            <span style={{ color: 'var(--teal-800)', fontWeight: 600 }}>Política de Privacidade</span>
          </span>
        </label>
        {rError && <Alert message={rError} />}
        <Btn type="submit" full size="lg">Criar conta</Btn>
      </form>
      <p style={{ textAlign: 'center', marginTop: 16 }}>
        <button onClick={() => setScreen('login')} style={{ background: 'none', border: 'none', color: 'var(--gray-text)', fontFamily: 'inherit', fontSize: 14, cursor: 'pointer' }}>← Voltar ao login</button>
      </p>
    </AuthPage>
  )

  // ── Forgot password ───────────────────────────────────────────────────────────
  if (screen === 'forgot') return (
    <AuthPage>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--teal-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: 'var(--teal-800)' }}>
        <Icon name="key" size={22} />
      </div>
      <h2 style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 900, color: 'var(--body)', margin: '0 0 4px' }}>Recuperar senha</h2>
      <p style={{ fontSize: 14, color: 'var(--gray-text)', marginBottom: 24 }}>Informe seu e-mail para receber o link de recuperação</p>
      {fSent ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Alert message="Link enviado. Verifique sua caixa de entrada." type="success" />
          <Btn variant="secondary" full onClick={() => setScreen('reset')}>Tenho o código — Redefinir senha</Btn>
        </div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setFSent(true) }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="E-mail" value={fEmail} onChange={setFEmail} type="email" placeholder="seu@email.com" />
          <Btn type="submit" full size="lg">Solicitar recuperação</Btn>
        </form>
      )}
      <p style={{ textAlign: 'center', marginTop: 16 }}>
        <button onClick={() => setScreen('login')} style={{ background: 'none', border: 'none', color: 'var(--gray-text)', fontFamily: 'inherit', fontSize: 14, cursor: 'pointer' }}>← Voltar ao login</button>
      </p>
    </AuthPage>
  )

  // ── Reset password ────────────────────────────────────────────────────────────
  return (
    <AuthPage>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--teal-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: 'var(--teal-800)' }}>
        <Icon name="lock" size={22} />
      </div>
      <h2 style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 900, color: 'var(--body)', margin: '0 0 4px' }}>Nova senha</h2>
      <p style={{ fontSize: 14, color: 'var(--gray-text)', marginBottom: 24 }}>Crie uma nova senha segura</p>
      {resetDone ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Alert message="Senha redefinida com sucesso!" type="success" />
          <Btn full onClick={() => setScreen('login')}>Ir para o login</Btn>
        </div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setResetDone(true) }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <PasswordField label="Nova senha" value={newPw} onChange={setNewPw} autoComplete="new-password" />
          <PasswordField label="Confirmar nova senha" value={newPw2} onChange={setNewPw2} autoComplete="new-password" />
          {newPw && newPw2 && newPw !== newPw2 && <Alert message="As senhas não coincidem." />}
          <Btn type="submit" full size="lg" disabled={!!newPw && !!newPw2 && newPw !== newPw2}>Salvar nova senha</Btn>
        </form>
      )}
    </AuthPage>
  )
}
