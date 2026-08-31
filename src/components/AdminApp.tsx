import { useState, useRef, useEffect } from 'react'
import type { AuthUser } from './AuthFlow'
import { Btn, Card, Badge, Empty, Avatar, SectionHeader, Modal, Textarea, Alert } from './shared/UI'
import { Icon } from './shared/Icons'
import { TIPS as INITIAL_TIPS, type Tip, type TipFormat, type TipLevel } from './shared/tips'
import cybIcon from '@/imports/Icon_CheckYourBreath.png'
import halityLogo from '@/imports/Logo-Hality-rncwhngo9oo4u9tdlspy0644l1cpwnm78navwjh0jk.png'

type BadgeStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'pending'
type AdminView = 'dashboard' | 'users' | 'user-detail' | 'user-diagnostics' | 'user-patients' | 'diagnostics' | 'diag-detail' | 'content' | 'tip-edit' | 'profile'
// 'notifications' tab/edit ficam desativados por enquanto — ainda vou validar com o time
type ContentTab = 'tips'

// ─── Level system (1=Normal, 2=Íntima, 3=Social) ────────────────────────────
type Level = 1 | 2 | 3
const levelColor = (l: Level | null) => l === null ? '#6B7280' : l === 1 ? '#16A34A' : l === 2 ? '#FF9500' : '#FF3B30'
const levelLabel = (l: Level | null) => l === null ? 'Pendente' : l === 1 ? 'Hálito Normal' : l === 2 ? 'Halitose Íntima' : 'Mau Hálito Social'
const levelBadge = (l: Level | null): BadgeStatus => l === null ? 'pending' : l === 1 ? 'success' : l === 2 ? 'warning' : 'danger'

function LevelChip({ level, size = 'md' }: { level: Level | null; size?: 'sm' | 'md' | 'lg' }) {
  const color = levelColor(level)
  const label = levelLabel(level)
  const pad = size === 'sm' ? '4px 10px' : size === 'lg' ? '8px 18px' : '6px 14px'
  const fs = size === 'sm' ? 11 : size === 'lg' ? 15 : 13
  return (
    <span style={{
      background: color + '18',
      color,
      border: `1.5px solid ${color}40`,
      borderRadius: 999,
      padding: pad,
      fontFamily: 'Outfit',
      fontWeight: 700,
      fontSize: fs,
      whiteSpace: 'nowrap',
      display: 'inline-block',
    }}>{label}</span>
  )
}

type Role = 'patient' | 'professional' | 'admin'

interface AdminUser {
  id: number
  name: string
  email: string
  role: Role
  plan: string
  status: string
  diags: number
  joined: string
  pending?: boolean
  especialidade?: string
  registro?: string
  professional?: string
}

const USERS: AdminUser[] = [
  { id: 1, name: 'Ana Paula Ferreira', email: 'ana@email.com', role: 'patient', plan: 'Free', status: 'Ativo', diags: 4, joined: '10/01/2026', professional: 'Dr. Carlos Nunes' },
  { id: 2, name: 'Dr. Carlos Nunes', email: 'carlos@clinic.com', role: 'professional', plan: 'Premium', status: 'Ativo', diags: 0, joined: '05/03/2026', especialidade: 'Odontologia / Halitose', registro: 'CRO-SP 98765' },
  { id: 3, name: 'Roberto Souza', email: 'roberto@email.com', role: 'patient', plan: 'Premium', status: 'Inativo', diags: 3, joined: '22/04/2026', professional: 'Dra. Mariana Rocha' },
  { id: 4, name: 'Fernanda Lima', email: 'fer@email.com', role: 'patient', plan: 'Free', status: 'Ativo', diags: 2, joined: '01/06/2026', professional: 'Dr. Carlos Nunes' },
  { id: 5, name: 'Dra. Mariana Rocha', email: 'mari@clinic.com', role: 'professional', plan: 'Premium', status: 'Ativo', diags: 0, joined: '15/07/2026', especialidade: 'Periodontia', registro: 'CRO-SP 45210' },
  { id: 6, name: 'Igor Xavier', email: 'igor@hality.com', role: 'admin', plan: 'Premium', status: 'Ativo', diags: 0, joined: '01/01/2026' },
]

const DIAGS: { id: number; user: string; date: string; level: Level | null; status: string; aiConf: number | null; anam: Record<string, string> }[] = [
  { id: 1001, user: 'Ana Paula Ferreira', date: '12/08/2026', level: 2, status: 'Revisado', aiConf: 87, anam: { fumante: 'Não', escovacao: '2x ao dia', medicacao: 'Nenhuma', bocaSeca: 'Sim' } },
  { id: 1002, user: 'Julia Costa', date: '10/08/2026', level: null, status: 'Processando', aiConf: null, anam: { fumante: 'Sim', escovacao: '1x ao dia', medicacao: 'Omeprazol', bocaSeca: 'Não' } },
  { id: 1003, user: 'Carlos Mendes', date: '08/08/2026', level: 1, status: 'Revisado', aiConf: 92, anam: { fumante: 'Não', escovacao: '3x ao dia', medicacao: 'Anti-hipertensivo', bocaSeca: 'Não' } },
  { id: 1004, user: 'Roberto Souza', date: '05/08/2026', level: 3, status: 'Aguardando revisão', aiConf: 79, anam: { fumante: 'Sim', escovacao: '1x ao dia', medicacao: 'Nenhuma', bocaSeca: 'Sim' } },
  { id: 1005, user: 'Fernanda Lima', date: '01/08/2026', level: 2, status: 'Revisado', aiConf: 85, anam: { fumante: 'Não', escovacao: '2x ao dia', medicacao: 'Nenhuma', bocaSeca: 'Não' } },
]


const NOTIFS = [
  { id: 1, title: 'Lembre-se do seu exame diário!', type: 'reminder', sent: '12/08/2026', audience: 'Todos pacientes' },
  { id: 2, title: 'Nova funcionalidade: scan inteligente', type: 'feature', sent: '05/08/2026', audience: 'Todos usuários' },
  { id: 3, title: 'Resultado do diagnóstico disponível', type: 'update', sent: '03/08/2026', audience: 'Pacientes Premium' },
]

const statusBadge = (status: string): BadgeStatus => status === 'Revisado' ? 'success' : status === 'Processando' ? 'neutral' : 'pending'
const roleBadge = (r: string): BadgeStatus => r === 'admin' ? 'danger' : r === 'professional' ? 'info' : 'neutral'
const roleLabel = (r: string) => r === 'admin' ? 'Admin' : r === 'professional' ? 'Profissional' : 'Paciente'
const avatarRole = (r: string): 'professional' | 'admin' | undefined => r === 'admin' ? 'admin' : r === 'professional' ? 'professional' : undefined

const formatLabel = (f: TipFormat) => f === 'texto' ? 'Texto' : f === 'imagem' ? 'Imagem' : 'Vídeo'
const formatIcon = (f: TipFormat) => f === 'texto' ? 'document' : f === 'imagem' ? 'image' : 'video'
const TIP_LEVELS: TipLevel[] = [1, 2, 3]

// ─── Tip card — como o paciente vê (texto / imagem / vídeo) ──────────────────
function TipCard({ tip, compact }: { tip: Tip; compact?: boolean }) {
  return (
    <Card style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: compact ? '16px' : undefined }}>
      <div style={{ width: compact ? 42 : 44, height: compact ? 42 : 44, borderRadius: compact ? 12 : 13, background: 'var(--teal-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-800)', flexShrink: 0 }}>
        <Icon name={tip.iconName} size={22} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{tip.title}</span>
          <span style={{ fontSize: 10, fontFamily: 'Outfit', fontWeight: 600, color: 'var(--teal-800)', background: 'var(--teal-100)', borderRadius: 999, padding: '2px 8px' }}>{tip.cat}</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--gray-text)', lineHeight: 1.55, margin: 0 }}>{tip.body}</p>
        {tip.format !== 'texto' && (
          tip.mediaUrl ? (
            <div style={{ marginTop: 10, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
              {tip.format === 'imagem'
                ? <img src={tip.mediaUrl} alt={tip.title} style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }} />
                : <video src={tip.mediaUrl} controls style={{ width: '100%', maxHeight: 220, display: 'block', background: '#000' }} />}
            </div>
          ) : (
            <div style={{ marginTop: 10, background: 'var(--bg)', borderRadius: 12, aspectRatio: '16/9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, border: '1px solid var(--border)' }}>
              <Icon name={tip.format === 'video' ? 'video' : 'image'} size={22} color="var(--gray-3)" />
              <span style={{ fontSize: 11, color: 'var(--gray-3)', fontFamily: 'Outfit' }}>{tip.format === 'video' ? 'Vídeo' : 'Imagem'}</span>
            </div>
          )
        )}
      </div>
    </Card>
  )
}

