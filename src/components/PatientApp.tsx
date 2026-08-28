import { useEffect, useRef, useState } from 'react'
import type { AuthUser } from './AuthFlow'
import { Btn, Card, Badge, Empty, Modal, Alert, Avatar, PageHero, SectionHeader } from './shared/UI'
import { Icon } from './shared/Icons'
import halityLogo from '@/imports/Logo-Hality-rncwhngo9oo4u9tdlspy0644l1cpwnm78navwjh0jk.png'
import cybIcon from '@/imports/Icon_CheckYourBreath.png'

type View = 'home' | 'diagnosis-flow' | 'diagnostics' | 'profile'
type BadgeStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'pending'

// ─── Level system (1=Normal, 2=Íntima, 3=Social) ────────────────────────────
type Level = 1 | 2 | 3
const levelColor = (l: Level | null) => l === null ? '#6B7280' : l === 1 ? '#16A34A' : l === 2 ? '#FF9500' : '#FF3B30'
const levelLabel = (l: Level | null) => l === null ? 'Pendente' : l === 1 ? 'Hálito Normal' : l === 2 ? 'Halitose Íntima' : 'Mau Hálito Social'
const levelBadge = (l: Level | null): BadgeStatus => l === null ? 'pending' : l === 1 ? 'success' : l === 2 ? 'warning' : 'danger'

const DIAGS: { id: number; date: string; level: Level | null; status: string; revised: boolean }[] = [
  { id: 1, date: '12/08/2026', level: 2, status: 'Concluído', revised: true },
  { id: 2, date: '05/07/2026', level: 1, status: 'Concluído', revised: true },
  { id: 3, date: '20/06/2026', level: null, status: 'Aguardando análise', revised: false },
  { id: 4, date: '10/06/2026', level: 3, status: 'Aguardando revisão', revised: false },
]

const TIPS = [
  { id: 1, tag: 'Higiene', title: 'Higiene da Língua', body: 'Use um limpador de língua pela manhã. A saburra lingual é a principal causa da halitose. Passe suavemente 3 a 5 vezes da parte posterior para a ponta.', icon: <Icon name="sparkles" size={22} /> },
  { id: 2, tag: 'Saúde', title: 'Hidratação', body: 'Beba 2 litros de água por dia. A boca seca favorece o crescimento de bactérias anaeróbias que produzem compostos sulfurados, causadores do mau hálito.', icon: <Icon name="drop" size={22} /> },
  { id: 3, tag: 'Nutrição', title: 'Alimentos Aliados', body: 'Consuma maçã, cenoura, salsinha e iogurte natural. Esses alimentos ajudam a neutralizar os compostos causadores do mau hálito de forma natural.', icon: <Icon name="heart" size={22} /> },
  { id: 4, tag: 'Rotina', title: 'Rotina de Higiene', body: 'Escove os dentes após cada refeição, use fio dental diariamente e enxaguante sem álcool para completar a limpeza bucal.', icon: <Icon name="checkCircle" size={22} /> },
  { id: 5, tag: 'Saúde', title: 'Consulta Periódica', body: 'Visite seu dentista a cada 6 meses. Cáries e doença periodontal são causas frequentes de halitose que exigem tratamento profissional.', icon: <Icon name="medical" size={22} /> },
  { id: 6, tag: 'Estilo de Vida', title: 'Evite Tabagismo', body: 'O cigarro resseca a mucosa oral e deposita substâncias odoríferas nos tecidos. Parar de fumar melhora significativamente o hálito.', icon: <Icon name="noSymbol" size={22} /> },
]

// ─── Level chip ────────────────────────────────────────────────────────────────
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

