import { useState, useRef, useEffect } from 'react'
import type { AuthUser } from './AuthFlow'
import { Btn, Card, Badge, Empty, Avatar, SectionHeader, Textarea, ScanLoader, Modal, Alert } from './shared/UI'
import { Icon } from './shared/Icons'
import { TIPS, type Tip } from './shared/tips'
import cybIcon from '@/imports/Icon_CheckYourBreath.png'
import halityLogo from '@/imports/Logo-Hality-rncwhngo9oo4u9tdlspy0644l1cpwnm78navwjh0jk.png'

type BadgeStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'pending'
type ProfView = 'dashboard' | 'diagnostics' | 'diag-detail' | 'patients' | 'patient-detail' | 'evaluate' | 'profile'

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

const DIAGS: { id: number; patient: string; date: string; level: Level | null; status: string; aiConf: number | null; anam: Record<string, string> }[] = [
  { id: 101, patient: 'Ana Paula Ferreira', date: '12/08/2026', level: 2, status: 'Aguardando revisão', aiConf: 87, anam: { fumante: 'Não', escovacao: '2x ao dia', medicacao: 'Nenhuma', bocaSeca: 'Sim' } },
  { id: 102, patient: 'Julia Costa', date: '10/08/2026', level: null, status: 'Processando', aiConf: null, anam: { fumante: 'Sim', escovacao: '1x ao dia', medicacao: 'Omeprazol', bocaSeca: 'Não' } },
  { id: 103, patient: 'Carlos Mendes', date: '08/08/2026', level: 1, status: 'Revisado', aiConf: 92, anam: { fumante: 'Não', escovacao: '3x ao dia', medicacao: 'Anti-hipertensivo', bocaSeca: 'Não' } },
  { id: 104, patient: 'Roberto Souza', date: '05/08/2026', level: 3, status: 'Aguardando revisão', aiConf: 79, anam: { fumante: 'Sim', escovacao: '1x ao dia', medicacao: 'Nenhuma', bocaSeca: 'Sim' } },
  { id: 105, patient: 'Fernanda Lima', date: '01/08/2026', level: 2, status: 'Revisado', aiConf: 85, anam: { fumante: 'Não', escovacao: '2x ao dia', medicacao: 'Nenhuma', bocaSeca: 'Não' } },
]

type Patient = { id: number; name: string; email: string; diags: number; lastDate: string; lastLevel: Level | null; pending?: boolean }

const INITIAL_PATIENTS: Patient[] = [
  { id: 1, name: 'Ana Paula Ferreira', email: 'ana@email.com', diags: 4, lastDate: '12/08/2026', lastLevel: 2 },
  { id: 2, name: 'Julia Costa', email: 'julia@email.com', diags: 1, lastDate: '10/08/2026', lastLevel: null },
  { id: 3, name: 'Carlos Mendes', email: 'carlos@email.com', diags: 7, lastDate: '08/08/2026', lastLevel: 1 },
  { id: 4, name: 'Roberto Souza', email: 'roberto@email.com', diags: 3, lastDate: '05/08/2026', lastLevel: 3 },
  { id: 5, name: 'Fernanda Lima', email: 'fernanda@email.com', diags: 2, lastDate: '01/08/2026', lastLevel: 2 },
]

const statusBadge = (status: string): BadgeStatus => status === 'Revisado' ? 'success' : status === 'Processando' ? 'neutral' : 'pending'

// ─── Tip card (texto / imagem / vídeo) ──────────────────────────────────────
function TipCard({ tip }: { tip: Tip }) {
  return (
    <Card style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{ width: 44, height: 44, borderRadius: 13, background: 'var(--teal-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-800)', flexShrink: 0 }}>
        <Icon name={tip.iconName} size={22} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{tip.title}</span>
          <span style={{ fontSize: 10, fontFamily: 'Outfit', fontWeight: 600, color: 'var(--teal-800)', background: 'var(--teal-100)', borderRadius: 999, padding: '2px 8px' }}>{tip.cat}</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--gray-text)', lineHeight: 1.5, margin: 0 }}>{tip.body}</p>
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

// ─── TopBar ───────────────────────────────────────────────────────────────────
function TopBar({ user, onProfile }: { user: AuthUser; onProfile: () => void }) {
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
      <div>
        <img src={cybIcon} alt="Check Your Breath" style={{ height: 22, objectFit: 'contain', display: 'block' }} />
        <span style={{ fontSize: 10, color: 'var(--gray-text)', fontFamily: 'Outfit', fontWeight: 600 }}>Profissional</span>
      </div>
      <button onClick={onProfile} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <Avatar name={user.name} size={34} role="professional" />
      </button>
    </div>
  )
}