// ─── Preview: Home do paciente ─────────────────────────────────────────────────
function HomePreviewModal({ tips, onClose }: { tips: Tip[]; onClose: () => void }) {
  const homeTips = tips.filter(t => t.pub && t.showOnHome).sort((a, b) => a.order - b.order)
  return (
    <Modal onClose={onClose} title="Preview — Home do paciente">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ fontSize: 12, color: 'var(--gray-text)', margin: 0 }}>Assim aparecem as dicas na aba "Dicas para você" da home do paciente, na ordem configurada.</p>
        {homeTips.length === 0
          ? <Empty icon={<Icon name="lightbulb" size={26} />} title="Nenhuma dica na home" desc="Marque dicas com o toggle &quot;Aparecer na home&quot; pra elas aparecerem aqui." />
          : homeTips.map(tip => <TipCard key={tip.id} tip={tip} compact />)}
      </div>
    </Modal>
  )
}

// ─── Preview: Orientações por classificação ────────────────────────────────────
function OrientationsPreviewModal({ tips, onClose }: { tips: Tip[]; onClose: () => void }) {
  const [level, setLevel] = useState<TipLevel>(1)
  const levelTips = tips.filter(t => t.pub && t.levels.includes(level)).sort((a, b) => a.order - b.order)
  return (
    <Modal onClose={onClose} title="Preview — Orientações por classificação">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ fontSize: 12, color: 'var(--gray-text)', margin: 0 }}>Assim aparecem as orientações pro paciente depois do diagnóstico, de acordo com a classificação.</p>
        <div style={{ display: 'flex', gap: 8 }}>
          {TIP_LEVELS.map(l => (
            <button key={l} onClick={() => setLevel(l)} style={{ flex: 1, padding: '8px 6px', borderRadius: 10, border: `1.5px solid ${level === l ? levelColor(l) : 'var(--border)'}`, background: level === l ? levelColor(l) + '18' : '#fff', color: level === l ? levelColor(l) : 'var(--gray-text)', fontFamily: 'Outfit', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>{levelLabel(l)}</button>
          ))}
        </div>
        {levelTips.length === 0
          ? <Empty icon={<Icon name="lightbulb" size={26} />} title="Nenhuma orientação" desc="Nenhuma dica publicada está marcada pra essa classificação ainda." />
          : levelTips.map(tip => <TipCard key={tip.id} tip={tip} />)}
      </div>
    </Modal>
  )
}

// ─── TopBar ───────────────────────────────────────────────────────────────────
function TopBar({ user, onProfile }: { user: AuthUser; onProfile: () => void }) {
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
      <div>
        <img src={cybIcon} alt="Check Your Breath" style={{ height: 22, objectFit: 'contain', display: 'block' }} />
        <span style={{ fontSize: 10, color: 'var(--teal-700)', fontFamily: 'Outfit', fontWeight: 700 }}>Admin</span>
      </div>
      <button onClick={onProfile} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <Avatar name={user.name} size={34} role="admin" />
      </button>
    </div>
  )
}

// ─── BottomNav ────────────────────────────────────────────────────────────────
function BottomNav({ view, setView }: { view: AdminView; setView: (v: AdminView) => void }) {
  const tabs: { v: AdminView; icon: React.ReactNode; label: string }[] = [
    { v: 'dashboard',   icon: <Icon name="chart" size={22} />,    label: 'Início' },
    { v: 'users',       icon: <Icon name="users" size={22} />,    label: 'Usuários' },
    { v: 'diagnostics', icon: <Icon name="beaker" size={22} />,   label: 'Diagnósticos' },
    { v: 'content',     icon: <Icon name="lightbulb" size={22} />,label: 'Conteúdo' },
  ]
  const inTab = (t: AdminView) =>
    view === t ||
    (t === 'diagnostics' && view === 'diag-detail') ||
    (t === 'users' && (view === 'user-detail' || view === 'user-diagnostics' || view === 'user-patients')) ||
    (t === 'content' && view === 'tip-edit')

  return (
    <nav style={{ background: '#fff', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '10px 8px 26px', flexShrink: 0 }}>
      {tabs.map(t => (
        <button key={t.v} onClick={() => setView(t.v)} style={{ flex: 1, display: 'flex', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: inTab(t.v) ? '#E8E8ED' : 'transparent', borderRadius: 14, padding: inTab(t.v) ? '8px 18px' : '8px 10px', color: inTab(t.v) ? 'var(--body)' : 'var(--gray-3)', transition: 'all 0.2s', minWidth: inTab(t.v) ? 76 : undefined }}>
            {t.icon}
            <span style={{ fontSize: 11, fontFamily: 'Outfit', fontWeight: inTab(t.v) ? 700 : 500, whiteSpace: 'nowrap' }}>{t.label}</span>
          </div>
        </button>
      ))}
    </nav>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ user, users, tips, setView, onNewTip, onNewUser, onOpenUser, onOpenDiag }: { user: AuthUser; users: AdminUser[]; tips: Tip[]; setView: (v: AdminView) => void; onNewTip: () => void; onNewUser: () => void; onOpenUser: (u: AdminUser) => void; onOpenDiag: () => void }) {
  const stats = [
    { v: users.length, label: 'usuários', icon: <Icon name="users" size={18} color="rgba(255,255,255,0.8)" /> },
    { v: DIAGS.length, label: 'diagnósticos', icon: <Icon name="beaker" size={18} color="rgba(255,255,255,0.8)" /> },
    { v: DIAGS.filter(d => d.status === 'Revisado').length, label: 'revisados', icon: <Icon name="checkCircle" size={18} color="rgba(255,255,255,0.8)" /> },
    { v: tips.filter(t => t.pub).length, label: 'dicas ativas', icon: <Icon name="lightbulb" size={18} color="rgba(255,255,255,0.8)" /> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'linear-gradient(160deg, #0a3d4a 0%, #0B6B82 55%, #0d8aa6 100%)', padding: '24px 20px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(22,163,74,0.12)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
          <Icon name="shield" size={14} color="rgba(255,255,255,0.5)" />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'Outfit' }}>Painel administrativo</span>
        </div>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 20px', letterSpacing: -0.5, position: 'relative' }}>
          Olá, {user.name.split(' ')[0]}
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, position: 'relative' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 16, padding: '14px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
              {s.icon}
              <div>
                <div style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Ver usuários', icon: <Icon name="users" size={20} color="var(--teal-800)" />, bg: 'var(--teal-100)', action: () => setView('users') },
            { label: 'Ver diagnósticos', icon: <Icon name="beaker" size={20} color="#7C3AED" />, bg: '#EDE9FE', action: () => setView('diagnostics') },
            { label: 'Criar dica', icon: <Icon name="lightbulb" size={20} color="#D97706" />, bg: '#FEF3C7', action: onNewTip },
            { label: 'Criar usuário', icon: <Icon name="plus" size={20} color="#16A34A" />, bg: '#D1FAE5', action: onNewUser },
          ].map((a, i) => (
            <button key={i} onClick={a.action} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 16, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{a.icon}</div>
              <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: 'var(--body)' }}>{a.label}</span>
            </button>
          ))}
        </div>

        {/* Latest users */}
        <Card>
          <SectionHeader title="Últimos usuários" action={<Btn variant="ghost" size="sm" onClick={() => setView('users')}>Ver todos</Btn>} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {users.slice(0, 3).map((u, i) => (
              <div key={u.id} onClick={() => onOpenUser(u)} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
                <Avatar name={u.name} size={36} role={avatarRole(u.role)} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: 'var(--body)' }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-text)' }}>{u.joined}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <Badge label={roleLabel(u.role)} status={roleBadge(u.role)} />
                  <Badge label={u.status} status={u.status === 'Ativo' ? 'success' : 'neutral'} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent diags */}
        <Card>
          <SectionHeader title="Diagnósticos recentes" action={<Btn variant="ghost" size="sm" onClick={() => setView('diagnostics')}>Ver todos</Btn>} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {DIAGS.slice(0, 3).map((d, i) => (
              <div key={d.id} onClick={onOpenDiag} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="scan" size={18} color="var(--teal-800)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13 }}>{d.user}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-text)' }}>{d.date}</div>
                </div>
                <LevelChip level={d.level} size="sm" />
                <Badge label={d.status} status={statusBadge(d.status)} />
              </div>
            ))}
          </div>
        </Card>
        <div style={{ height: 8 }} />
      </div>
    </div>
  )
}

