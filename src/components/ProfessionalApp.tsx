import { useState } from 'react'
import type { AuthUser } from './AuthFlow'
import { Btn, Card, Badge, ScoreMeter, Empty, Avatar, SectionHeader, StatCard, Textarea } from './shared/UI'
import { Icon } from './shared/Icons'
import cybIcon from '@/imports/Icon_CheckYourBreath.png'

type BadgeStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'pending'
type ProfView = 'dashboard' | 'diagnostics' | 'diag-detail' | 'patients' | 'patient-detail' | 'profile'

const DIAGS = [
  { id: 101, patient: 'Ana Paula Ferreira', date: '12/08/2026', score: 68, status: 'Aguardando revisão', aiConf: 87, anam: { fumante: 'Não', escovacao: '2x ao dia', medicacao: 'Nenhuma', bocaSeca: 'Sim' } },
  { id: 102, patient: 'Julia Costa', date: '10/08/2026', score: null, status: 'Processando', aiConf: null, anam: { fumante: 'Sim', escovacao: '1x ao dia', medicacao: 'Omeprazol', bocaSeca: 'Não' } },
  { id: 103, patient: 'Carlos Mendes', date: '08/08/2026', score: 28, status: 'Revisado', aiConf: 92, anam: { fumante: 'Não', escovacao: '3x ao dia', medicacao: 'Anti-hipertensivo', bocaSeca: 'Não' } },
  { id: 104, patient: 'Roberto Souza', date: '05/08/2026', score: 88, status: 'Aguardando revisão', aiConf: 79, anam: { fumante: 'Sim', escovacao: '1x ao dia', medicacao: 'Nenhuma', bocaSeca: 'Sim' } },
  { id: 105, patient: 'Fernanda Lima', date: '01/08/2026', score: 44, status: 'Revisado', aiConf: 85, anam: { fumante: 'Não', escovacao: '2x ao dia', medicacao: 'Nenhuma', bocaSeca: 'Não' } },
]

const PATIENTS = [
  { id: 1, name: 'Ana Paula Ferreira', email: 'ana@email.com', diags: 4, lastDate: '12/08/2026', lastScore: 68 },
  { id: 2, name: 'Julia Costa', email: 'julia@email.com', diags: 1, lastDate: '10/08/2026', lastScore: null },
  { id: 3, name: 'Carlos Mendes', email: 'carlos@email.com', diags: 7, lastDate: '08/08/2026', lastScore: 28 },
  { id: 4, name: 'Roberto Souza', email: 'roberto@email.com', diags: 3, lastDate: '05/08/2026', lastScore: 88 },
  { id: 5, name: 'Fernanda Lima', email: 'fernanda@email.com', diags: 2, lastDate: '01/08/2026', lastScore: 44 },
]

const diagColor = (s: number | null) => s === null ? 'var(--gray-3)' : s < 33 ? '#16A34A' : s < 66 ? '#F59E0B' : '#DC2626'
const diagLabel = (s: number | null) => s === null ? '—' : s < 33 ? 'Leve' : s < 66 ? 'Moderada' : 'Severa'
const statusBadge = (status: string): BadgeStatus => status === 'Revisado' ? 'success' : status === 'Processando' ? 'neutral' : 'pending'

