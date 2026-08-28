import { useState } from 'react'
import type { AuthUser } from './AuthFlow'
import { Btn, Card, Badge, Empty, Avatar, SectionHeader, Modal, Textarea } from './shared/UI'
import { Icon } from './shared/Icons'
import cybIcon from '@/imports/Icon_CheckYourBreath.jpg'

type BadgeStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'pending'
type AdminView = 'dashboard' | 'users' | 'user-detail' | 'diagnostics' | 'diag-detail' | 'content' | 'tip-edit' | 'notif-edit' | 'profile'
type ContentTab = 'tips' | 'notifications' | 'anamnesis'

const USERS = [
  { id: 1, name: 'Ana Paula Ferreira', email: 'ana@email.com', role: 'patient', plan: 'Free', status: 'Ativo', diags: 4, joined: '10/01/2026' },
  { id: 2, name: 'Dr. Carlos Nunes', email: 'carlos@clinic.com', role: 'professional', plan: 'Premium', status: 'Ativo', diags: 0, joined: '05/03/2026' },
  { id: 3, name: 'Roberto Souza', email: 'roberto@email.com', role: 'patient', plan: 'Premium', status: 'Inativo', diags: 3, joined: '22/04/2026' },
  { id: 4, name: 'Fernanda Lima', email: 'fer@email.com', role: 'patient', plan: 'Free', status: 'Ativo', diags: 2, joined: '01/06/2026' },
  { id: 5, name: 'Dra. Mariana Rocha', email: 'mari@clinic.com', role: 'professional', plan: 'Premium', status: 'Ativo', diags: 0, joined: '15/07/2026' },
]

const DIAGS = [
  { id: 1001, user: 'Ana Paula Ferreira', date: '12/08/2026', score: 68, status: 'Revisado', aiConf: 87 },
  { id: 1002, user: 'Julia Costa', date: '10/08/2026', score: null, status: 'Processando', aiConf: null },
  { id: 1003, user: 'Carlos Mendes', date: '08/08/2026', score: 28, status: 'Revisado', aiConf: 92 },
  { id: 1004, user: 'Roberto Souza', date: '05/08/2026', score: 88, status: 'Aguardando revisão', aiConf: 79 },
  { id: 1005, user: 'Fernanda Lima', date: '01/08/2026', score: 44, status: 'Revisado', aiConf: 85 },
]

const TIPS = [
  { id: 1, title: 'Higiene lingual', cat: 'Higiene', pub: true, date: '10/08/2026', views: 1230 },
  { id: 2, title: 'Hidratação e saliva', cat: 'Saúde', pub: true, date: '08/08/2026', views: 874 },
  { id: 3, title: 'Alimentos que causam mau hálito', cat: 'Dieta', pub: false, date: '05/08/2026', views: 0 },
  { id: 4, title: 'Uso correto do fio dental', cat: 'Higiene', pub: true, date: '01/08/2026', views: 2100 },
]

const NOTIFS = [
  { id: 1, title: 'Lembre-se do seu exame diário!', type: 'reminder', sent: '12/08/2026', audience: 'Todos pacientes' },
  { id: 2, title: 'Nova funcionalidade: scan inteligente', type: 'feature', sent: '05/08/2026', audience: 'Todos usuários' },
  { id: 3, title: 'Resultado do diagnóstico disponível', type: 'update', sent: '03/08/2026', audience: 'Pacientes Premium' },
]

const ANAM_QUESTIONS = [
  { id: 1, label: 'É fumante?', type: 'Sim/Não', required: true, active: true },
  { id: 2, label: 'Frequência de escovação', type: 'Seleção', required: true, active: true },
  { id: 3, label: 'Medicações em uso', type: 'Texto livre', required: false, active: true },
  { id: 4, label: 'Sente boca seca?', type: 'Sim/Não', required: false, active: true },
  { id: 5, label: 'Doenças sistêmicas', type: 'Múltipla escolha', required: false, active: false },
]

const diagColor = (s: number | null) => s === null ? 'var(--gray-3)' : s < 33 ? '#16A34A' : s < 66 ? '#F59E0B' : '#DC2626'
const statusBadge = (status: string): BadgeStatus => status === 'Revisado' ? 'success' : status === 'Processando' ? 'neutral' : 'pending'
const roleBadge = (r: string): BadgeStatus => r === 'admin' ? 'danger' : r === 'professional' ? 'info' : 'neutral'
const roleLabel = (r: string) => r === 'admin' ? 'Admin' : r === 'professional' ? 'Profissional' : 'Paciente'