// ─── Create user modal ────────────────────────────────────────────────────────
function CreateUserModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string, email: string, role: Role) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('patient')

  const roleOptions: { v: Role; label: string; icon: React.ReactNode; bg: string }[] = [
    { v: 'patient', label: 'Paciente', icon: <Icon name="person" size={18} color="var(--teal-800)" />, bg: 'var(--teal-100)' },
    { v: 'professional', label: 'Profissional', icon: <Icon name="medical" size={18} color="#1E40AF" />, bg: '#DBEAFE' },
    { v: 'admin', label: 'Admin', icon: <Icon name="shield" size={18} color="#92400E" />, bg: '#FEF3C7' },
  ]

  return (
    <Modal onClose={onClose} title="Criar usuário">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Nome completo</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nome do usuário..." style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>E-mail</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="email@exemplo.com" style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Tipo de usuário</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {roleOptions.map(o => (
              <button key={o.v} onClick={() => setRole(o.v)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${role === o.v ? 'var(--teal-800)' : 'var(--border)'}`, background: role === o.v ? 'var(--teal-100)' : '#fff', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: o.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{o.icon}</div>
                <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{o.label}</span>
              </button>
            ))}
          </div>
        </div>
        <Btn full size="lg" disabled={!name.trim() || !email.trim()} onClick={() => onCreate(name.trim(), email.trim(), role)}>
          <Icon name="check" size={16} color="#fff" /> Criar usuário
        </Btn>
      </div>
    </Modal>
  )
}

// ─── Users list ───────────────────────────────────────────────────────────────
function UsersList({ users, onCreateUser, onOpenUser, openCreateOnMount, onConsumeCreateFlag }: { users: AdminUser[]; onCreateUser: (name: string, email: string, role: Role) => void; onOpenUser: (u: AdminUser) => void; openCreateOnMount?: boolean; onConsumeCreateFlag?: () => void }) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'Todos' | Role>('Todos')
  const [showCreate, setShowCreate] = useState(openCreateOnMount ?? false)
  useEffect(() => { if (openCreateOnMount) onConsumeCreateFlag?.() }, [])
  const filtered = users.filter(u => (roleFilter === 'Todos' || u.role === roleFilter) && u.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '20px 20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>Usuários</h1>
          <button onClick={() => setShowCreate(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: 'none', borderRadius: 10, padding: '8px 14px', color: 'var(--teal-800)', fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
            <Icon name="plus" size={14} color="var(--teal-800)" /> Criar usuário
          </button>
        </div>
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <Icon name="search" size={16} color="rgba(255,255,255,0.5)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome..."
            style={{ width: '100%', padding: '11px 14px 11px 40px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#fff' }} />
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {([['Todos', 'Todos'], ['patient', 'Pacientes'], ['professional', 'Profissionais'], ['admin', 'Admins']] as const).map(([v, l]) => (
            <button key={v} onClick={() => setRoleFilter(v as typeof roleFilter)} style={{ padding: '7px 14px', borderRadius: 999, border: 'none', background: roleFilter === v ? '#fff' : 'rgba(255,255,255,0.15)', color: roleFilter === v ? 'var(--teal-800)' : 'rgba(255,255,255,0.85)', fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(u => (
          <Card key={u.id} onClick={() => onOpenUser(u)} hover style={{ cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center' }}>
            <Avatar name={u.name} size={48} role={avatarRole(u.role)} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{u.name}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-text)', marginBottom: 6 }}>{u.email}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Badge label={roleLabel(u.role)} status={roleBadge(u.role)} />
                <Badge label={u.plan} status={u.plan === 'Premium' ? 'success' : 'neutral'} />
                <Badge label={u.status} status={u.status === 'Ativo' ? 'success' : 'warning'} />
              </div>
            </div>
            <Icon name="chevronRight" size={16} color="var(--gray-3)" />
          </Card>
        ))}
        {filtered.length === 0 && <Empty icon={<Icon name="users" size={26} />} title="Nenhum usuário encontrado" />}
      </div>
      {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} onCreate={(name, email, role) => { onCreateUser(name, email, role); setShowCreate(false) }} />}
    </div>
  )
}

// ─── Edit user modal (admin editing another user's data) ──────────────────────
function EditUserModal({ user: u, onClose, onSave }: { user: AdminUser; onClose: () => void; onSave: (u: AdminUser) => void }) {
  const [name, setName] = useState(u.name)
  const [email, setEmail] = useState(u.email)
  const [plan, setPlan] = useState(u.plan)
  const [status, setStatus] = useState(u.status)
  const [especialidade, setEspecialidade] = useState(u.especialidade ?? '')
  const [registro, setRegistro] = useState(u.registro ?? '')

  return (
    <Modal onClose={onClose} title="Editar dados">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Nome</label>
          <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>E-mail</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        {u.role === 'patient' && (
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Plano</label>
            <select value={plan} onChange={e => setPlan(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff' }}>
              <option>Free</option>
              <option>Premium</option>
            </select>
          </div>
        )}
        {u.role === 'professional' && (
          <>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Especialidade</label>
              <input value={especialidade} onChange={e => setEspecialidade(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Registro</label>
              <input value={registro} onChange={e => setRegistro(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </>
        )}
        {u.role !== 'admin' && (
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff' }}>
              <option>Ativo</option>
              <option>Inativo</option>
            </select>
          </div>
        )}
        <Btn full size="lg" disabled={!name.trim() || !email.trim()} onClick={() => onSave({ ...u, name, email, plan, status, especialidade: especialidade || undefined, registro: registro || undefined })}>Salvar alterações</Btn>
      </div>
    </Modal>
  )
}

// ─── Reset password modal (admin resetting another user's password) ──────────
function ResetPasswordModal({ user: u, onClose }: { user: AdminUser; onClose: () => void }) {
  const [tempPassword] = useState(() => Math.random().toString(36).slice(-8))
  const [sent, setSent] = useState(false)

  return (
    <Modal onClose={onClose} title="Redefinir senha">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ fontSize: 13, color: 'var(--gray-text)', lineHeight: 1.6, margin: 0 }}>
          Uma senha temporária será gerada para <strong>{u.name}</strong>. O usuário precisará trocá-la no próximo acesso.
        </p>
        <div style={{ background: 'var(--bg)', borderRadius: 12, padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--gray-text)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, fontFamily: 'Outfit', fontWeight: 700 }}>Senha temporária</div>
          <div style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 900, color: 'var(--teal-800)', letterSpacing: 1 }}>{tempPassword}</div>
        </div>
        {sent && <Alert message={`Senha redefinida e enviada para ${u.email}!`} type="success" />}
        <Btn full size="lg" onClick={() => setSent(true)}>
          <Icon name="key" size={16} color="#fff" /> Confirmar redefinição
        </Btn>
      </div>
    </Modal>
  )
}

// ─── Link professional modal (admin linking a patient to a professional) ─────
function LinkProfessionalModal({ patient, professionals, onClose, onLink }: { patient: AdminUser; professionals: AdminUser[]; onClose: () => void; onLink: (professionalName: string) => void }) {
  const [selected, setSelected] = useState(patient.professional ?? '')
  const [search, setSearch] = useState('')
  const filtered = professionals.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Modal onClose={onClose} title="Vincular profissional">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ fontSize: 13, color: 'var(--gray-text)', lineHeight: 1.6, margin: 0 }}>
          Escolha o profissional responsável por <strong>{patient.name}</strong>.
        </p>
        <div style={{ position: 'relative' }}>
          <Icon name="search" size={16} color="var(--gray-3)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar profissional..."
            style={{ width: '100%', padding: '11px 14px 11px 40px', background: 'var(--bg)', border: '1.5px solid transparent', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
          {filtered.length === 0 && (
            <span style={{ fontSize: 13, color: 'var(--gray-text)' }}>{professionals.length === 0 ? 'Nenhum profissional cadastrado ainda.' : 'Nenhum profissional encontrado.'}</span>
          )}
          {filtered.map(p => (
            <button key={p.id} type="button" onClick={() => setSelected(p.name)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${selected === p.name ? 'var(--teal-800)' : 'var(--border)'}`, background: selected === p.name ? 'var(--teal-100)' : '#fff', cursor: 'pointer', textAlign: 'left', flexShrink: 0 }}>
              <Avatar name={p.name} size={34} role="professional" />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-text)' }}>{p.especialidade ?? 'Profissional'}</div>
              </div>
              {selected === p.name && <Icon name="check" size={16} color="var(--teal-800)" />}
            </button>
          ))}
        </div>
        <Btn full size="lg" disabled={!selected} onClick={() => onLink(selected)}>Vincular</Btn>
      </div>
    </Modal>
  )
}