// ─── Bottom nav ────────────────────────────────────────────────────────────────
function BottomNav({ view, setView }: { view: View; setView: (v: View) => void }) {
  const tabs: { v: View; icon: React.ReactNode; label: string }[] = [
    { v: 'home',           icon: <Icon name="home" size={22} />,   label: 'Home' },
    { v: 'diagnosis-flow', icon: <Icon name="camera" size={22} />, label: 'Diagnóstico' },
    { v: 'diagnostics',    icon: <Icon name="chart" size={22} />,  label: 'Progresso' },
    { v: 'profile',        icon: <Icon name="person" size={22} />, label: 'Usuário' },
  ]
  return (
    <nav style={{ background: 'var(--bg)', padding: '16px 25px 25px', flexShrink: 0 }}>
      <div style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0px 8px 40px 0px rgba(0,0,0,0.12)',
        borderRadius: 296,
        display: 'flex',
        alignItems: 'center',
        padding: '0 2px',
      }}>
        {tabs.map(t => {
          const active = view === t.v
          return (
            <button key={t.v} onClick={() => setView(t.v)}
              style={{ flex: 1, display: 'flex', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px' }}>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, paddingTop: 6, paddingBottom: 7, paddingLeft: 8, paddingRight: 8, width: '100%' }}>
                {active && <div style={{ position: 'absolute', inset: '0 -2px', background: '#ededed', borderRadius: 100 }} />}
                <div style={{ position: 'relative', zIndex: 1, color: '#1a1a1a' }}>{t.icon}</div>
                <span style={{ position: 'relative', zIndex: 1, fontSize: 10, fontFamily: 'Outfit', fontWeight: active ? 600 : 400, color: '#1a1a1a', lineHeight: '12px', letterSpacing: -0.1, whiteSpace: 'nowrap' }}>{t.label}</span>
              </div>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// ─── TopBar ────────────────────────────────────────────────────────────────────
function TopBar() {
  return (
    <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '1px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
      <img src={cybIcon} alt="Check Your Breath" style={{ height: 45, objectFit: 'contain' }} />
      <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 15, color: 'var(--body)' }}>Check Your Breath</span>
      <div style={{ width:50 }} />
    </div>
  )
}

// ─── Home ──────────────────────────────────────────────────────────────────────
function Home({ user, setView }: { user: AuthUser; setView: (v: View) => void }) {
  const last = DIAGS.find(d => d.level !== null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Hero — CTA only */}
      <div style={{
        background: 'linear-gradient(167.33deg, rgb(10, 61, 74) 8.49%, rgb(11, 107, 130) 54.15%, rgb(13, 138, 166) 91.51%)',
        padding: '24px 20px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: 100, background: 'rgba(22,163,74,0.12)', filter: 'blur(32px)', pointerEvents: 'none' }} />

        {/* Greeting */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <p style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 13, lineHeight: '19.5px', color: 'rgba(255,255,255,0.55)', margin: '0 0 2px' }}>Olá,</p>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 26, lineHeight: '29.9px', color: '#fff', margin: 0, letterSpacing: -0.5 }}>{user.name.split(' ').slice(0, 2).join(' ')}</h1>
        </div>

        {/* CTA */}
        <button onClick={() => setView('diagnosis-flow')} style={{
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
            <Icon name="camera" size={24} color="#fff" />
          </div>
          <div style={{ flex: 1, textAlign: 'left', position: 'relative' }}>
            <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: 16, color: '#fff', lineHeight: '24px' }}>Fazer novo diagnóstico</div>
            <div style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: '18px', marginTop: 2 }}>Capture e analise com IA · ~2 min</div>
          </div>
        </button>
        <div style={{ height: 8 }} />
      </div>

      {/* Content */}
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Last diagnosis */}
        <Card>
          <SectionHeader title="Último Diagnóstico" action={<button onClick={() => setView('diagnostics')} style={{ background: 'none', border: 'none', color: 'var(--teal-800)', fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>Ver todos <Icon name="chevronRight" size={14} /></button>} />
          {last ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: levelColor(last.level) + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="scan" size={26} color={levelColor(last.level)} />
              </div>
              <div style={{ flex: 1 }}>
                <LevelChip level={last.level} size="md" />
                <div style={{ fontSize: 12, color: 'var(--gray-text)', marginTop: 6, marginBottom: 10 }}>{last.date}</div>
              </div>
              <Btn variant="secondary" style={{ alignSelf: 'center'}} size="sm" onClick={() => setView('diagnostics')}>Ver detalhes</Btn>
            </div>
          ) : <Empty icon={<Icon name="beaker" size={28} />} title="Nenhum diagnóstico ainda" desc="Faça seu primeiro diagnóstico agora!" />}
        </Card>

        {/* Tips feed */}
        <div>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 17, fontWeight: 800, color: 'var(--body)', margin: '0 0 12px' }}>Dicas para você</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TIPS.map(tip => (
              <Card key={tip.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--teal-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-800)', flexShrink: 0 }}>{tip.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{tip.title}</span>
                    <span style={{ fontSize: 10, fontFamily: 'Outfit', fontWeight: 600, color: 'var(--teal-800)', background: 'var(--teal-100)', borderRadius: 999, padding: '2px 8px' }}>{tip.tag}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--gray-text)', lineHeight: 1.55, margin: 0 }}>{tip.body}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Diagnosis flow ────────────────────────────────────────────────────────────
// Steps:  0=Início  1=Anamnese  2=Revisão  3=Orientações  4=Captura  5=Revisar  6=Análise  7=Resultado  8=Dicas
// Visual: none      Anamnese    Anamnese   Captura        Captura    Captura    Pré Diag   Pré Diag     Pré Diag

const VISUAL_STEPS = ['Anamnese', 'Captura', 'Pré Diagnóstico']
const toVisual = (step: number) => step === 0 ? -1 : step <= 2 ? 0 : step <= 5 ? 1 : 2

const ANAMNESE_QS = [
  { q: 'Você percebe mau hálito?', type: 'yesno' },
  { q: 'Com que frequência escova os dentes?', type: 'choice', opts: ['1x ao dia', '2x ao dia', '3x ao dia', 'Mais de 3x'] },
  { q: 'Você é fumante?', type: 'yesno' },
  { q: 'Você usa alguma medicação regularmente?', type: 'text' },
  { q: 'Classifique sua higiene bucal de 1 a 5:', type: 'scale' },
]

function FlowStepBar({ step }: { step: number }) {
  const current = toVisual(step)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {VISUAL_STEPS.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < VISUAL_STEPS.length - 1 ? 1 : 'unset' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: i < current ? '#16A34A' : i === current ? 'var(--teal-800)' : 'var(--border)',
              color: i <= current ? '#fff' : 'var(--gray-3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Outfit', fontWeight: 800, fontSize: 11,
              flexShrink: 0, transition: 'all 0.3s',
            }}>
              {i < current ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 9, color: i <= current ? 'var(--teal-800)' : 'var(--gray-3)', fontWeight: i <= current ? 700 : 400, whiteSpace: 'nowrap' }}>{s}</span>
          </div>
          {i < VISUAL_STEPS.length - 1 && <div style={{ flex: 1, height: 1.5, background: i < current ? '#16A34A' : 'var(--border)', margin: '0 3px 14px', transition: 'background 0.3s' }} />}
        </div>
      ))}
    </div>
  )
}