// ─── BottomNav ────────────────────────────────────────────────────────────────
function BottomNav({ view, setView }: { view: ProfView; setView: (v: ProfView) => void }) {
  const tabs: { v: ProfView; icon: React.ReactNode; label: string }[] = [
    { v: 'dashboard',   icon: <Icon name="chart" size={22} />,  label: 'Início' },
    { v: 'diagnostics', icon: <Icon name="beaker" size={22} />, label: 'Diagnósticos' },
    { v: 'patients',    icon: <Icon name="users" size={22} />,  label: 'Pacientes' },
    { v: 'profile',     icon: <Icon name="person" size={22} />, label: 'Perfil' },
  ]
  const active = (v: ProfView) =>
    view === v ||
    (v === 'diagnostics' && view === 'diag-detail') ||
    (v === 'patients' && (view === 'patient-detail' || view === 'evaluate'))
  return (
    <nav style={{ background: '#fff', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '10px 8px 26px', flexShrink: 0 }}>
      {tabs.map(t => (
        <button key={t.v} onClick={() => setView(t.v)} style={{ flex: 1, display: 'flex', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: active(t.v) ? '#E8E8ED' : 'transparent', borderRadius: 14, padding: active(t.v) ? '8px 18px' : '8px 10px', color: active(t.v) ? 'var(--body)' : 'var(--gray-3)', transition: 'all 0.2s', minWidth: active(t.v) ? 80 : undefined }}>
            {t.icon}
            <span style={{ fontSize: 11, fontFamily: 'Outfit', fontWeight: active(t.v) ? 700 : 500, whiteSpace: 'nowrap' }}>{t.label}</span>
          </div>
        </button>
      ))}
    </nav>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ user, patients, setView, onOpenDiag, onEvaluate }: { user: AuthUser; patients: Patient[]; setView: (v: ProfView) => void; onOpenDiag: (from: ProfView) => void; onEvaluate: (p: Patient | null) => void }) {
  const pending = DIAGS.filter(d => d.status === 'Aguardando revisão')
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg, #0a3d4a 0%, #0B6B82 55%, #0d8aa6 100%)', padding: '24px 20px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(13,138,166,0.25)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: '0 0 2px', position: 'relative' }}>Olá,</p>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 900, color: '#fff', margin: '0 0 20px', letterSpacing: -0.5, position: 'relative' }}>{user.name.split(' ').slice(0, 2).join(' ')}</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, position: 'relative', marginBottom: 18 }}>
          {[
            { v: String(pending.length), label: 'para revisar', icon: <Icon name="clock" size={18} color="rgba(255,255,255,0.8)" /> },
            { v: '12', label: 'revisados', icon: <Icon name="checkCircle" size={18} color="rgba(255,255,255,0.8)" /> },
            { v: String(patients.length), label: 'pacientes', icon: <Icon name="users" size={18} color="rgba(255,255,255,0.8)" /> },
            { v: String(DIAGS.length), label: 'diagnósticos', icon: <Icon name="beaker" size={18} color="rgba(255,255,255,0.8)" /> },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 16, padding: '14px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
              {s.icon}
              <div>
                <div style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA — avaliar paciente */}
        <button onClick={() => onEvaluate(null)} style={{
          position: 'relative',
          width: '100%',
          background: 'linear-gradient(175.28deg, rgb(68, 191, 173) 8.49%, rgb(9, 76, 94) 82.33%)',
          boxShadow: '0px 6px 24px 0px rgba(22,163,74,0.35)',
          borderRadius: 18,
          border: 'none',
          padding: '18px 20px',
          display: 'flex',
          gap: 14,
          alignItems: 'center',
          cursor: 'pointer',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -12, right: -12, width: 90, height: 90, borderRadius: 45, background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name="camera" size={22} color="#fff" />
          </div>
          <div style={{ flex: 1, textAlign: 'left', position: 'relative' }}>
            <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 16, color: '#fff', lineHeight: '24px' }}>Avaliar paciente</div>
            <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: '18px', marginTop: 2 }}>Anamnese + captura de imagem</div>
          </div>
          <Icon name="chevronRight" size={18} color="rgba(255,255,255,0.8)" />
        </button>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Pending */}
        {pending.length > 0 && (
          <Card>
            <SectionHeader title="Aguardando revisão" sub={`${pending.length} diagnósticos`} action={<Btn variant="secondary" size="sm" onClick={() => setView('diagnostics')}>Ver todos</Btn>} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pending.slice(0, 2).map(d => (
                <div
                  key={d.id}
                  style={{
                    background: '#FEF3C7',
                    borderRadius: 12,
                    padding: '12px 14px',
                    border: '1px solid #FCD34D'
                  }}
                >
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <Avatar name={d.patient} size={36} />
              
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: 'Outfit',
                        fontWeight: 700,
                        fontSize: 14,
                        color: 'var(--body)'
                      }}>
                        {d.patient}
                      </div>
              
                      <div style={{ fontSize: 12, color: 'var(--gray-text)' }}>
                        {d.date}
                      </div>
                    </div>
              
                    {d.level !== null && (
                      <LevelChip level={d.level} size="sm" />
                    )}
                  </div>
                  <Btn
                    variant="primary"
                    size="sm"
                    onClick={() => onOpenDiag('dashboard')}
                    style={{ marginTop: 10, width: '100%' }}
                  >
                    Revisar
                  </Btn>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recent */}
        <Card>
          <SectionHeader title="Últimos diagnósticos" action={<Btn variant="ghost" size="sm" onClick={() => setView('diagnostics')}>Ver todos</Btn>} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {DIAGS.slice(0, 4).map((d, i) => (
              <div key={d.id} onClick={() => onOpenDiag('dashboard')} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
                <Avatar name={d.patient} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: 'var(--body)' }}>{d.patient}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-text)' }}>{d.date}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  {d.level !== null && <LevelChip level={d.level} size="sm" />}
                  <Badge label={d.status} status={statusBadge(d.status)} />
                </div>
              </div>
            ))}
          </div>
        </Card>
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