// ─── User detail ──────────────────────────────────────────────────────────────
function UserDetail({ user: u, setView, backView, users, onViewPatients, onUpdateUser }: { user: AdminUser; setView: (v: AdminView) => void; backView: AdminView; users: AdminUser[]; onViewPatients: (professional: AdminUser) => void; onUpdateUser: (u: AdminUser) => void }) {
  const [showBlock, setShowBlock] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)

  const patientFields = [
    { label: 'Plano', value: u.plan },
    { label: 'Status', value: u.status },
    { label: 'Membro desde', value: u.joined },
    { label: 'Diagnósticos', value: String(u.diags) },
    { label: 'Profissional vinculado', value: u.professional ?? 'Nenhum' },
  ]
  const professionalFields = [
    { label: 'Especialidade', value: u.especialidade ?? '—' },
    { label: 'Registro', value: u.registro ?? '—' },
    { label: 'Vínculo Hality', value: 'Profissional parceiro' },
    { label: 'Status', value: u.status },
    { label: 'Membro desde', value: u.joined },
  ]
  const adminFields = [
    { label: 'Função', value: 'Administrador do sistema' },
    { label: 'Status', value: u.status },
    { label: 'Acesso desde', value: u.joined },
  ]
  const fields = u.role === 'professional' ? professionalFields : u.role === 'admin' ? adminFields : patientFields

  const actions = [
    { icon: <Icon name="pencil" size={18} color="var(--teal-800)" />, label: 'Editar dados', bg: 'var(--teal-100)', action: () => setShowEditModal(true) },
    { icon: <Icon name="key" size={18} color="#F59E0B" />, label: 'Redefinir senha', bg: '#FEF3C7', action: () => setShowResetModal(true) },
    ...(u.role === 'professional'
      ? [{ icon: <Icon name="users" size={18} color="#7C3AED" />, label: 'Ver pacientes', bg: '#EDE9FE', action: () => onViewPatients(u) }]
      : u.role === 'patient'
      ? [
          { icon: <Icon name="chart" size={18} color="#7C3AED" />, label: 'Ver diagnósticos', bg: '#EDE9FE', action: () => setView('user-diagnostics') },
          { icon: <Icon name="medical" size={18} color="#1E40AF" />, label: 'Vincular profissional', bg: '#DBEAFE', action: () => setShowLinkModal(true) },
        ]
      : []),
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '16px 20px 24px' }}>
        <button onClick={() => setView(backView)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '8px 12px', color: '#fff', fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 16 }}>
          <Icon name="chevronLeft" size={14} color="#fff" /> Voltar
        </button>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <Avatar name={u.name} size={56} role={avatarRole(u.role)} />
          <div>
            <div style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 900, color: '#fff' }}>{u.name}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{u.email}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Badge label={roleLabel(u.role)} status={roleBadge(u.role)} />
              {u.role === 'patient' && <Badge label={u.plan} status={u.plan === 'Premium' ? 'success' : 'neutral'} />}
              {u.pending && <Badge label="Cadastro pendente" status="pending" />}
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card>
          {fields.map((f, i, arr) => (
            <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 13, color: 'var(--gray-text)' }}>{f.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--body)', fontFamily: 'Outfit' }}>{f.value}</span>
            </div>
          ))}
        </Card>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {actions.map((item, i, arr) => (
            <button key={item.label} onClick={item.action} style={{ width: '100%', display: 'flex', gap: 14, alignItems: 'center', padding: '14px 20px', background: 'none', border: 'none', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)', flex: 1 }}>{item.label}</div>
              <Icon name="chevronRight" size={16} color="var(--gray-3)" />
            </button>
          ))}
        </Card>
        <Btn full variant="danger" onClick={() => setShowBlock(true)}>
          <Icon name="noSymbol" size={16} color="#DC2626" /> Bloquear usuário
        </Btn>
      </div>
      {showBlock && (
        <Modal onClose={() => setShowBlock(false)} title="Bloquear usuário">
          <p style={{ fontSize: 14, color: 'var(--gray-text)', marginBottom: 20 }}>Confirma o bloqueio de <strong>{u.name}</strong>? O acesso ao app será suspenso.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant="secondary" onClick={() => setShowBlock(false)}>Cancelar</Btn>
            <Btn full variant="danger" onClick={() => setShowBlock(false)}>Confirmar bloqueio</Btn>
          </div>
        </Modal>
      )}
      {showEditModal && (
        <EditUserModal
          user={u}
          onClose={() => setShowEditModal(false)}
          onSave={updated => { onUpdateUser(updated); setShowEditModal(false) }}
        />
      )}
      {showResetModal && <ResetPasswordModal user={u} onClose={() => setShowResetModal(false)} />}
      {showLinkModal && (
        <LinkProfessionalModal
          patient={u}
          professionals={users.filter(x => x.role === 'professional')}
          onClose={() => setShowLinkModal(false)}
          onLink={professionalName => { onUpdateUser({ ...u, professional: professionalName }); setShowLinkModal(false) }}
        />
      )}
    </div>
  )
}

// ─── Diagnostics of a single patient ──────────────────────────────────────────
function UserDiagnostics({ patient, setView, onOpenDiag }: { patient: AdminUser; setView: (v: AdminView) => void; onOpenDiag: () => void }) {
  const diags = DIAGS.filter(d => d.user === patient.name)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '16px 20px 24px' }}>
        <button onClick={() => setView('user-detail')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '8px 12px', color: '#fff', fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 16 }}>
          <Icon name="chevronLeft" size={14} color="#fff" /> {patient.name}
        </button>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Avatar name={patient.name} size={44} />
          <div>
            <div style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 800, color: '#fff' }}>Diagnósticos</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{diags.length} exames</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {diags.length === 0
          ? <Empty icon={<Icon name="beaker" size={28} />} title="Nenhum diagnóstico" desc={`${patient.name} ainda não fez nenhum diagnóstico.`} />
          : diags.map(d => (
            <Card key={d.id} onClick={onOpenDiag} hover style={{ cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="scan" size={20} color="var(--teal-800)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: 'var(--body)' }}>Diagnóstico #{d.id}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-text)', marginBottom: 6 }}>{d.date}</div>
                <Badge label={d.status} status={statusBadge(d.status)} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <LevelChip level={d.level} size="sm" />
                {d.aiConf !== null && <span style={{ fontSize: 11, color: 'var(--gray-text)' }}>IA {d.aiConf}%</span>}
              </div>
              <Icon name="chevronRight" size={16} color="var(--gray-3)" />
            </Card>
          ))}
      </div>
    </div>
  )
}