function DiagnosisFlow({ setView }: { setView: (v: View) => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [aIdx, setAIdx] = useState(0)
  const [frontCamera, setFrontCamera] = useState(false)

  const next = () => setStep(s => s + 1)
  const back = () => step > 0 ? setStep(s => s - 1) : setView('home')

  const nextAns = () => {
    if (aIdx < ANAMNESE_QS.length - 1) setAIdx(a => a + 1)
    else next()
  }

  const startProcessing = () => {
    setTimeout(() => { next(); }, 2500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', background: 'var(--bg)' }}>
      <div style={{ background: '#fff', padding: '14px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <FlowStepBar step={step} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>

        {/* 0 — Intro */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
              <div style={{ width: 72, height: 72, borderRadius: 22, background: 'var(--teal-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--teal-800)' }}>
                <Icon name="scan" size={36} />
              </div>
              <h2 style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 900, color: 'var(--body)', margin: '0 0 8px' }}>Seu diagnóstico em etapas</h2>
              <p style={{ fontSize: 14, color: 'var(--gray-text)', lineHeight: 1.6 }}>Leva aproximadamente 2 minutos. Siga as instruções para um resultado preciso.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { title: 'Responder perguntas', sub: 'Anamnese rápida sobre sua saúde bucal', icon: <Icon name="clipboard" size={18} color="var(--teal-800)" /> },
                { title: 'Preparar a câmera', sub: 'Orientações para captura de qualidade', icon: <Icon name="sun" size={18} color="var(--teal-800)" /> },
                { title: 'Fotografar a língua', sub: 'Captura guiada com enquadramento', icon: <Icon name="camera" size={18} color="var(--teal-800)" /> },
                { title: 'Aguardar análise da IA', sub: 'Processamento automático da imagem', icon: <Icon name="sparkles" size={18} color="var(--teal-800)" /> },
                { title: 'Visualizar pré-diagnóstico', sub: 'Classificação e orientações personalizadas', icon: <Icon name="chart" size={18} color="var(--teal-800)" /> },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', gap: 14, alignItems: 'center', background: '#fff', borderRadius: 14, padding: '14px 16px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: 'var(--teal-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-text)' }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <Btn full size="lg" onClick={next}>Começar diagnóstico</Btn>
            <Btn full variant="ghost" onClick={back}>Cancelar</Btn>
          </div>
        )}

        {/* 1 — Anamnese */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <h2 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 800, color: 'var(--body)', margin: 0 }}>Anamnese</h2>
                <span style={{ fontSize: 12, color: 'var(--gray-text)' }}>{aIdx + 1} de {ANAMNESE_QS.length}</span>
              </div>
              <div style={{ height: 3, background: 'var(--border)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${((aIdx + 1) / ANAMNESE_QS.length) * 100}%`, background: 'var(--teal-800)', borderRadius: 999, transition: 'width 0.3s' }} />
              </div>
            </div>
            <Card>
              <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--body)', fontFamily: 'Outfit', marginBottom: 20, lineHeight: 1.4 }}>
                {ANAMNESE_QS[aIdx].q}
              </p>
              {ANAMNESE_QS[aIdx].type === 'yesno' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {['Sim', 'Não'].map(opt => (
                    <button key={opt} onClick={() => { setAnswers(a => ({ ...a, [aIdx]: opt })); nextAns() }}
                      style={{ padding: '16px', borderRadius: 14, border: `2px solid ${answers[aIdx] === opt ? 'var(--teal-800)' : 'var(--border)'}`, background: answers[aIdx] === opt ? 'var(--teal-100)' : 'var(--bg)', fontFamily: 'Outfit', fontWeight: 700, fontSize: 15, color: answers[aIdx] === opt ? 'var(--teal-800)' : 'var(--body)', cursor: 'pointer', transition: 'all 0.15s' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              {ANAMNESE_QS[aIdx].type === 'choice' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {ANAMNESE_QS[aIdx].opts?.map(opt => (
                    <button key={opt} onClick={() => { setAnswers(a => ({ ...a, [aIdx]: opt })); nextAns() }}
                      style={{ padding: '14px 16px', borderRadius: 12, border: `2px solid ${answers[aIdx] === opt ? 'var(--teal-800)' : 'var(--border)'}`, background: answers[aIdx] === opt ? 'var(--teal-100)' : 'var(--bg)', fontFamily: 'Outfit', fontWeight: 600, fontSize: 14, color: answers[aIdx] === opt ? 'var(--teal-800)' : 'var(--body)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              {ANAMNESE_QS[aIdx].type === 'text' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input placeholder="Digite sua resposta..." value={answers[aIdx] || ''} onChange={e => setAnswers(a => ({ ...a, [aIdx]: e.target.value }))}
                    style={{ width: '100%', padding: '14px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 15, fontFamily: 'inherit', outline: 'none', color: 'var(--body)', background: 'var(--bg)' }}
                    onFocus={e => { e.target.style.borderColor = 'var(--teal-800)'; e.target.style.background = '#fff' }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg)' }}
                  />
                  <Btn full onClick={nextAns}>Próximo</Btn>
                </div>
              )}
              {ANAMNESE_QS[aIdx].type === 'scale' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} onClick={() => setAnswers(a => ({ ...a, [aIdx]: String(n) }))}
                        style={{ width: 52, height: 52, borderRadius: 14, border: `2px solid ${answers[aIdx] === String(n) ? 'var(--teal-800)' : 'var(--border)'}`, background: answers[aIdx] === String(n) ? 'var(--teal-800)' : 'var(--bg)', color: answers[aIdx] === String(n) ? '#fff' : 'var(--body)', fontFamily: 'Outfit', fontWeight: 800, fontSize: 20, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {n}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: 'var(--gray-text)' }}>Ruim</span>
                    <span style={{ fontSize: 11, color: 'var(--gray-text)' }}>Excelente</span>
                  </div>
                  <Btn full onClick={nextAns} disabled={!answers[aIdx]}>Próximo</Btn>
                </div>
              )}
            </Card>
            {aIdx > 0 && <Btn variant="ghost" onClick={() => setAIdx(a => a - 1)}><Icon name="chevronLeft" size={16} /> Pergunta anterior</Btn>}
          </div>
        )}

        {/* 2 — Revisão da Anamnese */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ textAlign: 'center', paddingBottom: 4 }}>
              <div style={{ width: 56, height: 56, borderRadius: 18, background: 'var(--teal-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: 'var(--teal-800)' }}>
                <Icon name="clipboard" size={28} />
              </div>
              <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 900, color: 'var(--body)', margin: '0 0 6px' }}>Confirme suas respostas</h2>
              <p style={{ fontSize: 13, color: 'var(--gray-text)', lineHeight: 1.5, margin: 0 }}>Revise as informações antes de prosseguir para a captura</p>
            </div>
            <Card>
              <div style={{ fontFamily: 'Outfit', fontSize: 13, fontWeight: 700, color: 'var(--teal-800)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>Anamnese</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {ANAMNESE_QS.map((q, i) => {
                  const ans = answers[i]
                  const isLast = i === ANAMNESE_QS.length - 1
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
                      <div style={{ width: 28, height: 28, borderRadius: 9, background: ans ? 'var(--teal-100)' : 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1.5px solid ${ans ? 'var(--teal-800)' : 'var(--border)'}`, marginTop: 1 }}>
                        {ans ? <Icon name="check" size={14} color="var(--teal-800)" /> : <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 11, color: 'var(--gray-3)' }}>{i + 1}</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: 'var(--gray-text)', marginBottom: 3, lineHeight: 1.4 }}>{q.q}</div>
                        {ans ? <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{ans}</div>
                          : <div style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, color: '#FF3B30' }}>Não respondida</div>}
                      </div>
                      <button onClick={() => { setAIdx(i); setStep(1) }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 8, color: 'var(--teal-800)', fontFamily: 'Outfit', fontWeight: 600, fontSize: 12, flexShrink: 0 }}>
                        Editar
                      </button>
                    </div>
                  )
                })}
              </div>
            </Card>
            {Object.keys(answers).length < ANAMNESE_QS.length && (
              <div style={{ background: '#FFF3CD', borderRadius: 12, padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'center', border: '1px solid #FFC107' }}>
                <Icon name="warning" size={16} color="#92400E" />
                <span style={{ fontSize: 13, color: '#92400E' }}>Algumas perguntas não foram respondidas. Você pode prosseguir ou voltar para completar.</span>
              </div>
            )}
            <Btn full size="lg" onClick={next}>Confirmar e continuar</Btn>
            <Btn full variant="ghost" onClick={() => { setAIdx(0); back() }}><Icon name="chevronLeft" size={16} /> Editar respostas</Btn>
          </div>
        )}

        {/* 3 — Orientações */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: 'var(--body)', margin: '0 0 4px' }}>Orientações para a captura</h2>
              <p style={{ fontSize: 13, color: 'var(--gray-text)' }}>Siga estas instruções para obter uma imagem de qualidade</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: <Icon name="sun" size={24} color="var(--teal-800)" />, title: 'Manhã e jejum', desc: 'Faça o exame pela manhã' },
                { icon: <Icon name="sparkles" size={24} color="var(--teal-800)" />, title: 'Boa iluminação', desc: 'Ambiente bem iluminado' },
                { icon: <Icon name="scan" size={24} color="var(--teal-800)" />, title: 'Flash ativo', desc: 'Ligue o flash do celular' },
                { icon: <Icon name="noSymbol" size={24} color="var(--teal-800)" />, title: 'Sem enxaguante', desc: 'Não use antes do exame' },
                { icon: <Icon name="drop" size={24} color="var(--teal-800)" />, title: 'Hidratado(a)', desc: 'Beba água antes' },
                { icon: <Icon name="checkCircle" size={24} color="var(--teal-800)" />, title: 'Língua relaxada', desc: 'Completamente estendida' },
              ].map(c => (
                <Card key={c.title} style={{ padding: '14px' }}>
                  <div style={{ marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontFamily: 'Outfit', fontSize: 13, fontWeight: 700, color: 'var(--body)', marginBottom: 2 }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-text)' }}>{c.desc}</div>
                </Card>
              ))}
            </div>
            <Btn full size="lg" onClick={next}>Preparar câmera</Btn>
            <Btn full variant="ghost" onClick={back}><Icon name="chevronLeft" size={16} /> Voltar</Btn>
          </div>
        )}

        {/* 4 — Captura */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--gray-text)', textAlign: 'center' }}>Posicione sua língua dentro da área indicada</p>

            {/* Viewfinder */}
            <div style={{ background: '#0a3d4a', borderRadius: 20, aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 70%, rgba(22,163,74,0.15), transparent 60%)' }} />
              {/* Corner guides */}
              <div style={{ width: '70%', aspectRatio: '1.4', borderRadius: 30, border: '1.5px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {[['topLeft','top','left'],['topRight','top','right'],['bottomLeft','bottom','left'],['bottomRight','bottom','right']].map(([k, v1, h1]) => (
                  <div key={k} style={{ position: 'absolute', [v1]: -1, [h1]: -1, width: 20, height: 20, [v1 === 'top' ? 'borderTop' : 'borderBottom']: '3px solid #4ade80', [h1 === 'left' ? 'borderLeft' : 'borderRight']: '3px solid #4ade80', borderRadius: `${v1 === 'top' && h1 === 'left' ? '8px 0 0 0' : v1 === 'top' ? '0 8px 0 0' : h1 === 'left' ? '0 0 0 8px' : '0 0 8px 0'}` }} />
                ))}
                <div style={{ width: '60%', height: '40%', background: 'rgba(255,255,255,0.04)', borderRadius: 99, border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>

              {/* Camera switch button */}
              <button onClick={() => setFrontCamera(f => !f)} style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', border: 'none', borderRadius: 10, padding: '7px 10px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon name="camera" size={14} color="#fff" />
                <span style={{ fontSize: 11, fontFamily: 'Outfit', fontWeight: 600 }}>{frontCamera ? 'Frontal' : 'Traseira'}</span>
              </button>

              {/* Ready badge */}
              <div style={{ position: 'absolute', top: 14, right: 14, background: '#4ade80', borderRadius: 999, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#065F46', fontFamily: 'Outfit' }}>Pronto</span>
              </div>
            </div>

            <Btn full size="lg" variant="success" onClick={next}>
              <Icon name="camera" size={18} color="#fff" /> Capturar foto
            </Btn>

            {/* Gallery upload */}
            <button style={{ width: '100%', background: 'var(--bg)', border: '1.5px dashed var(--border)', borderRadius: 14, padding: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 600, fontSize: 14, color: 'var(--teal-800)' }}
              onClick={next}>
              <Icon name="image" size={18} color="var(--teal-800)" />
              Escolher da galeria
            </button>

            <Btn full variant="ghost" onClick={back}><Icon name="chevronLeft" size={16} /> Voltar</Btn>
          </div>
        )}

        {/* 5 — Revisar imagem */}
        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: 'var(--body)', margin: '0 0 4px' }}>A imagem está boa?</h2>
              <p style={{ fontSize: 13, color: 'var(--gray-text)' }}>Verifique se a língua está nítida e bem enquadrada</p>
            </div>
            <div style={{ background: '#0a3d4a', borderRadius: 20, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(11,107,130,0.25), transparent 70%)' }} />
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 120, height: 70, background: 'rgba(255,255,255,0.06)', borderRadius: '50% 50% 40% 40%', border: '1px solid rgba(255,255,255,0.12)' }} />
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'Outfit' }}>Imagem capturada</div>
              </div>
              <div style={{ position: 'absolute', bottom: 14, left: 14, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: 9, padding: '5px 11px', fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'Outfit', fontWeight: 600 }}>
                {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <Btn full size="lg" variant="success" onClick={() => { startProcessing(); next() }}>
              <Icon name="check" size={16} color="#fff" /> Usar esta foto
            </Btn>
            <Btn full variant="secondary" onClick={() => setStep(4)}>
              <Icon name="camera" size={16} /> Tirar novamente
            </Btn>
          </div>
        )}

        {/* 6 — Processando */}
        {step === 6 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 0', gap: 28 }}>
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--teal-800)', animation: 'spin 0.85s linear infinite' }} />
              <div style={{ position: 'absolute', inset: '12px', borderRadius: '50%', border: '2px solid var(--teal-100)', borderTopColor: 'var(--green-600)', animation: 'spin 1.2s linear infinite reverse' }} />
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div>
              <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: 'var(--body)', margin: '0 0 8px' }}>Analisando sua imagem</h2>
              <p style={{ fontSize: 14, color: 'var(--gray-text)', lineHeight: 1.6, maxWidth: 280 }}>Nossa inteligência artificial está processando o diagnóstico. Isso pode levar alguns instantes.</p>
            </div>
          </div>
        )}

        {/* 7 — Resultado */}
        {step === 7 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Pre-diagnosis notice */}
            <div style={{ background: '#FFF3CD', borderRadius: 14, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'flex-start', border: '1px solid #FFC107' }}>
              <Icon name="warning" size={18} color="#92400E" />
              <div>
                <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, color: '#92400E', marginBottom: 2 }}>Pré-Diagnóstico</div>
                <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5, margin: 0 }}>Este resultado é gerado automaticamente por IA e deve ser confirmado por um especialista Hality. Não substitui avaliação clínica.</p>
              </div>
            </div>

            {/* Result card */}
            <div style={{ textAlign: 'center', background: 'var(--gradient-brand)', borderRadius: 20, padding: '28px 20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(22,163,74,0.15)', filter: 'blur(24px)' }} />
              <div style={{ position: 'relative' }}>
                <div style={{ fontFamily: 'Outfit', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, marginBottom: 16, textTransform: 'uppercase' }}>Resultado do pré-diagnóstico</div>
                <div style={{ width: 80, height: 80, borderRadius: 24, background: '#FF950020', border: '2px solid #FF9500', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Icon name="scan" size={36} color="#FF9500" />
                </div>
                <LevelChip level={2} size="lg" />
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 10 }}>Confiança da análise: 87%</div>
              </div>
            </div>

            <Card>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-800)', flexShrink: 0 }}>
                  <Icon name="scan" size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--gray-text)' }}>Imagem analisada</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--body)', fontFamily: 'Outfit' }}>{new Date().toLocaleDateString('pt-BR')}</div>
                </div>
                <Badge label="Aguardando revisão" status="pending" />
              </div>
              <Alert message="Um especialista Hality irá revisar este pré-diagnóstico em breve." type="info" />
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Btn full size="lg" onClick={next}>Ver orientações</Btn>
              <Btn full variant="secondary" onClick={() => setView('home')}>Voltar ao início</Btn>
            </div>
          </div>
        )}

        {/* 8 — Orientações / Dicas */}
        {step === 8 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Hality contact card */}
            <div style={{ background: 'linear-gradient(135deg, #0a3d4a, #0b6b82)', borderRadius: 18, padding: '18px 18px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(68,191,173,0.15)', filter: 'blur(16px)' }} />
              <div style={{ position: 'relative' }}>
                <img src={halityLogo} alt="Hality" style={{ height: 22, objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: 10 }} />
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.55, margin: '0 0 12px' }}>
                  Especialistas em diagnóstico e tratamento do mau hálito com tecnologia e conhecimento. Pioneira no Brasil no exame de cromatografia gasosa da respiração.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {[
                    { icon: <Icon name="phone" size={13} color="rgba(255,255,255,0.7)" />, text: '0800 404 0404' },
                    { icon: <Icon name="envelope" size={13} color="rgba(255,255,255,0.7)" />, text: 'hality.com.br' },
                    { icon: <Icon name="medical" size={13} color="rgba(255,255,255,0.7)" />, text: 'Ijuí: drmarcelosaldanha.com.br' },
                  ].map(row => (
                    <div key={row.text} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {row.icon}
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'Outfit', fontWeight: 600 }}>{row.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: 'var(--body)', margin: '0 0 4px' }}>Orientações para você</h2>
              <p style={{ fontSize: 13, color: 'var(--gray-text)' }}>Com base no seu pré-diagnóstico — Halitose Íntima</p>
            </div>

            {TIPS.slice(0, 4).map(tip => (
              <Card key={tip.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: 'var(--teal-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal-800)', flexShrink: 0 }}>{tip.icon}</div>
                <div>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)', marginBottom: 4 }}>{tip.title}</div>
                  <p style={{ fontSize: 13, color: 'var(--gray-text)', lineHeight: 1.5, margin: 0 }}>{tip.body}</p>
                </div>
              </Card>
            ))}

            <Btn full variant="success" size="lg" onClick={() => setView('home')}>Concluir diagnóstico</Btn>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Diagnostics (Progresso) ───────────────────────────────────────────────────
function Diagnostics({ setView }: { setView: (v: View) => void }) {
  const [selected, setSelected] = useState<typeof DIAGS[0] | null>(null)

  if (selected) return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <PageHero
        title={`Diagnóstico #${selected.id}`}
        sub={selected.date}
        right={<Badge label={selected.status} status={selected.status === 'Concluído' ? 'success' : selected.status === 'Aguardando revisão' ? 'pending' : 'warning'} />}
      />
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ width: 80, height: 80, borderRadius: 22, background: levelColor(selected.level) + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <Icon name="scan" size={36} color={levelColor(selected.level)} />
            </div>
            <LevelChip level={selected.level} size="lg" />
          </div>

          {/* Image placeholder */}
          <div style={{ background: 'var(--bg)', borderRadius: 14, aspectRatio: '4/3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 14, gap: 8, border: '1px solid var(--border)' }}>
            <Icon name="image" size={32} color="var(--gray-3)" />
            <span style={{ fontSize: 12, color: 'var(--gray-3)', fontFamily: 'Outfit' }}>Imagem capturada</span>
          </div>

          {selected.level !== null && (
            <div style={{ background: 'var(--teal-50)', borderRadius: 12, padding: '14px', border: '1px solid var(--teal-100)' }}>
              <div style={{ fontFamily: 'Outfit', fontSize: 13, fontWeight: 700, color: 'var(--body)', marginBottom: 6 }}>Orientação</div>
              <p style={{ fontSize: 13, color: 'var(--gray-text)', lineHeight: 1.6, margin: 0 }}>
                {selected.level === 1
                  ? 'Seu hálito está normal. Mantenha a rotina de higiene bucal e hidratação adequada.'
                  : selected.level === 2
                  ? 'Identificamos halitose íntima. Recomendamos limpeza lingual diária e avaliação periodontal.'
                  : 'Mau hálito social detectado. Encaminhamento para avaliação especializada recomendado.'}
              </p>
            </div>
          )}
        </Card>
        <Btn variant="secondary" full onClick={() => setSelected(null)}><Icon name="chevronLeft" size={16} /> Voltar</Btn>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <PageHero title="Meus Diagnósticos" sub={`${DIAGS.length} exames realizados`} />
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {DIAGS.length === 0
          ? <Empty icon={<Icon name="beaker" size={28} />} title="Nenhum diagnóstico" desc="Faça seu primeiro diagnóstico agora." action={<Btn onClick={() => setView('diagnosis-flow')}>Começar</Btn>} />
          : DIAGS.map(d => (
            <Card key={d.id} onClick={() => setSelected(d)} hover style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: levelColor(d.level) + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="scan" size={22} color={levelColor(d.level)} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>Diagnóstico #{d.id}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-text)' }}>{d.date}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <Badge label={d.status === 'Concluído' ? levelLabel(d.level) : d.status} status={levelBadge(d.level)} />
              </div>
              <Icon name="chevronRight" size={16} color="var(--gray-3)" />
            </Card>
          ))
        }
      </div>
    </div>
  )
}

// ─── Profile ───────────────────────────────────────────────────────────────────
function Profile({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState('(11) 99999-1234')
  const [saved, setSaved] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ background: 'var(--gradient-brand)', padding: '32px 20px 52px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(22,163,74,0.12)', filter: 'blur(20px)' }} />
        <div style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 4 }}>{user.name}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>Usuário Free · {user.email}</div>
      </div>

      <div style={{ margin: '24px 16px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card>
          <SectionHeader title="Dados pessoais" action={<Btn variant="secondary" size="sm" onClick={() => { setEditing(!editing); setSaved(false) }}>{editing ? 'Cancelar' : 'Editar'}</Btn>} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Nome', value: name, set: setName, editable: true, icon: <Icon name="person" size={16} color="var(--gray-3)" /> },
              { label: 'E-mail', value: user.email, set: () => {}, editable: false, icon: <Icon name="envelope" size={16} color="var(--gray-3)" /> },
              { label: 'Telefone', value: phone, set: setPhone, editable: true, icon: <Icon name="phone" size={16} color="var(--gray-3)" /> },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: `1.5px solid ${editing && f.editable ? 'var(--teal-800)' : 'transparent'}`, borderRadius: 13, background: 'var(--bg)', transition: 'all 0.18s' }}>
                {f.icon}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: 'var(--gray-3)', fontFamily: 'Outfit', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{f.label}</div>
                  <input type="text" value={f.value} onChange={e => f.set(e.target.value)} disabled={!editing || !f.editable} style={{ background: 'none', border: 'none', outline: 'none', fontSize: 15, color: 'var(--body)', fontFamily: 'inherit', width: '100%' }} />
                </div>
              </div>
            ))}
          </div>
          {saved && <Alert message="Perfil atualizado com sucesso!" type="success" />}
          {editing && <Btn full size="lg" style={{ marginTop: 16 }} onClick={() => { setEditing(false); setSaved(true) }}>Salvar alterações</Btn>}
        </Card>

        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {[
            { icon: <Icon name="key" size={18} color="var(--teal-800)" />, label: 'Alterar senha', sub: 'Atualizar credenciais de acesso', bg: 'var(--teal-100)' },
            { icon: <Icon name="shield" size={18} color="#16A34A" />, label: 'Privacidade', sub: 'Política e dados pessoais', bg: '#D1FAE5' },
          ].map((item, i) => (
            <div key={item.label} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '14px 20px', borderBottom: i < 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: 'var(--body)' }}>{item.label}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-text)' }}>{item.sub}</div>
              </div>
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

// ─── Shell ─────────────────────────────────────────────────────────────────────
export default function PatientApp({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [view, setView] = useState<View>('home')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [view])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxWidth: 480, margin: '0 auto', position: 'relative' }}>
      {view !== 'home' && <TopBar />}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: 'var(--bg)' }}>
        {view === 'home' && <Home user={user} setView={setView} />}
        {view === 'diagnosis-flow' && <DiagnosisFlow setView={setView} />}
        {view === 'diagnostics' && <Diagnostics setView={setView} />}
        {view === 'profile' && <Profile user={user} onLogout={onLogout} />}
      </div>
      <BottomNav view={view} setView={setView} />
    </div>
  )
}
