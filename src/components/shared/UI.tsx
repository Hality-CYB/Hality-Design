import type { ReactNode, CSSProperties } from 'react'

// ─── Btn ──────────────────────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
interface BtnProps {
  children: ReactNode
  variant?: BtnVariant
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  full?: boolean
  size?: 'sm' | 'md' | 'lg'
  style?: CSSProperties
}
const btnStyles: Record<BtnVariant, CSSProperties> = {
  primary:   { background: 'var(--teal-800)', color: '#fff', boxShadow: '0 2px 8px rgba(11,107,130,0.25)' },
  secondary: { background: 'var(--teal-100)', color: 'var(--teal-800)' },
  ghost:     { background: 'transparent', color: 'var(--teal-800)' },
  danger:    { background: '#FEE2E2', color: '#DC2626' },
  success:   { background: 'var(--gradient-green)', color: '#fff', boxShadow: '0 2px 8px rgba(22,163,74,0.25)' },
}
const sizeStyles: Record<string, CSSProperties> = {
  sm: { padding: '8px 14px', fontSize: 13, borderRadius: 10 },
  md: { padding: '12px 18px', fontSize: 14, borderRadius: 12 },
  lg: { padding: '15px 24px', fontSize: 16, borderRadius: 14 },
}
export function Btn({ children, variant = 'primary', onClick, type = 'button', disabled, full, size = 'md', style }: BtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        border: 'none', fontFamily: 'Outfit', fontWeight: 700, letterSpacing: -0.1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: full ? '100%' : undefined,
        opacity: disabled ? 0.45 : 1,
        transition: 'all 0.15s',
        ...btnStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      onMouseDown={e => { if (!disabled) (e.currentTarget as HTMLElement).style.opacity = '0.85' }}
      onMouseUp={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = disabled ? '0.45' : '1' }}
    >
      {children}
    </button>
  )
}

// ─── Input — Apple filled style ───────────────────────────────────────────────
interface InputProps {
  label?: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  icon?: ReactNode
  hint?: string
}
export function Input({ label, value, onChange, type = 'text', placeholder, icon, hint }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-text)', fontFamily: 'Outfit', letterSpacing: 0.1 }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        {icon && <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-3)', pointerEvents: 'none', display: 'flex' }}>{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: icon ? '14px 14px 14px 44px' : '14px 16px',
            background: 'var(--bg)',
            border: '1.5px solid transparent',
            borderRadius: 13,
            fontSize: 16,
            fontFamily: 'inherit',
            outline: 'none',
            color: 'var(--body)',
            transition: 'all 0.18s',
          }}
          onFocus={e => { e.target.style.background = '#fff'; e.target.style.borderColor = 'var(--teal-800)'; e.target.style.boxShadow = '0 0 0 3px rgba(11,107,130,0.10)' }}
          onBlur={e => { e.target.style.background = 'var(--bg)'; e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = 'none' }}
        />
      </div>
      {hint && <span style={{ fontSize: 12, color: 'var(--gray-text)' }}>{hint}</span>}
    </div>
  )
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
interface TextareaProps { label?: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }
export function Textarea({ label, value, onChange, placeholder, rows = 4 }: TextareaProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-text)', fontFamily: 'Outfit', letterSpacing: 0.1 }}>{label}</label>}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{ width: '100%', padding: '14px 16px', background: 'var(--bg)', border: '1.5px solid transparent', borderRadius: 13, fontSize: 15, fontFamily: 'inherit', outline: 'none', color: 'var(--body)', resize: 'vertical', transition: 'all 0.18s' }}
        onFocus={e => { e.target.style.background = '#fff'; e.target.style.borderColor = 'var(--teal-800)'; e.target.style.boxShadow = '0 0 0 3px rgba(11,107,130,0.10)' }}
        onBlur={e => { e.target.style.background = 'var(--bg)'; e.target.style.borderColor = 'transparent'; e.target.style.boxShadow = 'none' }}
      />
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps { children: ReactNode; style?: CSSProperties; onClick?: () => void; hover?: boolean }
export function Card({ children, style, onClick, hover }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{ background: '#fff', borderRadius: 18, padding: 20, boxShadow: 'var(--shadow-sm)', cursor: onClick ? 'pointer' : undefined, transition: 'all 0.2s', ...style }}
      onMouseEnter={e => { if (hover || onClick) (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)' }}
      onMouseLeave={e => { if (hover || onClick) (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)' }}
    >
      {children}
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'pending'
const badgeColors: Record<BadgeStatus, { bg: string; color: string }> = {
  success: { bg: '#D1FAE5', color: '#065F46' },
  warning: { bg: '#FEF3C7', color: '#92400E' },
  danger:  { bg: '#FEE2E2', color: '#991B1B' },
  info:    { bg: 'var(--teal-100)', color: 'var(--teal-800)' },
  neutral: { bg: '#F2F2F7', color: '#3C3C43' },
  pending: { bg: '#EDE9FE', color: '#5B21B6' },
}
export function Badge({ label, status = 'info' }: { label: string; status?: BadgeStatus }) {
  const { bg, color } = badgeColors[status]
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, fontFamily: 'Outfit', padding: '4px 9px', borderRadius: 999, whiteSpace: 'nowrap', letterSpacing: 0.1 }}>{label}</span>
  )
}

// ─── Progress steps ───────────────────────────────────────────────────────────
export function StepBar({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'unset' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: i < current ? 'var(--green-600)' : i === current ? 'var(--teal-800)' : 'var(--border)',
              color: i <= current ? '#fff' : 'var(--gray-3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Outfit', fontWeight: 800, fontSize: 11,
              flexShrink: 0, transition: 'all 0.3s',
            }}>
              {i < current ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 9, color: i <= current ? 'var(--teal-800)' : 'var(--gray-3)', fontWeight: i <= current ? 700 : 400, whiteSpace: 'nowrap' }}>{s}</span>
          </div>
          {i < steps.length - 1 && <div style={{ flex: 1, height: 1.5, background: i < current ? 'var(--green-600)' : 'var(--border)', margin: '0 3px 14px', transition: 'background 0.3s' }} />}
        </div>
      ))}
    </div>
  )
}

