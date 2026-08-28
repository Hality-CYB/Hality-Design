import { useState } from 'react'

interface User {
  name: string
  role: string
  email: string
}

interface UserDashboardProps {
  user: User
  activeView: string
  onNavigate: (view: string) => void
}

const mockDiagnostics = [
  { id: 1, date: '12/08/2026', status: 'Concluído', result: 'Halitose Moderada', score: 68, color: '#F59E0B' },
  { id: 2, date: '05/07/2026', status: 'Concluído', result: 'Halitose Leve', score: 32, color: '#16A34A' },
  { id: 3, date: '20/06/2026', status: 'Pendente', result: '—', score: null, color: '#6B7280' },
  { id: 4, date: '10/06/2026', status: 'Concluído', result: 'Halitose Severa', score: 88, color: '#DC2626' },
]

const tips = [
  { id: 1, title: 'Higiene da Língua', content: 'Use um limpador de língua pela manhã. A saburra lingual é uma das principais causas da halitose. Passe suavemente da parte posterior para a ponta, 3 a 5 vezes.', icon: '🦷', tag: 'Higiene' },
  { id: 2, title: 'Hidratação', content: 'Beba pelo menos 2 litros de água por dia. A boca seca favorece o crescimento de bactérias anaeróbias que produzem compostos sulfurados voláteis.', icon: '💧', tag: 'Saúde' },
  { id: 3, title: 'Alimentos Aliados', content: 'Consuma maçã, cenoura, salsinha e iogurte natural. Esses alimentos ajudam a neutralizar os compostos causadores do mau hálito.', icon: '🥗', tag: 'Nutrição' },
  { id: 4, title: 'Rotina de Higiene', content: 'Escove os dentes após cada refeição. Use fio dental diariamente e enxaguante bucal sem álcool para completar a limpeza.', icon: '✨', tag: 'Higiene' },
  { id: 5, title: 'Visita ao Dentista', content: 'Consulte seu dentista a cada 6 meses. Cáries e doença periodontal são causas frequentes de halitose que exigem tratamento profissional.', icon: '🏥', tag: 'Médico' },
  { id: 6, title: 'Evite Tabagismo', content: 'O cigarro resseca a mucosa oral e deposita substâncias odoríferas nos tecidos. Parar de fumar melhora significativamente o hálito.', icon: '🚭', tag: 'Estilo de Vida' },
]

const notifications = [
  { id: 1, title: 'Diagnóstico concluído', body: 'O resultado do seu exame de 12/08/2026 está disponível.', date: '13/08', read: false, icon: '🔬' },
  { id: 2, title: 'Lembrete de higiene', body: 'Não se esqueça de realizar sua higiene lingual diária.', date: '10/08', read: false, icon: '💡' },
  { id: 3, title: 'Nova dica disponível', body: 'Confira a nova dica sobre alimentos que ajudam no combate à halitose.', date: '05/08', read: true, icon: '✨' },
  { id: 4, title: 'Atualização da plataforma', body: 'Melhoramos o algoritmo de análise de imagem.', date: '01/08', read: true, icon: '🚀' },
]

function ScoreMeter({ score, color }: { score: number; color: string }) {
  const r = 42
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width={100} height={100} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={50} cy={50} r={r} fill="none" stroke="rgba(11,107,130,0.1)" strokeWidth={8} />
      <circle cx={50} cy={50} r={r} fill="none" stroke={color} strokeWidth={8} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
    </svg>
  )
}