// ─── Patients of a single professional ────────────────────────────────────────
function ProfessionalPatients({ professional, users, setView, onOpenUser }: { professional: AdminUser; users: AdminUser[]; setView: (v: AdminView) => void; onOpenUser: (u: AdminUser) => void }) {
  const myPatients = users.filter(u => u.role === 'patient' && u.professional === professional.name)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '16px 20px 24px' }}>
        <button onClick={() => setView('user-detail')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '8px 12px', color: '#fff', fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 16 }}>
          <Icon name="chevronLeft" size={14} color="#fff" /> {professional.name}
        </button>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Avatar name={professional.name} size={44} role="professional" />
          <div>
            <div style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 800, color: '#fff' }}>Pacientes</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{myPatients.length} pacientes</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {myPatients.length === 0
          ? <Empty icon={<Icon name="users" size={28} />} title="Nenhum paciente" desc={`${professional.name} ainda não tem pacientes vinculados.`} />
          : myPatients.map(p => (
            <Card key={p.id} onClick={() => onOpenUser(p)} hover style={{ cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center' }}>
              <Avatar name={p.name} size={48} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-text)', marginBottom: 6 }}>{p.email}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Badge label={p.plan} status={p.plan === 'Premium' ? 'success' : 'neutral'} />
                  <Badge label={p.status} status={p.status === 'Ativo' ? 'success' : 'warning'} />
                </div>
              </div>
              <Icon name="chevronRight" size={16} color="var(--gray-3)" />
            </Card>
          ))}
      </div>
    </div>
  )
}

// ─── Diagnostics list ─────────────────────────────────────────────────────────
const PERIODS = ['Todos', '7d', '30d', '90d'] as const
type QuickPeriod = typeof PERIODS[number]
type Period = QuickPeriod | 'custom'
type CustomRange = { start: string; end: string }
const periodDays: Record<QuickPeriod, number | null> = { Todos: null, '7d': 7, '30d': 30, '90d': 90 }
function parseBRDate(s: string): Date {
  const [d, m, y] = s.split('/').map(Number)
  return new Date(y, m - 1, d)
}
function parseISODate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
function periodLabel(p: Period, range: CustomRange | null): string {
  if (p !== 'custom') return p === 'Todos' ? 'Todos' : p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : '90 dias'
  if (range?.start && range?.end) {
    const fmt = (s: string) => { const [, m, d] = s.split('-'); return `${d}/${m}` }
    return `${fmt(range.start)}–${fmt(range.end)}`
  }
  return 'Outro período'
}
function inPeriod(dateStr: string, period: Period, range: CustomRange | null): boolean {
  if (period === 'custom') {
    if (!range?.start || !range?.end) return true
    const d = parseBRDate(dateStr)
    const end = parseISODate(range.end)
    end.setHours(23, 59, 59, 999)
    return d >= parseISODate(range.start) && d <= end
  }
  const days = periodDays[period]
  if (days === null) return true
  const diffMs = Date.now() - parseBRDate(dateStr).getTime()
  return diffMs >= 0 && diffMs <= days * 24 * 60 * 60 * 1000
}