// ─── Alert ────────────────────────────────────────────────────────────────────
export function Alert({ message, type = 'error' }: { message: string; type?: 'error' | 'success' | 'info' }) {
  const cfg = type === 'error' ? { bg: '#FFF1F0', border: 'rgba(255,59,48,0.15)', color: '#C0392B', icon: '!' }
    : type === 'success' ? { bg: '#F0FDF4', border: 'rgba(22,163,74,0.2)', color: '#16A34A', icon: '✓' }
    : { bg: 'var(--teal-100)', border: 'var(--teal-200)', color: 'var(--teal-800)', icon: 'i' }
  return (
    <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 12, padding: '11px 14px', color: cfg.color, fontSize: 13, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
      <span style={{ width: 18, height: 18, borderRadius: '50%', background: cfg.color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, flexShrink: 0, marginTop: 1 }}>{cfg.icon}</span>
      <span>{message}</span>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
export function Empty({ icon, title, desc, action }: { icon: ReactNode; title: string; desc?: string; action?: ReactNode }) {
  return (
    <div style={{ textAlign: 'center', padding: '52px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 60, height: 60, borderRadius: 18, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-3)' }}>{icon}</div>
      <h3 style={{ fontFamily: 'Outfit', fontSize: 17, fontWeight: 700, color: 'var(--body)' }}>{title}</h3>
      {desc && <p style={{ fontSize: 14, color: 'var(--gray-text)', maxWidth: 280, lineHeight: 1.6 }}>{desc}</p>}
      {action}
    </div>
  )
}

// ─── Loading ──────────────────────────────────────────────────────────────────
export function Loading({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 52, gap: 16 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2.5px solid var(--border)', borderTopColor: 'var(--teal-800)', animation: 'spin 0.75s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <span style={{ fontSize: 14, color: 'var(--gray-text)' }}>{label}</span>
    </div>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
export function Avatar({ name, size = 36, role }: { name: string; size?: number; role?: 'professional' | 'admin' }) {
  const badgeSize = Math.max(14, Math.round(size * 0.32))
  const badgeBg = role === 'admin' ? 'linear-gradient(160deg,#D97706,#92400E)' : 'linear-gradient(160deg,#2563EB,#1E40AF)'
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: size > 44 ? 18 : '50%',
        background: 'linear-gradient(160deg,#0B6B82,#0d8aa6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontFamily: 'Outfit', fontWeight: 800,
        fontSize: size * 0.38,
      }}>
        {name.charAt(0).toUpperCase()}
      </div>
      {role && (
        <div style={{
          position: 'absolute', bottom: -2, right: -2,
          width: badgeSize, height: badgeSize, borderRadius: '50%',
          background: badgeBg,
          border: '2px solid #fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {role === 'professional' ? (
            <svg width={badgeSize * 0.6} height={badgeSize * 0.6} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
              <path d="M11 2v2" />
              <path d="M5 2v2" />
              <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
              <path d="M8 15a6 6 0 0 0 12 0v-3" />
              <circle cx="20" cy="10" r="2" />
            </svg>
          ) : (
            <svg width={badgeSize * 0.6} height={badgeSize * 0.6} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
              <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <div>
        <h2 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 800, color: 'var(--body)', margin: 0 }}>{title}</h2>
        {sub && <p style={{ fontSize: 13, color: 'var(--gray-text)', margin: '2px 0 0' }}>{sub}</p>}
      </div>
      {action}
    </div>
  )
}

// ─── PageHero ─────────────────────────────────────────────────────────────────
export function PageHero({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div style={{ background: 'var(--gradient-brand)', padding: '20px 24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(22,163,74,0.12)', filter: 'blur(24px)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 2px', letterSpacing: -0.3 }}>{title}</h1>
        {sub && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>{sub}</p>}
      </div>
      {right && <div style={{ position: 'relative', zIndex: 1 }}>{right}</div>}
    </div>
  )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: ReactNode; color?: string }) {
  return (
    <Card>
      <div style={{ width: 40, height: 40, borderRadius: 13, background: (color || 'var(--teal-800)') + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, color: color || 'var(--teal-800)' }}>{icon}</div>
      <div style={{ fontFamily: 'Outfit', fontSize: 26, fontWeight: 800, color: color || 'var(--teal-800)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--gray-text)', marginTop: 4 }}>{label}</div>
    </Card>
  )
}

// ─── ScoreMeter (SVG ring) ────────────────────────────────────────────────────
export function ScoreMeter({ score, color, size = 100 }: { score: number; color: string; size?: number }) {
  const r = size * 0.42
  const circ = 2 * Math.PI * r
  const dash = Math.min(score, 100) / 100 * circ
  const cx = size / 2, cy = size / 2
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={size * 0.07} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={size * 0.07} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
    </svg>
  )
}

// ─── Modal / bottom sheet ─────────────────────────────────────────────────────
export function Modal({ children, onClose, title }: { children: ReactNode; onClose: () => void; title?: string }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 200, backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: '22px 22px 0 0', padding: '24px', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, background: 'var(--border)', borderRadius: 999, margin: '0 auto 20px' }} />
        {title && <h3 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 800, color: 'var(--body)', marginBottom: 16 }}>{title}</h3>}
        {children}
      </div>
    </div>
  )
}