// ─── TopBar ───────────────────────────────────────────────────────────────────
function TopBar({ user, onProfile }: { user: AuthUser; onProfile: () => void }) {
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
      <div>
        <img src={cybIcon} alt="Check Your Breath" style={{ height: 22, objectFit: 'contain', display: 'block' }} />
        <span style={{ fontSize: 10, color: 'var(--gray-text)', fontFamily: 'Outfit', fontWeight: 600 }}>Profissional</span>
      </div>
      <button onClick={onProfile} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <Avatar name={user.name} size={34} />
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
  const active = (v: ProfView) => view === v || (v === 'diagnostics' && view === 'diag-detail') || (v === 'patients' && view === 'patient-detail')
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
function Dashboard({ user, setView }: { user: AuthUser; setView: (v: ProfView) => void }) {
  const pending = DIAGS.filter(d => d.status === 'Aguardando revisão')
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg, #0a3d4a 0%, #0B6B82 55%, #0d8aa6 100%)', padding: '24px 20px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(13,138,166,0.25)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: '0 0 2px', position: 'relative' }}>Olá,</p>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 900, color: '#fff', margin: '0 0 20px', letterSpacing: -0.5, position: 'relative' }}>{user.name.split(' ').slice(0, 2).join(' ')}</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, position: 'relative' }}>
          {[
            { v: String(pending.length), label: 'para revisar', icon: <Icon name="clock" size={18} color="rgba(255,255,255,0.8)" /> },
            { v: '12', label: 'revisados', icon: <Icon name="checkCircle" size={18} color="rgba(255,255,255,0.8)" /> },
            { v: String(PATIENTS.length), label: 'pacientes', icon: <Icon name="users" size={18} color="rgba(255,255,255,0.8)" /> },
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
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Pending */}
        {pending.length > 0 && (
          <Card>
            <SectionHeader title="Aguardando revisão" sub={`${pending.length} diagnósticos`} action={<Btn variant="secondary" size="sm" onClick={() => setView('diagnostics')}>Ver todos</Btn>} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {pending.slice(0, 2).map(d => (
                <div key={d.id} style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#FEF3C7', borderRadius: 12, padding: '12px 14px', border: '1px solid #FCD34D' }}>
                  <Avatar name={d.patient} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{d.patient}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-text)' }}>{d.date}</div>
                  </div>
                  {d.score !== null && <div style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 900, color: diagColor(d.score) }}>{d.score}</div>}
                  <Btn variant="primary" size="sm" onClick={() => setView('diag-detail')}>Revisar</Btn>
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
              <div key={d.id} onClick={() => setView('diag-detail')} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
                <Avatar name={d.patient} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: 'var(--body)' }}>{d.patient}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-text)' }}>{d.date}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  {d.score !== null && <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 15, color: diagColor(d.score) }}>{d.score}</span>}
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
function DiagnosticsList({ setView }: { setView: (v: ProfView) => void }) {
  const [filter, setFilter] = useState<'Todos' | 'Aguardando revisão' | 'Revisado'>('Todos')
  const filtered = DIAGS.filter(d => filter === 'Todos' || d.status === filter)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '20px 20px 24px' }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>Diagnósticos</h1>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {(['Todos', 'Aguardando revisão', 'Revisado'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: 999, border: 'none', background: filter === f ? '#fff' : 'rgba(255,255,255,0.15)', color: filter === f ? 'var(--teal-800)' : 'rgba(255,255,255,0.85)', fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0
          ? <Empty icon={<Icon name="beaker" size={28} />} title="Nenhum resultado" />
          : filtered.map(d => (
            <Card key={d.id} onClick={() => setView('diag-detail')} hover style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <Avatar name={d.patient} size={44} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{d.patient}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-text)', marginBottom: 6 }}>{d.date}</div>
                  <Badge label={d.status} status={statusBadge(d.status)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  {d.score !== null
                    ? <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 22, color: diagColor(d.score) }}>{d.score}</span>
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
function DiagnosticReview({ setView }: { setView: (v: ProfView) => void }) {
  const d = DIAGS[0]
  const [classif, setClassif] = useState('')
  const [obs, setObs] = useState('')
  const [saved, setSaved] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '16px 20px 20px' }}>
        <button onClick={() => setView('diagnostics')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '8px 12px', color: '#fff', fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 14 }}>
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

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* IA result */}
        <Card style={{ background: 'linear-gradient(135deg,rgba(11,107,130,0.05),rgba(22,163,74,0.04))', border: '1px solid rgba(11,107,130,0.12)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--teal-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-800)' }}>
              <Icon name="sparkles" size={16} />
            </div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 14, color: 'var(--teal-800)' }}>Resultado da IA</div>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
              <ScoreMeter score={d.score!} color={diagColor(d.score)} size={80} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 900, color: diagColor(d.score) }}>{d.score}</span>
                <span style={{ fontSize: 9, color: 'var(--gray-text)' }}>score</span>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 800, color: diagColor(d.score), marginBottom: 4 }}>Halitose {diagLabel(d.score)}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-text)', marginBottom: 6 }}>Confiança: {d.aiConf}%</div>
              <div style={{ height: 5, background: 'var(--teal-100)', borderRadius: 999, width: 120, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${d.aiConf}%`, background: 'var(--teal-800)', borderRadius: 999 }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Anamnese */}
        <Card>
          <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 14, color: 'var(--body)', marginBottom: 12 }}>Anamnese</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.entries(d.anam).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg)', borderRadius: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--gray-text)', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--body)', fontFamily: 'Outfit' }}>{v}</span>
              </div>
            ))}
          </div>
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
            <select value={classif} onChange={e => setClassif(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--teal-200)', borderRadius: 12, fontSize: 14, fontFamily: 'Inter', color: 'var(--body)', background: '#fff', outline: 'none' }}>
              <option value="">Selecionar...</option>
              <option>Sem halitose</option>
              <option>Halitose Leve</option>
              <option>Halitose Moderada</option>
              <option>Halitose Severa</option>
            </select>
          </div>
          <Textarea label="Observações e recomendações" value={obs} onChange={setObs} placeholder="Descreva suas observações clínicas..." rows={4} />
          {saved && (
            <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 12, padding: '10px 14px', color: '#065F46', fontSize: 13, fontWeight: 600, marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="checkCircle" size={16} color="#065F46" /> Revisão salva e enviada ao paciente!
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <Btn variant="secondary" onClick={() => setView('diagnostics')}>Cancelar</Btn>
            <Btn full variant="success" onClick={() => setSaved(true)}><Icon name="check" size={16} color="#fff" /> Salvar revisão</Btn>
          </div>
        </Card>
        <div style={{ height: 8 }} />
      </div>
    </div>
  )
}

// ─── Patients list ────────────────────────────────────────────────────────────
function PatientsList({ setView }: { setView: (v: ProfView) => void }) {
  const [search, setSearch] = useState('')
  const filtered = PATIENTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

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
        {filtered.map(p => (
          <Card key={p.id} onClick={() => setView('patient-detail')} hover style={{ cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center' }}>
            <Avatar name={p.name} size={48} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-text)', marginBottom: 4 }}>{p.email}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-text)' }}>{p.diags} diagnósticos · último {p.lastDate}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              {p.lastScore !== null && <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 20, color: diagColor(p.lastScore) }}>{p.lastScore}</span>}
              <Icon name="chevronRight" size={16} color="var(--gray-3)" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Patient detail ───────────────────────────────────────────────────────────
function PatientDetail({ setView }: { setView: (v: ProfView) => void }) {
  const p = PATIENTS[0]
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
          <Card key={d.id} onClick={() => setView('diag-detail')} hover style={{ cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#0a3d4a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="scan" size={20} color="rgba(255,255,255,0.7)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14 }}>Diagnóstico #{d.id}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-text)' }}>{d.date}</div>
            </div>
            {d.score !== null && <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 18, color: diagColor(d.score) }}>{d.score}</span>}
            <Badge label={d.status} status={statusBadge(d.status)} />
            <Icon name="chevronRight" size={16} color="var(--gray-3)" />
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── Profile ──────────────────────────────────────────────────────────────────
function ProfProfile({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'linear-gradient(160deg, #0a3d4a 0%, #0B6B82 55%, #0d8aa6 100%)', padding: '32px 20px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(22,163,74,0.12)', filter: 'blur(20px)' }} />
        <Avatar name={user.name} size={72} />
        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 900, color: '#fff' }}>{user.name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>Profissional · {user.email}</div>
        </div>
      </div>
      <div style={{ margin: '-24px 16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card>
          {[
            { label: 'Especialidade', value: 'Odontologia / Halitose' },
            { label: 'Registro', value: 'CRO-SP 98765' },
            { label: 'Vínculo Hality', value: 'Profissional parceiro' },
            { label: 'E-mail', value: user.email },
          ].map((f, i, arr) => (
            <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 13, color: 'var(--gray-text)' }}>{f.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--body)', fontFamily: 'Outfit', maxWidth: '55%', textAlign: 'right' }}>{f.value}</span>
            </div>
          ))}
        </Card>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {[
            { icon: <Icon name="pencil" size={18} color="var(--teal-800)" />, label: 'Editar perfil', bg: 'var(--teal-100)' },
            { icon: <Icon name="key" size={18} color="#FF9500" />, label: 'Alterar senha', bg: '#FEF3C7' },
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
export default function ProfessionalApp({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [view, setView] = useState<ProfView>('dashboard')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 480, margin: '0 auto', position: 'relative' }}>
      <TopBar user={user} onProfile={() => setView('profile')} />
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: 'var(--bg)' }}>
        {view === 'dashboard'     && <Dashboard user={user} setView={setView} />}
        {view === 'diagnostics'   && <DiagnosticsList setView={setView} />}
        {view === 'diag-detail'   && <DiagnosticReview setView={setView} />}
        {view === 'patients'      && <PatientsList setView={setView} />}
        {view === 'patient-detail'&& <PatientDetail setView={setView} />}
        {view === 'profile'       && <ProfProfile user={user} onLogout={onLogout} />}
      </div>
      <BottomNav view={view} setView={setView} />
    </div>
  )
}