function DiagnosticsList({ setView, onOpenDiag }: { setView: (v: ProfView) => void; onOpenDiag: (from: ProfView) => void }) {
  const [filter, setFilter] = useState<'Todos' | 'Aguardando revisão' | 'Revisado'>('Todos')
  const [period, setPeriod] = useState<Period>('Todos')
  const [customRange, setCustomRange] = useState<CustomRange | null>(null)
  const [showCustomModal, setShowCustomModal] = useState(false)
  const filtered = DIAGS.filter(d => (filter === 'Todos' || d.status === filter) && inPeriod(d.date, period, customRange))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '20px 20px 24px' }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>Diagnósticos</h1>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, marginBottom: 8 }}>
          {(['Todos', 'Aguardando revisão', 'Revisado'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: 999, border: 'none', background: filter === f ? '#fff' : 'rgba(255,255,255,0.15)', color: filter === f ? 'var(--teal-800)' : 'rgba(255,255,255,0.85)', fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{f}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
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
        {filtered.length === 0
          ? <Empty icon={<Icon name="beaker" size={28} />} title="Nenhum resultado" desc="Ajuste os filtros para ver mais diagnósticos." action={<Btn variant="secondary" onClick={() => { setFilter('Todos'); setPeriod('Todos') }}>Limpar filtros</Btn>} />
          : filtered.map(d => (
            <Card key={d.id} onClick={() => onOpenDiag('diagnostics')} hover style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <Avatar name={d.patient} size={44} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{d.patient}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-text)', marginBottom: 6 }}>{d.date}</div>
                  <Badge label={d.status} status={statusBadge(d.status)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  {d.level !== null
                    ? <LevelChip level={d.level} size="sm" />
                    : <Icon name="clock" size={20} color="var(--gray-3)" />}
                  {d.aiConf && <span style={{ fontSize: 11, color: 'var(--gray-text)' }}>IA {d.aiConf}%</span>}
                </div>
                <Icon name="chevronRight" size={16} color="var(--gray-3)" />
              </div>
            </Card>
          ))}
      </div>
    </div>
  )
}

// ─── Diagnostic review ────────────────────────────────────────────────────────
function DiagnosticReview({ setView, backView }: { setView: (v: ProfView) => void; backView: ProfView }) {
  const d = DIAGS[0]
  const [classif, setClassif] = useState<Level | ''>('')
  const [obs, setObs] = useState('')
  const [saved, setSaved] = useState(false)
  const [anamOpen, setAnamOpen] = useState(false)
  const [detailTab, setDetailTab] = useState<'detalhes' | 'orientacoes'>('detalhes')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '16px 20px 20px' }}>
        <button onClick={() => setView(backView)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '8px 12px', color: '#fff', fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 14 }}>
          <Icon name="chevronLeft" size={14} color="#fff" /> Voltar
        </button>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Avatar name={d.patient} size={44} />
          <div>
            <div style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 800, color: '#fff' }}>{d.patient}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{d.date} · Diagnóstico #{d.id}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 12, padding: 4, gap: 2 }}>
          {([['detalhes', 'Detalhes'], ['orientacoes', 'Orientações']] as const).map(([v, l]) => (
            <button key={v} onClick={() => setDetailTab(v)} style={{ flex: 1, padding: '9px 6px', borderRadius: 9, border: 'none', background: detailTab === v ? '#fff' : 'transparent', boxShadow: detailTab === v ? 'var(--shadow-sm)' : 'none', color: detailTab === v ? 'var(--teal-800)' : 'var(--gray-text)', fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {detailTab === 'orientacoes' && (
          d.level === null
            ? <Empty icon={<Icon name="lightbulb" size={28} />} title="Ainda sem orientações" desc="As orientações aparecem depois que o diagnóstico for classificado." />
            : (() => {
                const relevant = TIPS.filter(t => t.pub && t.levels.includes(d.level as 1 | 2 | 3)).sort((a, b) => a.order - b.order)
                return relevant.length === 0
                  ? <Empty icon={<Icon name="lightbulb" size={28} />} title="Nenhuma orientação cadastrada" desc="Ainda não há dicas para essa classificação." />
                  : relevant.map(tip => <TipCard key={tip.id} tip={tip} />)
              })()
        )}
        {detailTab === 'detalhes' && (
        <>
        {/* IA result */}
        <Card style={{ background: 'linear-gradient(135deg,rgba(11,107,130,0.05),rgba(22,163,74,0.04))', border: '1px solid rgba(11,107,130,0.12)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--teal-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-800)' }}>
              <Icon name="sparkles" size={16} />
            </div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 14, color: 'var(--teal-800)' }}>Resultado da IA</div>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: levelColor(d.level) + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="scan" size={28} color={levelColor(d.level)} />
            </div>
            <div>
              <div style={{ marginBottom: 6 }}><LevelChip level={d.level} size="md" /></div>
              <div style={{ fontSize: 12, color: 'var(--gray-text)', marginBottom: 6 }}>Confiança: {d.aiConf}%</div>
              <div style={{ height: 5, background: 'var(--teal-100)', borderRadius: 999, width: 120, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${d.aiConf}%`, background: 'var(--teal-800)', borderRadius: 999 }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Anamnese */}
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

        {/* Image placeholder */}
        <Card>
          <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 14, color: 'var(--body)', marginBottom: 12 }}>Imagem capturada</div>
          <div style={{ background: '#0a3d4a', borderRadius: 14, aspectRatio: '4/3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Icon name="image" size={36} color="rgba(255,255,255,0.2)" />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'Outfit' }}>Imagem capturada · {d.date}</span>
          </div>
        </Card>

        {/* Review form */}
        <Card style={{ border: '2px solid var(--teal-800)' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--teal-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-800)' }}>
              <Icon name="medical" size={16} />
            </div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 15, color: 'var(--teal-800)' }}>Sua avaliação</div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Classificação confirmada</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {([1, 2, 3] as Level[]).map(l => (
                <button key={l} type="button" onClick={() => setClassif(l)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12, border: `2px solid ${classif === l ? levelColor(l) : 'var(--border)'}`, background: classif === l ? levelColor(l) + '10' : '#fff', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: levelColor(l), flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{l} — {levelLabel(l)}</span>
                </button>
              ))}
            </div>
          </div>
          <Textarea label="Observações e recomendações" value={obs} onChange={setObs} placeholder="Descreva suas observações clínicas..." rows={4} />
          {saved && (
            <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 12, padding: '10px 14px', color: '#065F46', fontSize: 13, fontWeight: 600, marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="checkCircle" size={16} color="#065F46" /> Revisão salva e enviada ao paciente!
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <Btn variant="secondary" onClick={() => setView(backView)}>Cancelar</Btn>
            <Btn full variant="success" onClick={() => setSaved(true)}><Icon name="check" size={16} color="#fff" /> Salvar revisão</Btn>
          </div>
        </Card>
        </>
        )}
        <div style={{ height: 8 }} />
      </div>
    </div>
  )
}

// ─── Patients list ────────────────────────────────────────────────────────────
function PatientsList({ patients, onEvaluate, onViewPatient }: { patients: Patient[]; onEvaluate: (p: Patient | null) => void; onViewPatient: (p: Patient) => void }) {
  const [search, setSearch] = useState('')
  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '20px 20px 24px' }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>Pacientes</h1>
        <div style={{ position: 'relative' }}>
          <Icon name="search" size={16} color="rgba(255,255,255,0.5)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar paciente..."
            style={{ width: '100%', padding: '12px 14px 12px 40px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#fff' }}
          />
        </div>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Btn full variant="primary" onClick={() => onEvaluate(null)}>
          <Icon name="camera" size={16} color="#fff" /> Avaliar paciente
        </Btn>
        {filtered.map(p => (
          <Card key={p.id} onClick={() => onViewPatient(p)} hover style={{ cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center' }}>
            <Avatar name={p.name} size={48} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-text)', marginBottom: 4 }}>{p.email}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-text)' }}>{p.diags} diagnósticos · último {p.lastDate}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              {p.pending && <Badge label="Cadastro pendente" status="pending" />}
              {p.lastLevel !== null && <LevelChip level={p.lastLevel} size="sm" />}
              <Icon name="chevronRight" size={16} color="var(--gray-3)" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Patient detail ───────────────────────────────────────────────────────────
function PatientDetail({ patient: p, setView, onOpenDiag, onEvaluate }: { patient: Patient; setView: (v: ProfView) => void; onOpenDiag: (from: ProfView) => void; onEvaluate: (p: Patient | null) => void }) {
  const pDiags = DIAGS.filter(d => d.patient === p.name)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '16px 20px 24px' }}>
        <button onClick={() => setView('patients')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '8px 12px', color: '#fff', fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 16 }}>
          <Icon name="chevronLeft" size={14} color="#fff" /> Pacientes
        </button>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <Avatar name={p.name} size={56} />
          <div>
            <div style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 900, color: '#fff' }}>{p.name}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{p.email}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <Badge label="Usuário Free" status="info" />
              <Badge label="Ativo" status="success" />
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Btn full variant="primary" onClick={() => onEvaluate(p)}>
          <Icon name="camera" size={16} color="#fff" /> Avaliar este paciente
        </Btn>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[{ label: 'Total exames', value: p.diags }, { label: 'Último exame', value: p.lastDate }].map(item => (
            <Card key={item.label} style={{ padding: '14px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 900, color: 'var(--teal-800)' }}>{item.value}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-text)', marginTop: 2 }}>{item.label}</div>
            </Card>
          ))}
        </div>
        <SectionHeader title="Histórico de diagnósticos" sub={`${pDiags.length} exames`} />
        {pDiags.map(d => (
          <Card key={d.id} onClick={() => onOpenDiag('patient-detail')} hover style={{ cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#0a3d4a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="scan" size={20} color="rgba(255,255,255,0.7)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14 }}>Diagnóstico #{d.id}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-text)' }}>{d.date}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              {d.level !== null && <LevelChip level={d.level} size="sm" />}
              <Badge label={d.status} status={statusBadge(d.status)} />
            </div>
            <Icon name="chevronRight" size={16} color="var(--gray-3)" />
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Avaliar paciente (Selecionar → Anamnese → Foto → Revisão) ────────────────
const EVAL_STEPS = ['Paciente', 'Anamnese', 'Captura', 'Revisão']

function EvaluatePatient({ patients, onAddPatient, setView, initialPatient, onFinishToPatient }: { patients: Patient[]; onAddPatient: (p: Patient) => void; setView: (v: ProfView) => void; initialPatient: Patient | null; onFinishToPatient: (p: Patient) => void }) {
  const [step, setStep] = useState(initialPatient ? 1 : 0)
  const [search, setSearch] = useState('')
  const [patient, setPatient] = useState<Patient | null>(initialPatient)

  const [addingNew, setAddingNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')

  const [percebe, setPercebe] = useState('')
  const [escovacao, setEscovacao] = useState('')
  const [fumante, setFumante] = useState('')
  const [medicacao, setMedicacao] = useState('')
  const [higiene, setHigiene] = useState<number | null>(null)

  const [processing, setProcessing] = useState(false)
  const [aiLevel, setAiLevel] = useState<Level>(2)
  const [aiConf, setAiConf] = useState(0)
  const [classif, setClassif] = useState<Level | ''>('')
  const [obs, setObs] = useState('')
  const [saved, setSaved] = useState(false)

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  const anamPreenchida = percebe && escovacao && fumante && higiene !== null
  const novoPacienteValido = newName.trim() && newEmail.trim().includes('@')

  const registerPatient = () => {
    const created: Patient = {
      id: Date.now(),
      name: newName.trim(),
      email: newEmail.trim(),
      diags: 0,
      lastDate: '—',
      lastLevel: null,
      pending: true,
    }
    onAddPatient(created)
    setPatient(created)
    setAddingNew(false)
    setNewName('')
    setNewEmail('')
    setNewPhone('')
    setStep(1)
  }

  const capture = () => {
    setProcessing(true)
    const simLevel = ((Math.floor(Math.random() * 3) + 1) as Level)
    const simConf = 78 + Math.floor(Math.random() * 18)
    setTimeout(() => {
      setAiLevel(simLevel)
      setAiConf(simConf)
      setClassif(simLevel)
      setProcessing(false)
      setStep(3)
    }, 1400)
  }

  const back = () => {
    if (step === 0 && addingNew) return setAddingNew(false)
    return step > 0 ? setStep(s => s - 1) : setView('dashboard')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', background: 'var(--bg)' }}>
      <div style={{ background: '#fff', padding: '14px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={back} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--teal-800)', display: 'flex', padding: 4, flexShrink: 0 }}>
          <Icon name="chevronLeft" size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {EVAL_STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < EVAL_STEPS.length - 1 ? 1 : 'unset' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: i < step ? 'var(--green-600)' : i === step ? 'var(--teal-800)' : 'var(--border)', color: i <= step ? '#fff' : 'var(--gray-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit', fontWeight: 800, fontSize: 10, flexShrink: 0 }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 8, color: i <= step ? 'var(--teal-800)' : 'var(--gray-3)', fontWeight: i <= step ? 700 : 400, whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < EVAL_STEPS.length - 1 && <div style={{ flex: 1, height: 1.5, background: i < step ? 'var(--green-600)' : 'var(--border)', margin: '0 3px 12px' }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>
        {/* 0 — Selecionar paciente */}
        {step === 0 && !addingNew && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <h2 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 800, color: 'var(--body)', margin: '0 0 4px' }}>Selecionar paciente</h2>
              <p style={{ fontSize: 13, color: 'var(--gray-text)', margin: 0 }}>Quem você vai avaliar agora?</p>
            </div>
            <div style={{ position: 'relative' }}>
              <Icon name="search" size={16} color="var(--gray-3)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar paciente..."
                style={{ width: '100%', padding: '12px 14px 12px 40px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: 'var(--body)', background: '#fff' }} />
            </div>
            <button type="button" onClick={() => setAddingNew(true)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12, border: '1.5px dashed var(--teal-800)', background: 'var(--teal-100)', cursor: 'pointer' }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-800)', flexShrink: 0 }}>
                <Icon name="plus" size={16} />
              </div>
              <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--teal-800)' }}>Cadastrar novo paciente</span>
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map(p => (
                <Card key={p.id} onClick={() => { setPatient(p); setStep(1) }} hover style={{ cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Avatar name={p.name} size={40} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-text)' }}>{p.diags} diagnósticos</div>
                  </div>
                  {p.pending && <Badge label="Cadastro pendente" status="pending" />}
                  <Icon name="chevronRight" size={16} color="var(--gray-3)" />
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 0b — Cadastrar novo paciente */}
        {step === 0 && addingNew && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => setAddingNew(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--teal-800)', display: 'flex', padding: 4 }}>
                <Icon name="chevronLeft" size={18} />
              </button>
              <div>
                <h2 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 800, color: 'var(--body)', margin: '0 0 2px' }}>Novo paciente</h2>
                <p style={{ fontSize: 13, color: 'var(--gray-text)', margin: 0 }}>Cadastro simples pra começar a avaliação agora</p>
              </div>
            </div>
            <Card>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--body)', marginBottom: 6, fontFamily: 'Outfit' }}>Nome completo *</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome do paciente"
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: 'var(--body)', marginBottom: 14, boxSizing: 'border-box' }} />

              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--body)', marginBottom: 6, fontFamily: 'Outfit' }}>E-mail *</label>
              <input value={newEmail} onChange={e => setNewEmail(e.target.value)} type="email" placeholder="paciente@email.com"
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: 'var(--body)', marginBottom: 14, boxSizing: 'border-box' }} />

              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--body)', marginBottom: 6, fontFamily: 'Outfit' }}>Telefone</label>
              <input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="(11) 99999-9999"
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: 'var(--body)', boxSizing: 'border-box' }} />
            </Card>
            <div style={{ background: 'rgba(11,107,130,0.06)', borderRadius: 10, padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <Icon name="info" size={15} color="var(--teal-800)" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12, color: 'var(--gray-text)', lineHeight: 1.5 }}>O paciente vai receber um e-mail com um link pra completar o cadastro dele (senha, telefone etc.) depois — por enquanto isso ainda não está implementado, é só o cadastro básico pra liberar a avaliação.</span>
            </div>
            <Btn full size="lg" disabled={!novoPacienteValido} onClick={registerPatient}>Cadastrar e continuar</Btn>
          </div>
        )}

        {/* 1 — Anamnese */}
        {step === 1 && patient && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Avatar name={patient.name} size={36} />
              <div>
                <h2 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 800, color: 'var(--body)', margin: 0 }}>Anamnese</h2>
                <p style={{ fontSize: 12, color: 'var(--gray-text)', margin: 0 }}>{patient.name}</p>
              </div>
            </div>

            <Card>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--body)', marginBottom: 8, fontFamily: 'Outfit' }}>Paciente percebe mau hálito?</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
                {['Sim', 'Não'].map(opt => (
                  <button key={opt} type="button" onClick={() => setPercebe(opt)} style={{ padding: '12px', borderRadius: 12, border: `2px solid ${percebe === opt ? 'var(--teal-800)' : 'var(--border)'}`, background: percebe === opt ? 'var(--teal-100)' : '#fff', fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: percebe === opt ? 'var(--teal-800)' : 'var(--body)', cursor: 'pointer' }}>{opt}</button>
                ))}
              </div>

              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--body)', marginBottom: 8, fontFamily: 'Outfit' }}>Frequência de escovação</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                {['1x ao dia', '2x ao dia', '3x ao dia', 'Mais de 3x'].map(opt => (
                  <button key={opt} type="button" onClick={() => setEscovacao(opt)} style={{ padding: '11px 14px', borderRadius: 10, border: `2px solid ${escovacao === opt ? 'var(--teal-800)' : 'var(--border)'}`, background: escovacao === opt ? 'var(--teal-100)' : '#fff', fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, color: escovacao === opt ? 'var(--teal-800)' : 'var(--body)', cursor: 'pointer', textAlign: 'left' }}>{opt}</button>
                ))}
              </div>

              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--body)', marginBottom: 8, fontFamily: 'Outfit' }}>Fumante?</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
                {['Sim', 'Não'].map(opt => (
                  <button key={opt} type="button" onClick={() => setFumante(opt)} style={{ padding: '12px', borderRadius: 12, border: `2px solid ${fumante === opt ? 'var(--teal-800)' : 'var(--border)'}`, background: fumante === opt ? 'var(--teal-100)' : '#fff', fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: fumante === opt ? 'var(--teal-800)' : 'var(--body)', cursor: 'pointer' }}>{opt}</button>
                ))}
              </div>

              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--body)', marginBottom: 8, fontFamily: 'Outfit' }}>Medicação em uso</label>
              <input value={medicacao} onChange={e => setMedicacao(e.target.value)} placeholder="Nenhuma / nome do medicamento"
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: 'var(--body)', marginBottom: 18, boxSizing: 'border-box' }} />

              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--body)', marginBottom: 8, fontFamily: 'Outfit' }}>Higiene bucal (1 a 5)</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" onClick={() => setHigiene(n)} style={{ flex: 1, height: 44, borderRadius: 12, border: `2px solid ${higiene === n ? 'var(--teal-800)' : 'var(--border)'}`, background: higiene === n ? 'var(--teal-800)' : '#fff', color: higiene === n ? '#fff' : 'var(--body)', fontFamily: 'Outfit', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>{n}</button>
                ))}
              </div>
            </Card>

            <Btn full size="lg" disabled={!anamPreenchida} onClick={() => setStep(2)}>Continuar</Btn>
          </div>
        )}

        {/* 2 — Foto */}
        {step === 2 && patient && !processing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h2 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 800, color: 'var(--body)', margin: '0 0 4px' }}>Capturar imagem</h2>
              <p style={{ fontSize: 13, color: 'var(--gray-text)' }}>Foto do dorso da língua — pode usar câmera intraoral</p>
            </div>
            <div style={{ background: '#0a3d4a', borderRadius: 20, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 70%, rgba(22,163,74,0.15), transparent 60%)' }} />
              <div style={{ width: '70%', aspectRatio: '1.4', borderRadius: 30, border: '1.5px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {[['topLeft', 'top', 'left'], ['topRight', 'top', 'right'], ['bottomLeft', 'bottom', 'left'], ['bottomRight', 'bottom', 'right']].map(([k, v1, h1]) => (
                  <div key={k} style={{ position: 'absolute', [v1]: -1, [h1]: -1, width: 20, height: 20, [v1 === 'top' ? 'borderTop' : 'borderBottom']: '3px solid #4ade80', [h1 === 'left' ? 'borderLeft' : 'borderRight']: '3px solid #4ade80', borderRadius: `${v1 === 'top' && h1 === 'left' ? '8px 0 0 0' : v1 === 'top' ? '0 8px 0 0' : h1 === 'left' ? '0 0 0 8px' : '0 0 8px 0'}` }} />
                ))}
                <div style={{ width: '60%', height: '40%', background: 'rgba(255,255,255,0.04)', borderRadius: 99, border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>
            </div>
            <Btn full size="lg" variant="success" onClick={capture}>
              <Icon name="camera" size={18} color="#fff" /> Capturar foto
            </Btn>
          </div>
        )}

        {/* 2b — Processando */}
        {step === 2 && processing && (
          <ScanLoader title="Analisando imagem" subtitle="A IA está processando o pré-diagnóstico" />
        )}

        {/* 3 — Revisão */}
        {step === 3 && patient && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Card style={{ background: 'linear-gradient(135deg,rgba(11,107,130,0.05),rgba(22,163,74,0.04))', border: '1px solid rgba(11,107,130,0.12)' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--teal-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-800)' }}>
                  <Icon name="sparkles" size={16} />
                </div>
                <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 14, color: 'var(--teal-800)' }}>Resultado da IA — {patient.name}</div>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: levelColor(aiLevel) + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="scan" size={28} color={levelColor(aiLevel)} />
                </div>
                <div>
                  <div style={{ marginBottom: 6 }}><LevelChip level={aiLevel} size="md" /></div>
                  <div style={{ fontSize: 12, color: 'var(--gray-text)' }}>Confiança: {aiConf}%</div>
                </div>
              </div>
            </Card>

            <Card style={{ border: '2px solid var(--teal-800)' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--teal-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-800)' }}>
                  <Icon name="medical" size={16} />
                </div>
                <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 15, color: 'var(--teal-800)' }}>Sua avaliação</div>
              </div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 8, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Classificação confirmada</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                {([1, 2, 3] as Level[]).map(l => (
                  <button key={l} type="button" onClick={() => setClassif(l)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 12, border: `2px solid ${classif === l ? levelColor(l) : 'var(--border)'}`, background: classif === l ? levelColor(l) + '10' : '#fff', cursor: 'pointer', textAlign: 'left' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: levelColor(l), flexShrink: 0 }} />
                    <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{l} — {levelLabel(l)}</span>
                  </button>
                ))}
              </div>
              <Textarea label="Observações e recomendações" value={obs} onChange={setObs} placeholder="Descreva suas observações clínicas..." rows={4} />
              {saved && (
                <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 12, padding: '10px 14px', color: '#065F46', fontSize: 13, fontWeight: 600, marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon name="checkCircle" size={16} color="#065F46" /> Diagnóstico salvo e enviado ao paciente!
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                <Btn variant="secondary" onClick={() => setView('dashboard')}>Cancelar</Btn>
                <Btn full variant="success" disabled={!classif} onClick={() => setSaved(true)}><Icon name="check" size={16} color="#fff" /> Salvar diagnóstico</Btn>
              </div>
            </Card>
            {saved && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Btn full onClick={() => patient && onFinishToPatient(patient)}>Concluir e ir ao paciente</Btn>
                <Btn full variant="secondary" onClick={() => setView('patients')}>Ver todos os pacientes</Btn>
              </div>
            )}
            <div style={{ height: 8 }} />
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Profile ──────────────────────────────────────────────────────────────────
// ─── About modal ──────────────────────────────────────────────────────────────
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
function EditProfileModal({ initial, onClose, onSave }: { initial: { name: string; email: string; especialidade: string; registro: string }; onClose: () => void; onSave: (v: { name: string; email: string; especialidade: string; registro: string }) => void }) {
  const [name, setName] = useState(initial.name)
  const [email, setEmail] = useState(initial.email)
  const [especialidade, setEspecialidade] = useState(initial.especialidade)
  const [registro, setRegistro] = useState(initial.registro)

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
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Especialidade</label>
          <input value={especialidade} onChange={e => setEspecialidade(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--gray-text)', marginBottom: 6, fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: 0.5 }}>Registro</label>
          <input value={registro} onChange={e => setRegistro(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <Btn full size="lg" disabled={!name.trim() || !email.trim()} onClick={() => onSave({ name, email, especialidade, registro })}>Salvar alterações</Btn>
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

function ProfProfile({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [profile, setProfile] = useState({ name: user.name, email: user.email, especialidade: 'Odontologia / Halitose', registro: 'CRO-SP 98765' })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'linear-gradient(160deg, #0a3d4a 0%, #0B6B82 55%, #0d8aa6 100%)', padding: '32px 20px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(22,163,74,0.12)', filter: 'blur(20px)' }} />
        <Avatar name={profile.name} size={72} role="professional" />
        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 900, color: '#fff' }}>{profile.name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>Profissional · {profile.email}</div>
        </div>
      </div>
      <div style={{ margin: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card>
          {[
            { label: 'Especialidade', value: profile.especialidade },
            { label: 'Registro', value: profile.registro },
            { label: 'Vínculo Hality', value: 'Profissional parceiro' },
            { label: 'E-mail', value: profile.email },
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
            { icon: <Icon name="key" size={18} color="#FF9500" />, label: 'Alterar senha', bg: '#FEF3C7', action: () => setShowPasswordModal(true) },
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
export default function ProfessionalApp({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [view, setView] = useState<ProfView>('dashboard')
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS)
  const [diagBackView, setDiagBackView] = useState<ProfView>('diagnostics')
  const [evalPatient, setEvalPatient] = useState<Patient | null>(null)
  const [viewedPatient, setViewedPatient] = useState<Patient>(INITIAL_PATIENTS[0])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [view])

  const addPatient = (p: Patient) => setPatients(prev => [p, ...prev])
  const openDiag = (from: ProfView) => { setDiagBackView(from); setView('diag-detail') }
  const openEvaluate = (p: Patient | null) => { setEvalPatient(p); setView('evaluate') }
  const openPatient = (p: Patient) => { setViewedPatient(p); setView('patient-detail') }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 480, margin: '0 auto', position: 'relative' }}>
      {view !== 'evaluate' && <TopBar user={user} onProfile={() => setView('profile')} />}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: 'var(--bg)' }}>
        <div key={view} className="page-enter">
          {view === 'dashboard'     && <Dashboard user={user} patients={patients} setView={setView} onOpenDiag={openDiag} onEvaluate={openEvaluate} />}
          {view === 'diagnostics'   && <DiagnosticsList setView={setView} onOpenDiag={openDiag} />}
          {view === 'diag-detail'   && <DiagnosticReview setView={setView} backView={diagBackView} />}
          {view === 'patients'      && <PatientsList patients={patients} onEvaluate={openEvaluate} onViewPatient={openPatient} />}
          {view === 'patient-detail'&& <PatientDetail patient={viewedPatient} setView={setView} onOpenDiag={openDiag} onEvaluate={openEvaluate} />}
          {view === 'evaluate'      && <EvaluatePatient patients={patients} onAddPatient={addPatient} setView={setView} initialPatient={evalPatient} onFinishToPatient={openPatient} />}
          {view === 'profile'       && <ProfProfile user={user} onLogout={onLogout} />}
        </div>
      </div>
      {view !== 'evaluate' && <BottomNav view={view} setView={setView} />}
    </div>
  )
}