// ─── Custom period modal ────────────────────────────────────────────────────
function CustomPeriodModal({ initial, onClose, onApply }: { initial: CustomRange | null; onClose: () => void; onApply: (r: CustomRange) => void }) {
  const [start, setStart] = useState(initial?.start ?? '')
  const [end, setEnd] = useState(initial?.end ?? '')
  return (
    <Modal onClose={onClose} title="Período personalizado">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Data início</label>
          <input type="date" value={start} onChange={e => setStart(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Data fim</label>
          <input type="date" value={end} min={start || undefined} onChange={e => setEnd(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <Btn full size="lg" disabled={!start || !end} onClick={() => onApply({ start, end })}>Aplicar</Btn>
      </div>
    </Modal>
  )
}

function DiagsList({ setView, onOpenDiag }: { setView: (v: AdminView) => void; onOpenDiag: () => void }) {
  const [filter, setFilter] = useState<'Todos' | 'Revisado' | 'Aguardando revisão'>('Todos')
  const [period, setPeriod] = useState<Period>('Todos')
  const [customRange, setCustomRange] = useState<CustomRange | null>(null)
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [selecting, setSelecting] = useState(false)
  const [selected, setSelected] = useState<number[]>([])
  const [exported, setExported] = useState(false)
  const filtered = DIAGS.filter(d => (filter === 'Todos' || d.status === filter) && inPeriod(d.date, period, customRange))

  const counts = {
    total: DIAGS.length,
    l1: DIAGS.filter(d => d.level === 1).length,
    l2: DIAGS.filter(d => d.level === 2).length,
    l3: DIAGS.filter(d => d.level === 3).length,
    pending: DIAGS.filter(d => d.status !== 'Revisado').length,
  }

  const toggleSelect = (id: number) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const exitSelecting = () => { setSelecting(false); setSelected([]); setExported(false) }
  const exportDataset = () => { setExported(true); setTimeout(() => { setExported(false); exitSelecting() }, 1400) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '20px 20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>Diagnósticos</h1>
          <button onClick={() => selecting ? exitSelecting() : setSelecting(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: selecting ? '#fff' : 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '8px 14px', color: selecting ? 'var(--teal-800)' : '#fff', fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
            {selecting ? 'Cancelar' : 'Selecionar'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 8 }}>
          {(['Todos', 'Aguardando revisão', 'Revisado'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: 999, border: 'none', background: filter === f ? '#fff' : 'rgba(255,255,255,0.15)', color: filter === f ? 'var(--teal-800)' : 'rgba(255,255,255,0.85)', fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{f}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{ padding: '6px 12px', borderRadius: 999, border: `1.5px solid ${period === p ? '#fff' : 'rgba(255,255,255,0.3)'}`, background: period === p ? 'rgba(255,255,255,0.2)' : 'transparent', color: '#fff', fontFamily: 'Outfit', fontWeight: 600, fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{periodLabel(p, null)}</button>
          ))}
          <button onClick={() => setShowCustomModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 999, border: `1.5px solid ${period === 'custom' ? '#fff' : 'rgba(255,255,255,0.3)'}`, background: period === 'custom' ? 'rgba(255,255,255,0.2)' : 'transparent', color: '#fff', fontFamily: 'Outfit', fontWeight: 600, fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <Icon name="clock" size={12} color="#fff" /> {periodLabel('custom', customRange)}
          </button>
        </div>
      </div>
      {showCustomModal && (
        <CustomPeriodModal
          initial={customRange}
          onClose={() => setShowCustomModal(false)}
          onApply={r => { setCustomRange(r); setPeriod('custom'); setShowCustomModal(false) }}
        />
      )}

      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Analytics */}
        <Card>
          <SectionHeader title="Análise geral" sub={`${counts.total} diagnósticos · ${counts.pending} aguardando revisão`} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {[
              { label: 'Normal', v: counts.l1, color: levelColor(1) },
              { label: 'Íntima', v: counts.l2, color: levelColor(2) },
              { label: 'Social', v: counts.l3, color: levelColor(3) },
            ].map(s => (
              <div key={s.label} style={{ background: s.color + '12', border: `1px solid ${s.color}30`, borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 10, color: 'var(--gray-text)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {filtered.length === 0 && (
          <Empty icon={<Icon name="beaker" size={28} />} title="Nenhum resultado" desc="Ajuste os filtros para ver mais diagnósticos." action={<Btn variant="secondary" onClick={() => { setFilter('Todos'); setPeriod('Todos') }}>Limpar filtros</Btn>} />
        )}
        {filtered.map(d => (
          <Card key={d.id} onClick={() => selecting ? toggleSelect(d.id) : onOpenDiag()} hover style={{ cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center' }}>
            {selecting && (
              <div style={{
                width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                border: `1.5px solid ${selected.includes(d.id) ? 'var(--teal-800)' : 'var(--border)'}`,
                background: selected.includes(d.id) ? 'var(--teal-800)' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {selected.includes(d.id) && <Icon name="check" size={13} color="#fff" strokeWidth={3} />}
              </div>
            )}
            <Avatar name={d.user} size={44} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: 'var(--body)' }}>{d.user}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-text)', marginBottom: 6 }}>{d.date}</div>
              <Badge label={d.status} status={statusBadge(d.status)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <LevelChip level={d.level} size="sm" />
              {d.aiConf !== null && <span style={{ fontSize: 11, color: 'var(--gray-text)' }}>IA {d.aiConf}%</span>}
            </div>
            {!selecting && <Icon name="chevronRight" size={16} color="var(--gray-3)" />}
          </Card>
        ))}
        <div style={{ height: selecting ? 76 : 8 }} />
      </div>

      {selecting && (
        <div style={{ position: 'sticky', bottom: 0, background: '#fff', borderTop: '1px solid var(--border)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: 'var(--gray-text)', flex: 1 }}>{selected.length} selecionado{selected.length !== 1 ? 's' : ''}</span>
          <Btn variant="success" disabled={selected.length === 0} onClick={exportDataset}>
            <Icon name="document" size={16} color="#fff" /> {exported ? 'Exportado!' : 'Exportar dataset'}
          </Btn>
        </div>
      )}
    </div>
  )
}

// ─── Diag detail (admin) ──────────────────────────────────────────────────────
function DiagDetailAdmin({ setView, backView }: { setView: (v: AdminView) => void; backView: AdminView }) {
  const d = DIAGS[0]
  const [anamOpen, setAnamOpen] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '16px 20px 20px' }}>
        <button onClick={() => setView(backView)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '8px 12px', color: '#fff', fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 14 }}>
          <Icon name="chevronLeft" size={14} color="#fff" /> Voltar
        </button>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Avatar name={d.user} size={44} />
          <div>
            <div style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 800, color: '#fff' }}>{d.user}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{d.date} · #{d.id}</div>
          </div>
        </div>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Outfit', fontSize: 13, color: 'var(--gray-text)', marginBottom: 8 }}>Classificação IA</div>
            <LevelChip level={d.level} size="lg" />
            <div style={{ fontSize: 12, color: 'var(--gray-text)', marginTop: 8 }}>Confiança: {d.aiConf}%</div>
          </div>
          <Badge label={d.status} status={statusBadge(d.status)} />
        </Card>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <button onClick={() => setAnamOpen(o => !o)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 20, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 14, color: 'var(--body)' }}>Anamnese</div>
            <Icon name="chevronRight" size={16} color="var(--gray-3)" style={{ transform: anamOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
          {anamOpen && (
            <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Object.entries(d.anam).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg)', borderRadius: 10 }}>
                  <span style={{ fontSize: 13, color: 'var(--gray-text)', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--body)', fontFamily: 'Outfit' }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 14, marginBottom: 12 }}>Imagem capturada</div>
          <div style={{ background: '#0a3d4a', borderRadius: 14, aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="image" size={36} color="rgba(255,255,255,0.2)" />
          </div>
        </Card>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn full variant="secondary">Exportar PDF</Btn>
          <Btn full variant="danger" size="sm">Excluir</Btn>
        </div>
      </div>
    </div>
  )
}

// ─── Content hub (Tips) ────────────────────────────────────────────────────────
// Abas de Avisos e Anamnese removidas por enquanto — Avisos ainda vai ser validado com o time
function ContentHub({ tips, onEdit, onNew }: { tips: Tip[]; onEdit: (t: Tip) => void; onNew: () => void }) {
  const tab: ContentTab = 'tips'
  const sorted = [...tips].sort((a, b) => a.order - b.order)
  const [showHomePreview, setShowHomePreview] = useState(false)
  const [showOrientationsPreview, setShowOrientationsPreview] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '20px 20px 24px' }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>Conteúdos</h1>
      </div>

      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {tab === 'tips' && (
          <>
            <Btn full variant="primary" onClick={onNew}>
              <Icon name="plus" size={16} color="#fff" /> Nova dica de saúde
            </Btn>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn full variant="secondary" onClick={() => setShowHomePreview(true)}>
                <Icon name="home" size={16} color="var(--teal-800)" /> Preview: Home
              </Btn>
              <Btn full variant="secondary" onClick={() => setShowOrientationsPreview(true)}>
                <Icon name="scan" size={16} color="var(--teal-800)" /> Preview: Classificações
              </Btn>
            </div>
            {sorted.map(tip => (
              <Card key={tip.id} hover style={{ cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center' }} onClick={() => onEdit(tip)}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: tip.pub ? 'var(--teal-100)' : 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={formatIcon(tip.format)} size={20} color={tip.pub ? 'var(--teal-800)' : 'var(--gray-3)'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{tip.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-text)', marginBottom: 4 }}>{tip.cat} · {formatLabel(tip.format)} · Ordem {tip.order}</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {tip.levels.map(l => <LevelChip key={l} level={l} size="sm" />)}
                    {tip.showOnHome && <Badge label="Na home" status="info" />}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <Badge label={tip.pub ? 'Publicado' : 'Rascunho'} status={tip.pub ? 'success' : 'neutral'} />
                  <Icon name="chevronRight" size={14} color="var(--gray-3)" />
                </div>
              </Card>
            ))}
          </>
        )}
        <div style={{ height: 8 }} />
      </div>
      {showHomePreview && <HomePreviewModal tips={tips} onClose={() => setShowHomePreview(false)} />}
      {showOrientationsPreview && <OrientationsPreviewModal tips={tips} onClose={() => setShowOrientationsPreview(false)} />}
    </div>
  )
}

/* Aba de Avisos — desativada até validar com o time
function NotificationsTab({ setView }: { setView: (v: AdminView) => void }) {
  return (
    <>
      <Btn full variant="primary" onClick={() => setView('notif-edit')}>
        <Icon name="megaphone" size={16} color="#fff" /> Novo aviso
      </Btn>
      {NOTIFS.map(n => (
        <Card key={n.id} hover style={{ cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center' }} onClick={() => setView('notif-edit')}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FCE7F3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="megaphone" size={20} color="#DB2777" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: 'var(--body)' }}>{n.title}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-text)', marginBottom: 4 }}>{n.audience}</div>
            <div style={{ fontSize: 11, color: 'var(--gray-3)' }}>Enviado: {n.sent}</div>
          </div>
          <Icon name="chevronRight" size={14} color="var(--gray-3)" />
        </Card>
      ))}
    </>
  )
}
*/

// ─── Tip editor ───────────────────────────────────────────────────────────────
function TipEditor({ tip, onSave, setView }: { tip: Tip | null; onSave: (t: Tip) => void; setView: (v: AdminView) => void }) {
  const [title, setTitle] = useState(tip?.title ?? '')
  const [body, setBody] = useState(tip?.body ?? '')
  const [cat, setCat] = useState(tip?.cat ?? '')
  const [format, setFormat] = useState<TipFormat>(tip?.format ?? 'texto')
  const [levels, setLevels] = useState<TipLevel[]>(tip?.levels ?? [])
  const [showOnHome, setShowOnHome] = useState(tip?.showOnHome ?? false)
  const [order, setOrder] = useState(tip?.order ?? 1)
  const [mediaUrl, setMediaUrl] = useState(tip?.mediaUrl ?? '')
  const [mediaName, setMediaName] = useState('')
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleLevel = (l: TipLevel) => setLevels(ls => ls.includes(l) ? ls.filter(x => x !== l) : [...ls, l])

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setMediaUrl(u => { if (u) URL.revokeObjectURL(u); return URL.createObjectURL(file) })
    setMediaName(file.name)
  }
  const removeFile = () => {
    if (mediaUrl) URL.revokeObjectURL(mediaUrl)
    setMediaUrl('')
    setMediaName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const save = (pub: boolean) => {
    onSave({
      id: tip?.id ?? Date.now(),
      title, body, cat, format, levels, showOnHome, order, pub,
      mediaUrl: format === 'texto' ? undefined : mediaUrl || undefined,
      date: tip?.date ?? 'Hoje',
      views: tip?.views ?? 0,
      iconName: tip?.iconName ?? 'lightbulb',
    })
    setSaved(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '16px 20px 20px' }}>
        <button onClick={() => setView('content')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '8px 12px', color: '#fff', fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 14 }}>
          <Icon name="chevronLeft" size={14} color="#fff" /> Conteúdos
        </button>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>{tip ? 'Editar dica' : 'Nova dica'}</h1>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Título</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título da dica..." style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Categoria</label>
            <select value={cat} onChange={e => setCat(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff' }}>
              <option value="">Selecionar categoria...</option>
              <option>Higiene</option>
              <option>Saúde</option>
              <option>Nutrição</option>
              <option>Rotina</option>
              <option>Estilo de Vida</option>
              <option>Dieta</option>
              <option>Tratamento</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Formato do conteúdo</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['texto', 'imagem', 'video'] as TipFormat[]).map(f => (
                <button key={f} type="button" onClick={() => setFormat(f)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 8px', borderRadius: 12, border: `1.5px solid ${format === f ? 'var(--teal-800)' : 'var(--border)'}`, background: format === f ? 'var(--teal-100)' : '#fff', cursor: 'pointer' }}>
                  <Icon name={formatIcon(f)} size={18} color={format === f ? 'var(--teal-800)' : 'var(--gray-3)'} />
                  <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, color: format === f ? 'var(--teal-800)' : 'var(--gray-text)' }}>{formatLabel(f)}</span>
                </button>
              ))}
            </div>
          </div>
          {format !== 'texto' && (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>{format === 'imagem' ? 'Imagem' : 'Vídeo'}</label>
              <input ref={fileInputRef} type="file" accept={format === 'imagem' ? 'image/*' : 'video/*'} onChange={pickFile} style={{ display: 'none' }} />
              {mediaUrl ? (
                <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  {format === 'imagem'
                    ? <img src={mediaUrl} alt={mediaName || 'Imagem da dica'} style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }} />
                    : <video src={mediaUrl} controls style={{ width: '100%', maxHeight: 220, display: 'block', background: '#000' }} />}
                  <button type="button" onClick={removeFile} style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Icon name="xmark" size={14} color="#fff" />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '28px 16px', borderRadius: 12, border: '1.5px dashed var(--border)', background: 'var(--bg)', cursor: 'pointer' }}>
                  <Icon name={format === 'imagem' ? 'image' : 'video'} size={24} color="var(--gray-3)" />
                  <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: 'var(--teal-800)' }}>Enviar {format === 'imagem' ? 'imagem' : 'vídeo'}</span>
                  <span style={{ fontSize: 11, color: 'var(--gray-text)' }}>Clique para selecionar um arquivo</span>
                </button>
              )}
            </div>
          )}
          <Textarea label={format === 'texto' ? 'Conteúdo' : 'Descrição / legenda'} value={body} onChange={setBody} placeholder={format === 'texto' ? 'Escreva o conteúdo da dica aqui...' : 'Descreva a imagem ou vídeo...'} rows={format === 'texto' ? 6 : 3} />
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Aparece nas orientações de</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TIP_LEVELS.map(l => (
                <button key={l} type="button" onClick={() => toggleLevel(l)} style={{ padding: '8px 14px', borderRadius: 999, border: `1.5px solid ${levels.includes(l) ? levelColor(l) : 'var(--border)'}`, background: levels.includes(l) ? levelColor(l) + '18' : '#fff', color: levels.includes(l) ? levelColor(l) : 'var(--gray-text)', fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>{levelLabel(l)}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: 'var(--body)' }}>Aparecer na home</div>
              <div style={{ fontSize: 12, color: 'var(--gray-text)' }}>Mostrar essa dica na aba inicial do paciente</div>
            </div>
            <button onClick={() => setShowOnHome(v => !v)} style={{ width: 38, height: 22, borderRadius: 999, background: showOnHome ? 'var(--teal-800)' : '#D1D5DB', border: 'none', display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer', transition: 'background 0.2s', justifyContent: showOnHome ? 'flex-end' : 'flex-start', flexShrink: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
            </button>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Ordem de exibição</label>
            <input type="number" min={1} value={order} onChange={e => setOrder(Number(e.target.value) || 1)} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            <span style={{ fontSize: 12, color: 'var(--gray-text)' }}>Números menores aparecem primeiro na home e nas orientações.</span>
          </div>
        </Card>
        {saved && (
          <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 12, padding: '12px 16px', color: '#065F46', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="checkCircle" size={16} color="#065F46" /> Dica salva com sucesso!
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn variant="secondary" onClick={() => save(false)}>Salvar rascunho</Btn>
          <Btn full variant="success" onClick={() => save(true)}>
            <Icon name="check" size={16} color="#fff" /> Publicar
          </Btn>
        </div>
      </div>
    </div>
  )
}

// ─── Notification editor ── desativado até validar com o time ────────────────
/*
function NotifEditor({ setView }: { setView: (v: AdminView) => void }) {
  const [title, setTitle] = useState('')
  const [msg, setMsg] = useState('')
  const [audience, setAudience] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '16px 20px 20px' }}>
        <button onClick={() => setView('content')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '8px 12px', color: '#fff', fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 14 }}>
          <Icon name="chevronLeft" size={14} color="#fff" /> Conteúdos
        </button>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>Novo aviso</h1>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Título</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Lembrete de diagnóstico..." style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Público-alvo</label>
            <select value={audience} onChange={e => setAudience(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff' }}>
              <option value="">Selecionar audiência...</option>
              <option>Todos usuários</option>
              <option>Todos pacientes</option>
              <option>Pacientes Premium</option>
              <option>Todos profissionais</option>
            </select>
          </div>
          <Textarea label="Mensagem" value={msg} onChange={setMsg} placeholder="Escreva a mensagem..." rows={4} />
        </Card>
        {sent && (
          <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 12, padding: '12px 16px', color: '#065F46', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="checkCircle" size={16} color="#065F46" /> Aviso enviado com sucesso!
          </div>
        )}
        <Btn full variant="primary" onClick={() => setSent(true)}>
          <Icon name="megaphone" size={16} color="#fff" /> Enviar aviso
        </Btn>
      </div>
    </div>
  )
}
*/

// ─── Admin profile ────────────────────────────────────────────────────────────
// About modal
const CREDITS = [
  { role: 'Desenvolvimento', name: 'Nome do integrante' },
  { role: 'Desenvolvimento', name: 'Nome do integrante' },
  { role: 'Design', name: 'Nome do integrante' },
  { role: 'Gestão de Produto', name: 'Nome do integrante' },
]

function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose} title="Sobre">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ textAlign: 'center' }}>
          <img src={cybIcon} alt="Check Your Breath" style={{ height: 56, objectFit: 'contain', margin: '0 auto 10px' }} />
          <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 17, color: 'var(--body)' }}>Check Your Breath</div>
          <div style={{ fontSize: 12, color: 'var(--gray-text)', marginTop: 2 }}>v1.0.0 · Protótipo</div>
        </div>

        <p style={{ fontSize: 13, color: 'var(--gray-text)', lineHeight: 1.6, margin: 0 }}>
          O Check Your Breath é um app de pré-diagnóstico de halitose desenvolvido em parceria com a Hality,
          como projeto da disciplina AGES (Ambientes e Gestão para o Desenvolvimento de Software) da PUCRS.
          A proposta é facilitar o acesso a uma triagem inicial do hálito com apoio de inteligência artificial,
          conectando pacientes a profissionais especializados para confirmação clínica.
        </p>

        <div>
          <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 13, color: 'var(--body)', marginBottom: 10 }}>Equipe AGES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CREDITS.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg)', borderRadius: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--body)', fontFamily: 'Outfit' }}>{c.name}</span>
                <span style={{ fontSize: 12, color: 'var(--gray-text)' }}>{c.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
          <img src={halityLogo} alt="Hality" style={{ height: 16, objectFit: 'contain', opacity: 0.6 }} />
          <span style={{ fontSize: 11, color: 'var(--gray-3)' }}>em parceria com Hality</span>
        </div>
      </div>
    </Modal>
  )
}