function Dashboard({ user, onNavigate }: { user: User; onNavigate: (v: string) => void }) {
  const lastDiag = mockDiagnostics.find(d => d.status === 'Concluído')
  const unread = notifications.filter(n => !n.read).length

  return (
    <div style={{ background: '#F0F9FF', paddingBottom: 8 }}>
      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0a3d4a 0%, #0B6B82 60%, #0d8aa6 100%)',
        padding: '24px 20px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(22,163,74,0.15)', filter: 'blur(20px)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', filter: 'blur(16px)' }} />
        <p style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '0 0 4px' }}>Bem-vindo(a) de volta,</p>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 0 20px', letterSpacing: -0.5 }}>
          {user.name.split(' ')[0]} 👋
        </h1>
        {/* Quick stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { label: 'Exames', value: '3', sub: 'realizados' },
            { label: String(lastDiag?.score ?? '—'), value: '', sub: 'último score' },
            { label: String(unread), value: '', sub: 'avisos novos' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 10px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 800, color: '#fff' }}>{s.label}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontFamily: 'Inter', marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pull up card */}
      <div style={{ margin: '-28px 16px 0', borderRadius: 20, background: '#fff', boxShadow: '0 -4px 24px rgba(11,107,130,0.12)', padding: '20px', marginBottom: 16, border: '1px solid rgba(11,107,130,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 15, fontWeight: 700, color: '#0F2A35', margin: 0 }}>Último Diagnóstico</h3>
          <button onClick={() => onNavigate('user-diagnostics')} style={{ background: 'none', border: 'none', color: '#0B6B82', fontFamily: 'Outfit', fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: 0 }}>Ver todos →</button>
        </div>
        {lastDiag ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
              <ScoreMeter score={lastDiag.score!} color={lastDiag.color} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 800, color: lastDiag.color }}>{lastDiag.score}</span>
                <span style={{ fontSize: 9, color: '#5A7A85', fontFamily: 'Inter' }}>score</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 700, color: lastDiag.color, marginBottom: 4 }}>{lastDiag.result}</div>
              <div style={{ fontSize: 12, color: '#5A7A85', marginBottom: 12 }}>{lastDiag.date}</div>
              <button onClick={() => onNavigate('user-diagnostics')} style={{ background: lastDiag.color + '15', color: lastDiag.color, border: 'none', borderRadius: 10, padding: '8px 14px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                Ver detalhes
              </button>
            </div>
          </div>
        ) : (
          <p style={{ color: '#5A7A85', fontSize: 14 }}>Nenhum diagnóstico ainda.</p>
        )}
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* CTA Button */}
        <button
          onClick={() => onNavigate('user-capture')}
          style={{
            background: 'linear-gradient(135deg, #16A34A 0%, #15803d 100%)',
            color: '#fff', border: 'none', borderRadius: 18,
            padding: '20px',
            fontFamily: 'Outfit', fontWeight: 800, fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: '0 8px 24px rgba(22,163,74,0.35)',
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>📸</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 2 }}>Novo Diagnóstico</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500, fontFamily: 'Inter' }}>Capture e analise com IA agora</div>
          </div>
        </button>

        {/* Recent exams */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '16px', border: '1px solid rgba(11,107,130,0.08)' }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 14, fontWeight: 700, color: '#0F2A35', margin: '0 0 12px' }}>Histórico Recente</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {mockDiagnostics.slice(0, 3).map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F8FCFD', borderRadius: 12, cursor: 'pointer' }} onClick={() => onNavigate('user-diagnostics')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F2A35', fontFamily: 'Outfit' }}>#{d.id} — {d.date}</div>
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: d.color, background: d.color + '15', padding: '3px 9px', borderRadius: 999 }}>
                  {d.status === 'Pendente' ? 'Pendente' : d.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips teaser */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div onClick={() => onNavigate('user-tips')} style={{ background: 'linear-gradient(135deg, #E0F4F8, #cce8f0)', borderRadius: 16, padding: '16px', cursor: 'pointer', border: '1px solid rgba(11,107,130,0.1)' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>💡</div>
            <div style={{ fontFamily: 'Outfit', fontSize: 13, fontWeight: 700, color: '#0B6B82' }}>Dicas</div>
            <div style={{ fontSize: 11, color: '#5A7A85' }}>6 dicas para você</div>
          </div>
          <div onClick={() => onNavigate('user-notifications')} style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: 16, padding: '16px', cursor: 'pointer', border: '1px solid rgba(22,163,74,0.1)', position: 'relative' }}>
            {unread > 0 && <div style={{ position: 'absolute', top: 10, right: 10, width: 18, height: 18, background: '#DC2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff', fontFamily: 'Outfit' }}>{unread}</div>}
            <div style={{ fontSize: 24, marginBottom: 8 }}>🔔</div>
            <div style={{ fontFamily: 'Outfit', fontSize: 13, fontWeight: 700, color: '#15803d' }}>Avisos</div>
            <div style={{ fontSize: 11, color: '#5A7A85' }}>{unread} não lidos</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CaptureView() {
  const [step, setStep] = useState<'guide' | 'calibrate' | 'capture' | 'done'>('guide')
  const [brightness, setBrightness] = useState(70)

  const steps = ['Orientações', 'Calibragem', 'Captura', 'Enviado']
  const stepKeys = ['guide', 'calibrate', 'capture', 'done']
  const activeIdx = stepKeys.indexOf(step)

  return (
    <div style={{ background: '#F0F9FF', minHeight: '100%' }}>
      {/* Progress */}
      <div style={{ background: '#fff', padding: '16px 20px', borderBottom: '1px solid rgba(11,107,130,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'unset' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: i <= activeIdx ? 'linear-gradient(135deg, #0B6B82, #0d8aa6)' : '#E0F4F8', color: i <= activeIdx ? '#fff' : '#5A7A85', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit', fontWeight: 700, fontSize: 12, flexShrink: 0, boxShadow: i <= activeIdx ? '0 2px 8px rgba(11,107,130,0.3)' : 'none' }}>
                  {i < activeIdx ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 10, color: i <= activeIdx ? '#0B6B82' : '#9CA3AF', fontWeight: i <= activeIdx ? 700 : 400, whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: i < activeIdx ? '#0B6B82' : '#E0F4F8', margin: '0 4px 14px' }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {step === 'guide' && (
          <div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#0F2A35', margin: '0 0 4px' }}>Recomendações</h2>
            <p style={{ color: '#5A7A85', fontSize: 13, marginBottom: 20 }}>Siga estas orientações para um resultado preciso</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {[
                { icon: '🌅', text: 'Realize o exame pela manhã, em jejum' },
                { icon: '🚫', text: 'Não use antisséptico bucal antes' },
                { icon: '💧', text: 'Mantenha-se hidratado(a)' },
                { icon: '💡', text: 'Tenha boa iluminação no ambiente' },
                { icon: '🔦', text: 'Ative o flash do celular' },
                { icon: '👅', text: 'Mantenha a língua relaxada e estendida' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#fff', borderRadius: 14, border: '1px solid rgba(11,107,130,0.08)' }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, color: '#0F2A35', lineHeight: 1.4 }}>{item.text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setStep('calibrate')} style={{ width: '100%', background: 'linear-gradient(135deg, #0B6B82, #0d8aa6)', color: '#fff', border: 'none', borderRadius: 16, padding: '16px', fontFamily: 'Outfit', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 6px 20px rgba(11,107,130,0.3)' }}>
              Próximo →
            </button>
          </div>
        )}

        {step === 'calibrate' && (
          <div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#0F2A35', margin: '0 0 4px' }}>Calibragem</h2>
            <p style={{ color: '#5A7A85', fontSize: 13, marginBottom: 20 }}>Ajuste o brilho para melhor captura</p>
            <div style={{ background: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, border: '1px solid rgba(11,107,130,0.08)' }}>
              <div style={{ width: 180, height: 180, background: `hsl(200, 55%, ${brightness}%)`, borderRadius: '50%', margin: '0 auto 20px', border: '3px dashed rgba(11,107,130,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, boxShadow: `0 0 40px hsl(200,55%,${brightness}%, 0.4)` }}>
                👅
              </div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0F2A35', marginBottom: 10, fontFamily: 'Outfit', textAlign: 'center' }}>
                Brilho: <span style={{ color: '#0B6B82' }}>{brightness}%</span>
              </label>
              <input type="range" min={20} max={100} value={brightness} onChange={e => setBrightness(Number(e.target.value))} style={{ width: '100%', accentColor: '#0B6B82' }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep('guide')} style={{ flex: 1, background: '#E0F4F8', color: '#0B6B82', border: 'none', borderRadius: 14, padding: '14px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>← Voltar</button>
              <button onClick={() => setStep('capture')} style={{ flex: 2, background: 'linear-gradient(135deg, #0B6B82, #0d8aa6)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontFamily: 'Outfit', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(11,107,130,0.3)' }}>Próximo →</button>
            </div>
          </div>
        )}

        {step === 'capture' && (
          <div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#0F2A35', margin: '0 0 4px' }}>Capturar</h2>
            <p style={{ color: '#5A7A85', fontSize: 13, marginBottom: 16 }}>Posicione e tire a foto da sua língua</p>
            <div style={{ background: '#0a3d4a', borderRadius: 20, padding: 20, marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
              <div style={{ width: '100%', aspectRatio: '1', maxWidth: 280, border: '2px dashed rgba(255,255,255,0.25)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ width: 24, height: 24, borderTop: '3px solid #4ade80', borderLeft: '3px solid #4ade80', position: 'absolute', top: 0, left: 0, borderRadius: '4px 0 0 0' }} />
                <div style={{ width: 24, height: 24, borderTop: '3px solid #4ade80', borderRight: '3px solid #4ade80', position: 'absolute', top: 0, right: 0, borderRadius: '0 4px 0 0' }} />
                <div style={{ width: 24, height: 24, borderBottom: '3px solid #4ade80', borderLeft: '3px solid #4ade80', position: 'absolute', bottom: 0, left: 0, borderRadius: '0 0 0 4px' }} />
                <div style={{ width: 24, height: 24, borderBottom: '3px solid #4ade80', borderRight: '3px solid #4ade80', position: 'absolute', bottom: 0, right: 0, borderRadius: '0 0 4px 0' }} />
                <span style={{ fontSize: 80 }}>👅</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'Inter', textAlign: 'center', margin: 0 }}>Simulação — câmera real em produção</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep('calibrate')} style={{ flex: 1, background: '#E0F4F8', color: '#0B6B82', border: 'none', borderRadius: 14, padding: '14px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>← Voltar</button>
              <button onClick={() => setStep('done')} style={{ flex: 2, background: 'linear-gradient(135deg, #16A34A, #15803d)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontFamily: 'Outfit', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(22,163,74,0.3)' }}>📸 Capturar</button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #16A34A, #15803d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(22,163,74,0.35)' }}>✓</div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 800, color: '#16A34A', margin: '0 0 10px' }}>Enviado com sucesso!</h2>
            <p style={{ color: '#5A7A85', fontSize: 14, lineHeight: 1.6, marginBottom: 28, maxWidth: 280, margin: '0 auto 28px' }}>Sua imagem foi enviada para análise. O resultado chega em breve.</p>
            <button onClick={() => setStep('guide')} style={{ background: 'linear-gradient(135deg, #0B6B82, #0d8aa6)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px 28px', fontFamily: 'Outfit', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 6px 20px rgba(11,107,130,0.3)' }}>
              Nova Captura
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function DiagnosticsView({ onNavigate }: { onNavigate: (v: string) => void }) {
  const [selected, setSelected] = useState<typeof mockDiagnostics[0] | null>(null)

  if (selected) {
    return (
      <div style={{ background: '#F0F9FF', minHeight: '100%', padding: '20px 16px' }}>
        <button onClick={() => setSelected(null)} style={{ background: 'rgba(11,107,130,0.08)', border: 'none', borderRadius: 10, padding: '8px 14px', color: '#0B6B82', cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, marginBottom: 20 }}>← Voltar</button>
        <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(11,107,130,0.08)', marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 800, color: '#0F2A35', margin: '0 0 2px' }}>Diagnóstico #{selected.id}</h2>
              <p style={{ color: '#5A7A85', fontSize: 13, margin: 0 }}>{selected.date}</p>
            </div>
            <span style={{ background: selected.color + '15', color: selected.color, padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, fontFamily: 'Outfit' }}>{selected.status}</span>
          </div>

          {selected.score !== null && (
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ display: 'inline-flex', position: 'relative', marginBottom: 8 }}>
                <ScoreMeter score={selected.score} color={selected.color} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, color: selected.color }}>{selected.score}</span>
                  <span style={{ fontSize: 10, color: '#5A7A85' }}>score</span>
                </div>
              </div>
              <div style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700, color: selected.color }}>{selected.result}</div>
            </div>
          )}

          {selected.status === 'Pendente' && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
              <p style={{ color: '#5A7A85', fontSize: 14 }}>Aguardando análise da IA.</p>
            </div>
          )}

          {selected.score !== null && (
            <div style={{ background: '#F0F9FF', borderRadius: 14, padding: '14px', border: '1px solid rgba(11,107,130,0.08)' }}>
              <div style={{ fontFamily: 'Outfit', fontSize: 13, fontWeight: 700, color: '#0F2A35', marginBottom: 6 }}>Recomendação</div>
              <p style={{ fontSize: 13, color: '#5A7A85', lineHeight: 1.6, margin: 0 }}>Com base na análise da imagem, identificamos saburra lingual. Recomendamos limpeza lingual diária, aumento de hidratação e consulta periodontal.</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#F0F9FF', minHeight: '100%' }}>
      <div style={{ background: 'linear-gradient(135deg, #0a3d4a, #0B6B82)', padding: '20px 20px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 2px' }}>Meus Diagnósticos</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>{mockDiagnostics.length} exames</p>
          </div>
          <button onClick={() => onNavigate('user-capture')} style={{ background: '#16A34A', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 14px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 12px rgba(22,163,74,0.4)' }}>+ Novo</button>
        </div>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {mockDiagnostics.map(d => (
          <div key={d.id} onClick={() => setSelected(d)} style={{ background: '#fff', borderRadius: 16, padding: '16px', border: '1px solid rgba(11,107,130,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: d.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {d.score !== null ? (
                <span style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 800, color: d.color }}>{d.score}</span>
              ) : (
                <span style={{ fontSize: 20 }}>⏳</span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Outfit', fontSize: 14, fontWeight: 700, color: '#0F2A35' }}>Diagnóstico #{d.id}</div>
              <div style={{ fontSize: 12, color: '#5A7A85' }}>{d.date}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: d.color, background: d.color + '15', padding: '4px 10px', borderRadius: 999 }}>
                {d.status === 'Pendente' ? 'Pendente' : d.result}
              </span>
              <span style={{ color: '#C5E2EA' }}>›</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TipsView() {
  const [selected, setSelected] = useState<typeof tips[0] | null>(null)

  return (
    <div style={{ background: '#F0F9FF', minHeight: '100%' }}>
      <div style={{ background: 'linear-gradient(135deg, #0a3d4a, #0B6B82)', padding: '20px 20px 28px' }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 2px' }}>Dicas de Tratamento</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>Orientações para o seu dia a dia</p>
      </div>
      <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {tips.map(tip => (
          <div key={tip.id} onClick={() => setSelected(tip)} style={{ background: '#fff', borderRadius: 18, padding: '18px 14px', border: '1px solid rgba(11,107,130,0.08)', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{tip.icon}</div>
            <span style={{ fontSize: 10, background: '#E0F4F8', color: '#0B6B82', borderRadius: 999, padding: '2px 8px', fontWeight: 700, fontFamily: 'Outfit' }}>{tip.tag}</span>
            <div style={{ fontFamily: 'Outfit', fontSize: 14, fontWeight: 700, color: '#0F2A35', marginTop: 8, lineHeight: 1.3 }}>{tip.title}</div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,61,74,0.7)', display: 'flex', alignItems: 'flex-end', zIndex: 200, backdropFilter: 'blur(4px)' }} onClick={() => setSelected(null)}>
          <div style={{ background: '#fff', borderRadius: '28px 28px 0 0', padding: '28px 24px 40px', width: '100%', maxWidth: 390, margin: '0 auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: 40, height: 4, background: '#E0F4F8', borderRadius: 999, margin: '0 auto 20px' }} />
            <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 12 }}>{selected.icon}</div>
            <span style={{ display: 'block', textAlign: 'center', fontSize: 11, background: '#E0F4F8', color: '#0B6B82', borderRadius: 999, padding: '3px 12px', fontWeight: 700, fontFamily: 'Outfit', width: 'fit-content', margin: '0 auto 12px' }}>{selected.tag}</span>
            <h2 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#0F2A35', margin: '0 0 12px', textAlign: 'center' }}>{selected.title}</h2>
            <p style={{ fontSize: 15, color: '#5A7A85', lineHeight: 1.7, marginBottom: 24, textAlign: 'center' }}>{selected.content}</p>
            <button onClick={() => setSelected(null)} style={{ width: '100%', background: 'linear-gradient(135deg, #0B6B82, #0d8aa6)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontFamily: 'Outfit', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  )
}

function NotificationsView() {
  const [notifs, setNotifs] = useState(notifications)
  const markRead = (id: number) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  return (
    <div style={{ background: '#F0F9FF', minHeight: '100%' }}>
      <div style={{ background: 'linear-gradient(135deg, #0a3d4a, #0B6B82)', padding: '20px 20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 2px' }}>Avisos</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>{notifs.filter(n => !n.read).length} não lidos</p>
        </div>
        <button onClick={() => setNotifs(prev => prev.map(n => ({ ...n, read: true })))} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: 10, padding: '7px 12px', fontFamily: 'Outfit', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>Marcar lidos</button>
      </div>
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {notifs.map(n => (
          <div key={n.id} onClick={() => markRead(n.id)} style={{ background: n.read ? '#fff' : 'linear-gradient(135deg, rgba(11,107,130,0.06), rgba(22,163,74,0.04))', borderRadius: 16, padding: '14px 16px', border: `1px solid ${n.read ? 'rgba(11,107,130,0.08)' : 'rgba(11,107,130,0.2)'}`, cursor: 'pointer' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: n.read ? '#F0F9FF' : '#E0F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{n.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                  <span style={{ fontFamily: 'Outfit', fontSize: 14, fontWeight: 700, color: '#0F2A35' }}>{n.title}</span>
                  <span style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0, marginLeft: 8 }}>{n.date}</span>
                </div>
                <p style={{ fontSize: 12, color: '#5A7A85', margin: 0, lineHeight: 1.5 }}>{n.body}</p>
              </div>
              {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0B6B82', flexShrink: 0, marginTop: 4 }} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfileView({ user }: { user: User }) {
  const [editing, setEditing] = useState(false)
  const [formName, setFormName] = useState(user.name)
  const [formEmail, setFormEmail] = useState(user.email)
  const [formPhone, setFormPhone] = useState('(11) 99999-1234')
  const [saved, setSaved] = useState(false)

  return (
    <div style={{ background: '#F0F9FF', minHeight: '100%' }}>
      <div style={{ background: 'linear-gradient(135deg, #0a3d4a, #0B6B82)', padding: '28px 20px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(22,163,74,0.15)', filter: 'blur(20px)' }} />
        <div style={{ width: 72, height: 72, borderRadius: 22, background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Outfit', fontWeight: 800, fontSize: 28, margin: '0 auto 12px', border: '2px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}>
          {user.name.charAt(0)}
        </div>
        <div style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 800, color: '#fff' }}>{user.name}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Usuário Free</div>
      </div>

      <div style={{ margin: '24px 16px 0', background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 -4px 20px rgba(11,107,130,0.1)', border: '1px solid rgba(11,107,130,0.06)', marginBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Nome completo', value: formName, set: setFormName, icon: '👤' },
            { label: 'E-mail', value: formEmail, set: setFormEmail, icon: '✉️' },
            { label: 'Telefone', value: formPhone, set: setFormPhone, icon: '📱' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#5A7A85', marginBottom: 6, fontFamily: 'Outfit', letterSpacing: 0.5 }}>{f.label.toUpperCase()}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 14px', border: `1.5px solid ${editing ? '#0B6B82' : 'rgba(11,107,130,0.12)'}`, borderRadius: 14, background: editing ? '#fff' : '#F8FCFD' }}>
                <span style={{ fontSize: 16 }}>{f.icon}</span>
                <input
                  type="text"
                  value={f.value}
                  onChange={e => f.set(e.target.value)}
                  disabled={!editing}
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, fontFamily: 'Inter', color: '#0F2A35' }}
                />
              </div>
            </div>
          ))}
        </div>

        {saved && <div style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.1), rgba(22,163,74,0.05))', border: '1px solid rgba(22,163,74,0.2)', borderRadius: 12, padding: '10px 14px', color: '#16A34A', fontSize: 13, marginTop: 16, fontWeight: 600 }}>✅ Perfil atualizado!</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          {editing ? (
            <>
              <button onClick={() => { setEditing(false); setSaved(false) }} style={{ flex: 1, background: '#E0F4F8', color: '#0B6B82', border: 'none', borderRadius: 14, padding: '13px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={() => { setEditing(false); setSaved(true) }} style={{ flex: 2, background: 'linear-gradient(135deg, #0B6B82, #0d8aa6)', color: '#fff', border: 'none', borderRadius: 14, padding: '13px', fontFamily: 'Outfit', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(11,107,130,0.3)' }}>Salvar</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} style={{ flex: 1, background: 'linear-gradient(135deg, #0B6B82, #0d8aa6)', color: '#fff', border: 'none', borderRadius: 14, padding: '13px', fontFamily: 'Outfit', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 14px rgba(11,107,130,0.3)' }}>Editar perfil</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function UserDashboard({ user, activeView, onNavigate }: UserDashboardProps) {
  return (
    <div style={{ minHeight: '100%', background: '#F0F9FF' }}>
      {activeView === 'user-dashboard' && <Dashboard user={user} onNavigate={onNavigate} />}
      {activeView === 'user-capture' && <CaptureView />}
      {activeView === 'user-diagnostics' && <DiagnosticsView onNavigate={onNavigate} />}
      {activeView === 'user-tips' && <TipsView />}
      {activeView === 'user-notifications' && <NotificationsView />}
      {activeView === 'user-profile' && <ProfileView user={user} />}
    </div>
  )
}