// ─── TopBar ───────────────────────────────────────────────────────────────────
function TopBar({ user, onProfile }: { user: AuthUser; onProfile: () => void }) {
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
      <div>
        <img src={cybIcon} alt="Check Your Breath" style={{ height: 22, objectFit: 'contain', display: 'block' }} />
        <span style={{ fontSize: 10, color: 'var(--teal-700)', fontFamily: 'Outfit', fontWeight: 700 }}>Admin</span>
      </div>
      <button onClick={onProfile} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <Avatar name={user.name} size={34} />
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
    (t === 'users' && view === 'user-detail') ||
    (t === 'content' && (view === 'tip-edit' || view === 'notif-edit'))

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
function Dashboard({ user, setView }: { user: AuthUser; setView: (v: AdminView) => void }) {
  const stats = [
    { v: USERS.length, label: 'usuários', icon: <Icon name="users" size={18} color="rgba(255,255,255,0.8)" /> },
    { v: DIAGS.length, label: 'diagnósticos', icon: <Icon name="beaker" size={18} color="rgba(255,255,255,0.8)" /> },
    { v: DIAGS.filter(d => d.status === 'Revisado').length, label: 'revisados', icon: <Icon name="checkCircle" size={18} color="rgba(255,255,255,0.8)" /> },
    { v: TIPS.filter(t => t.pub).length, label: 'dicas ativas', icon: <Icon name="lightbulb" size={18} color="rgba(255,255,255,0.8)" /> },
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
            { label: 'Criar dica', icon: <Icon name="lightbulb" size={20} color="#D97706" />, bg: '#FEF3C7', action: () => setView('tip-edit') },
            { label: 'Enviar aviso', icon: <Icon name="megaphone" size={20} color="#DB2777" />, bg: '#FCE7F3', action: () => setView('notif-edit') },
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
            {USERS.slice(0, 3).map((u, i) => (
              <div key={u.id} onClick={() => setView('user-detail')} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
                <Avatar name={u.name} size={36} />
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
              <div key={d.id} onClick={() => setView('diag-detail')} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="scan" size={18} color="var(--teal-800)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13 }}>{d.user}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-text)' }}>{d.date}</div>
                </div>
                {d.score !== null && <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 15, color: diagColor(d.score) }}>{d.score}</span>}
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

// ─── Users list ───────────────────────────────────────────────────────────────
function UsersList({ setView }: { setView: (v: AdminView) => void }) {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'Todos' | 'patient' | 'professional'>('Todos')
  const filtered = USERS.filter(u => (roleFilter === 'Todos' || u.role === roleFilter) && u.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '20px 20px 24px' }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>Usuários</h1>
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <Icon name="search" size={16} color="rgba(255,255,255,0.5)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome..."
            style={{ width: '100%', padding: '11px 14px 11px 40px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#fff' }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {([['Todos', 'Todos'], ['patient', 'Pacientes'], ['professional', 'Profissionais']] as const).map(([v, l]) => (
            <button key={v} onClick={() => setRoleFilter(v as typeof roleFilter)} style={{ padding: '7px 14px', borderRadius: 999, border: 'none', background: roleFilter === v ? '#fff' : 'rgba(255,255,255,0.15)', color: roleFilter === v ? 'var(--teal-800)' : 'rgba(255,255,255,0.85)', fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(u => (
          <Card key={u.id} onClick={() => setView('user-detail')} hover style={{ cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center' }}>
            <Avatar name={u.name} size={48} />
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
      </div>
    </div>
  )
}

// ─── User detail ──────────────────────────────────────────────────────────────
function UserDetail({ setView }: { setView: (v: AdminView) => void }) {
  const u = USERS[0]
  const [showBlock, setShowBlock] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '16px 20px 24px' }}>
        <button onClick={() => setView('users')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '8px 12px', color: '#fff', fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 16 }}>
          <Icon name="chevronLeft" size={14} color="#fff" /> Usuários
        </button>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <Avatar name={u.name} size={56} />
          <div>
            <div style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 900, color: '#fff' }}>{u.name}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{u.email}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Badge label={roleLabel(u.role)} status={roleBadge(u.role)} />
              <Badge label={u.plan} status={u.plan === 'Premium' ? 'success' : 'neutral'} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card>
          {[
            { label: 'Plano', value: u.plan },
            { label: 'Status', value: u.status },
            { label: 'Membro desde', value: u.joined },
            { label: 'Diagnósticos', value: String(u.diags) },
          ].map((f, i, arr) => (
            <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 13, color: 'var(--gray-text)' }}>{f.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--body)', fontFamily: 'Outfit' }}>{f.value}</span>
            </div>
          ))}
        </Card>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {[
            { icon: <Icon name="pencil" size={18} color="var(--teal-800)" />, label: 'Editar dados', bg: 'var(--teal-100)' },
            { icon: <Icon name="key" size={18} color="#F59E0B" />, label: 'Redefinir senha', bg: '#FEF3C7' },
            { icon: <Icon name="chart" size={18} color="#7C3AED" />, label: 'Ver diagnósticos', bg: '#EDE9FE', action: () => setView('diagnostics') },
          ].map((item, i, arr) => (
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
    </div>
  )
}

// ─── Diagnostics list ─────────────────────────────────────────────────────────
function DiagsList({ setView }: { setView: (v: AdminView) => void }) {
  const [filter, setFilter] = useState<'Todos' | 'Revisado' | 'Aguardando revisão'>('Todos')
  const filtered = DIAGS.filter(d => filter === 'Todos' || d.status === filter)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '20px 20px 24px' }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>Diagnósticos</h1>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {(['Todos', 'Aguardando revisão', 'Revisado'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: 999, border: 'none', background: filter === f ? '#fff' : 'rgba(255,255,255,0.15)', color: filter === f ? 'var(--teal-800)' : 'rgba(255,255,255,0.85)', fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(d => (
          <Card key={d.id} onClick={() => setView('diag-detail')} hover style={{ cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center' }}>
            <Avatar name={d.user} size={44} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: 'var(--body)' }}>{d.user}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-text)', marginBottom: 6 }}>{d.date}</div>
              <Badge label={d.status} status={statusBadge(d.status)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              {d.score !== null && <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 20, color: diagColor(d.score) }}>{d.score}</span>}
              {d.aiConf !== null && <span style={{ fontSize: 11, color: 'var(--gray-text)' }}>IA {d.aiConf}%</span>}
            </div>
            <Icon name="chevronRight" size={16} color="var(--gray-3)" />
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Diag detail (admin) ──────────────────────────────────────────────────────
function DiagDetailAdmin({ setView }: { setView: (v: AdminView) => void }) {
  const d = DIAGS[0]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '16px 20px 20px' }}>
        <button onClick={() => setView('diagnostics')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '8px 12px', color: '#fff', fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 14 }}>
          <Icon name="chevronLeft" size={14} color="#fff" /> Diagnósticos
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
            <div style={{ fontFamily: 'Outfit', fontSize: 13, color: 'var(--gray-text)', marginBottom: 4 }}>Score IA</div>
            <div style={{ fontFamily: 'Outfit', fontSize: 36, fontWeight: 900, color: diagColor(d.score) }}>{d.score}</div>
            <div style={{ fontSize: 12, color: 'var(--gray-text)', marginTop: 2 }}>Confiança: {d.aiConf}%</div>
          </div>
          <Badge label={d.status} status={statusBadge(d.status)} />
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

// ─── Content hub (Tips + Notifications + Anamnesis) ───────────────────────────
function ContentHub({ setView }: { setView: (v: AdminView) => void }) {
  const [tab, setTab] = useState<ContentTab>('tips')
  const [anamQuestions, setAnamQuestions] = useState(ANAM_QUESTIONS)

  const toggleAnam = (id: number) => setAnamQuestions(qs => qs.map(q => q.id === id ? { ...q, active: !q.active } : q))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '20px 20px 24px' }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 14px' }}>Conteúdos</h1>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: 4, gap: 2 }}>
          {([['tips', 'Dicas'], ['notifications', 'Avisos'], ['anamnesis', 'Anamnese']] as [ContentTab, string][]).map(([v, l]) => (
            <button key={v} onClick={() => setTab(v)} style={{ flex: 1, padding: '9px 6px', borderRadius: 9, border: 'none', background: tab === v ? '#fff' : 'transparent', color: tab === v ? 'var(--teal-800)' : 'rgba(255,255,255,0.8)', fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {tab === 'tips' && (
          <>
            <Btn full variant="primary" onClick={() => setView('tip-edit')}>
              <Icon name="plus" size={16} color="#fff" /> Nova dica de saúde
            </Btn>
            {TIPS.map(tip => (
              <Card key={tip.id} hover style={{ cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center' }} onClick={() => setView('tip-edit')}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: tip.pub ? 'var(--teal-100)' : 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="lightbulb" size={20} color={tip.pub ? 'var(--teal-800)' : 'var(--gray-3)'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{tip.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-text)', marginBottom: 4 }}>{tip.cat} · {tip.date}</div>
                  {tip.pub && <span style={{ fontSize: 11, color: 'var(--gray-text)' }}>{tip.views} visualizações</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <Badge label={tip.pub ? 'Publicado' : 'Rascunho'} status={tip.pub ? 'success' : 'neutral'} />
                  <Icon name="chevronRight" size={14} color="var(--gray-3)" />
                </div>
              </Card>
            ))}
          </>
        )}

        {tab === 'notifications' && (
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
        )}

        {tab === 'anamnesis' && (
          <>
            <div style={{ padding: '0 2px 4px' }}>
              <p style={{ fontSize: 13, color: 'var(--gray-text)', margin: 0 }}>Configure as perguntas do questionário exibido antes do diagnóstico.</p>
            </div>
            {anamQuestions.map(q => (
              <Card key={q.id} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: q.active ? 'var(--teal-100)' : 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="clipboard" size={16} color={q.active ? 'var(--teal-800)' : 'var(--gray-3)'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: 'var(--body)' }}>{q.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-text)' }}>{q.type}{q.required ? ' · Obrigatório' : ''}</div>
                </div>
                <button onClick={() => toggleAnam(q.id)} style={{ width: 38, height: 22, borderRadius: 999, background: q.active ? 'var(--teal-800)' : '#D1D5DB', border: 'none', display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer', transition: 'background 0.2s', justifyContent: q.active ? 'flex-end' : 'flex-start' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </button>
              </Card>
            ))}
            <Btn variant="secondary" full>
              <Icon name="plus" size={16} color="var(--teal-800)" /> Adicionar pergunta
            </Btn>
          </>
        )}
        <div style={{ height: 8 }} />
      </div>
    </div>
  )
}

// ─── Tip editor ───────────────────────────────────────────────────────────────
function TipEditor({ setView }: { setView: (v: AdminView) => void }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [cat, setCat] = useState('')
  const [saved, setSaved] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '16px 20px 20px' }}>
        <button onClick={() => setView('content')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '8px 12px', color: '#fff', fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 14 }}>
          <Icon name="chevronLeft" size={14} color="#fff" /> Conteúdos
        </button>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>Nova dica</h1>
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
              <option>Dieta</option>
              <option>Tratamento</option>
            </select>
          </div>
          <Textarea label="Conteúdo" value={body} onChange={setBody} placeholder="Escreva o conteúdo da dica aqui..." rows={6} />
        </Card>
        {saved && (
          <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 12, padding: '12px 16px', color: '#065F46', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="checkCircle" size={16} color="#065F46" /> Dica salva com sucesso!
          </div>
        )}
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn variant="secondary" onClick={() => setSaved(true)}>Salvar rascunho</Btn>
          <Btn full variant="success" onClick={() => setSaved(true)}>
            <Icon name="check" size={16} color="#fff" /> Publicar
          </Btn>
        </div>
      </div>
    </div>
  )
}

// ─── Notification editor ──────────────────────────────────────────────────────
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

// ─── Admin profile ────────────────────────────────────────────────────────────
function AdminProfile({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'linear-gradient(160deg, #0a3d4a 0%, #0B6B82 55%, #0d8aa6 100%)', padding: '32px 20px 52px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(22,163,74,0.1)', filter: 'blur(20px)' }} />
        <div style={{ position: 'relative' }}>
          <Avatar name={user.name} size={72} />
          <div style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 900, color: '#fff', marginTop: 10 }}>{user.name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{user.email}</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
            <Badge label="Administrador" status="danger" />
          </div>
        </div>
      </div>
      <div style={{ margin: '-20px 16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card>
          {[
            { label: 'Função', value: 'Administrador do sistema' },
            { label: 'E-mail', value: user.email },
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
            { icon: <Icon name="key" size={18} color="#F59E0B" />, label: 'Alterar senha', bg: '#FEF3C7' },
            { icon: <Icon name="gear" size={18} color="var(--gray-text)" />, label: 'Configurações', bg: 'var(--bg)' },
          ].map((item, i) => (
            <div key={item.label} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '14px 20px', borderBottom: i === 0 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)', flex: 1 }}>{item.label}</div>
              <Icon name="chevronRight" size={16} color="var(--gray-3)" />
            </div>
          ))}
        </Card>
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 480, margin: '0 auto', position: 'relative' }}>
      <TopBar user={user} onProfile={() => setView('profile')} />
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: 'var(--bg)' }}>
        {view === 'dashboard'   && <Dashboard user={user} setView={setView} />}
        {view === 'users'       && <UsersList setView={setView} />}
        {view === 'user-detail' && <UserDetail setView={setView} />}
        {view === 'diagnostics' && <DiagsList setView={setView} />}
        {view === 'diag-detail' && <DiagDetailAdmin setView={setView} />}
        {view === 'content'     && <ContentHub setView={setView} />}
        {view === 'tip-edit'    && <TipEditor setView={setView} />}
        {view === 'notif-edit'  && <NotifEditor setView={setView} />}
        {view === 'profile'     && <AdminProfile user={user} onLogout={onLogout} />}
      </div>
      <BottomNav view={view} setView={setView} />
    </div>
  )
}