// ─── Edit profile modal ────────────────────────────────────────────────────────
function EditProfileModal({ initial, onClose, onSave }: { initial: { name: string; email: string }; onClose: () => void; onSave: (v: { name: string; email: string }) => void }) {
  const [name, setName] = useState(initial.name)
  const [email, setEmail] = useState(initial.email)

  return (
    <Modal onClose={onClose} title="Editar perfil">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Nome</label>
          <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>E-mail</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <Btn full size="lg" disabled={!name.trim() || !email.trim()} onClick={() => onSave({ name, email })}>Salvar alterações</Btn>
      </div>
    </Modal>
  )
}

// ─── Change password modal ───────────────────────────────────────────────────
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState('')
  const [next, setNextPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saved, setSaved] = useState(false)
  const mismatch = confirm.length > 0 && next !== confirm
  const canSave = current.length > 0 && next.length >= 6 && next === confirm

  return (
    <Modal onClose={onClose} title="Alterar senha">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Senha atual</label>
          <input type="password" value={current} onChange={e => setCurrent(e.target.value)} placeholder="Digite sua senha atual" style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Nova senha</label>
          <input type="password" value={next} onChange={e => setNextPw(e.target.value)} placeholder="Mínimo 6 caracteres" style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Confirmar nova senha</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repita a nova senha" style={{ width: '100%', padding: '12px 14px', border: `1.5px solid ${mismatch ? '#DC2626' : 'var(--border)'}`, borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
          {mismatch && <span style={{ fontSize: 12, color: '#DC2626' }}>As senhas não coincidem.</span>}
        </div>
        {saved && <Alert message="Senha atualizada com sucesso!" type="success" />}
        <Btn full size="lg" disabled={!canSave} onClick={() => setSaved(true)}>Atualizar senha</Btn>
      </div>
    </Modal>
  )
}

function AdminProfile({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [profile, setProfile] = useState({ name: user.name, email: user.email })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'linear-gradient(160deg, #0a3d4a 0%, #0B6B82 55%, #0d8aa6 100%)', padding: '32px 20px 52px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(22,163,74,0.1)', filter: 'blur(20px)' }} />
        <div style={{ position: 'relative' }}>
          <Avatar name={profile.name} size={72} role="admin" />
          <div style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 900, color: '#fff', marginTop: 10 }}>{profile.name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{profile.email}</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
            <Badge label="Administrador" status="danger" />
          </div>
        </div>
      </div>
      <div style={{ margin: '-20px 16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card>
          {[
            { label: 'Função', value: 'Administrador do sistema' },
            { label: 'E-mail', value: profile.email },
            { label: 'Acesso desde', value: '01/01/2026' },
          ].map((f, i, arr) => (
            <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 13, color: 'var(--gray-text)' }}>{f.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--body)', fontFamily: 'Outfit', maxWidth: '55%', textAlign: 'right' }}>{f.value}</span>
            </div>
          ))}
        </Card>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {[
            { icon: <Icon name="pencil" size={18} color="var(--teal-800)" />, label: 'Editar perfil', bg: 'var(--teal-100)', action: () => setShowEditModal(true) },
            { icon: <Icon name="key" size={18} color="#F59E0B" />, label: 'Alterar senha', bg: '#FEF3C7', action: () => setShowPasswordModal(true) },
            { icon: <Icon name="info" size={18} color="var(--gray-text)" />, label: 'Sobre', bg: 'var(--bg)', action: () => setShowAboutModal(true) },
          ].map((item, i, arr) => (
            <button key={item.label} onClick={item.action} style={{ width: '100%', display: 'flex', gap: 14, alignItems: 'center', padding: '14px 20px', background: 'none', border: 'none', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)', flex: 1 }}>{item.label}</div>
              <Icon name="chevronRight" size={16} color="var(--gray-3)" />
            </button>
          ))}
        </Card>
        {showAboutModal && <AboutModal onClose={() => setShowAboutModal(false)} />}
        {showEditModal && (
          <EditProfileModal
            initial={profile}
            onClose={() => setShowEditModal(false)}
            onSave={v => { setProfile(v); setShowEditModal(false) }}
          />
        )}
        {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
        <Btn full variant="danger" size="lg" onClick={onLogout}>
          <Icon name="signOut" size={18} color="#DC2626" /> Sair da conta
        </Btn>
        <div style={{ height: 8 }} />
      </div>
    </div>
  )
}

// ─── Shell ────────────────────────────────────────────────────────────────────
export default function AdminApp({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [view, setView] = useState<AdminView>('dashboard')
  const [tips, setTips] = useState<Tip[]>(INITIAL_TIPS)
  const [editingTip, setEditingTip] = useState<Tip | null>(null)
  const [users, setUsers] = useState<AdminUser[]>(USERS)
  const [viewedUser, setViewedUser] = useState<AdminUser>(USERS[0])
  const [viewedProfessional, setViewedProfessional] = useState<AdminUser>(USERS[0])
  const [userBackView, setUserBackView] = useState<AdminView>('users')
  const [diagBackView, setDiagBackView] = useState<AdminView>('diagnostics')
  const [usersCreateOnEntry, setUsersCreateOnEntry] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [view])

  const saveTip = (t: Tip) => {
    setTips(ts => ts.some(x => x.id === t.id) ? ts.map(x => x.id === t.id ? t : x) : [...ts, t])
    setView('content')
  }
  const openUser = (u: AdminUser, from: AdminView = 'users') => { setViewedUser(u); setUserBackView(from); setView('user-detail') }
  const openDiagDetail = (from: AdminView) => { setDiagBackView(from); setView('diag-detail') }
  const openPatientsList = (professional: AdminUser) => { setViewedProfessional(professional); setView('user-patients') }
  const goToCreateUser = () => { setUsersCreateOnEntry(true); setView('users') }
  const createUser = (name: string, email: string, role: Role) => {
    setUsers(us => [{ id: Date.now(), name, email, role, plan: 'Free', status: 'Ativo', diags: 0, joined: 'Hoje' }, ...us])
  }
  const updateUser = (updated: AdminUser) => {
    setUsers(us => us.map(x => x.id === updated.id ? updated : x))
    setViewedUser(updated)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 480, margin: '0 auto', position: 'relative' }}>
      <TopBar user={user} onProfile={() => setView('profile')} />
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: 'var(--bg)' }}>
        <div key={view} className="page-enter">
          {view === 'dashboard'   && <Dashboard user={user} users={users} tips={tips} setView={setView} onNewTip={() => { setEditingTip(null); setView('tip-edit') }} onNewUser={goToCreateUser} onOpenUser={u => openUser(u, 'dashboard')} onOpenDiag={() => openDiagDetail('dashboard')} />}
          {view === 'users'       && <UsersList users={users} onCreateUser={createUser} onOpenUser={u => openUser(u, 'users')} openCreateOnMount={usersCreateOnEntry} onConsumeCreateFlag={() => setUsersCreateOnEntry(false)} />}
          {view === 'user-detail' && <UserDetail user={viewedUser} setView={setView} backView={userBackView} users={users} onViewPatients={openPatientsList} onUpdateUser={updateUser} />}
          {view === 'user-diagnostics' && <UserDiagnostics patient={viewedUser} setView={setView} onOpenDiag={() => openDiagDetail('user-diagnostics')} />}
          {view === 'user-patients' && <ProfessionalPatients professional={viewedProfessional} users={users} setView={setView} onOpenUser={p => openUser(p, 'user-patients')} />}
          {view === 'diagnostics' && <DiagsList setView={setView} onOpenDiag={() => openDiagDetail('diagnostics')} />}
          {view === 'diag-detail' && <DiagDetailAdmin setView={setView} backView={diagBackView} />}
          {view === 'content'     && <ContentHub tips={tips} onEdit={t => { setEditingTip(t); setView('tip-edit') }} onNew={() => { setEditingTip(null); setView('tip-edit') }} />}
          {view === 'tip-edit'    && <TipEditor tip={editingTip} onSave={saveTip} setView={setView} />}
          {view === 'profile'     && <AdminProfile user={user} onLogout={onLogout} />}
        </div>
      </div>
      <BottomNav view={view} setView={setView} />
    </div>
  )
}
