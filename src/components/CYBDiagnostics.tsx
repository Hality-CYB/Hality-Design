import { useState } from 'react'

const cybDiagnostics = [
  { id: 1, user: 'Ana Paula Ferreira', date: '12/08/2026', status: 'Pendente', image: '👅', anamnesis: { fumante: 'Não', escovacao: '2x ao dia', medicacao: 'Nenhuma', bocaSeca: 'Sim', cirurgia: 'Não' } },
  { id: 2, user: 'Julia Costa', date: '10/08/2026', status: 'Pendente', image: '👅', anamnesis: { fumante: 'Sim', escovacao: '1x ao dia', medicacao: 'Omeprazol', bocaSeca: 'Não', cirurgia: 'Não' } },
  { id: 3, user: 'Carlos Mendes', date: '08/08/2026', status: 'Concluído', image: '👅', result: 'Halitose Moderada', score: 68, notes: 'Saburra lingual grau 2. Recomendo limpeza lingual e avaliação periodontal.', anamnesis: { fumante: 'Não', escovacao: '3x ao dia', medicacao: 'Anti-hipertensivo', bocaSeca: 'Não', cirurgia: 'Não' } },
  { id: 4, user: 'Roberto Souza', date: '05/08/2026', status: 'Concluído', image: '👅', result: 'Halitose Leve', score: 28, notes: 'Leve saburra. Manter higiene e aumentar hidratação.', anamnesis: { fumante: 'Não', escovacao: '2x ao dia', medicacao: 'Nenhuma', bocaSeca: 'Sim', cirurgia: 'Sim' } },
  { id: 5, user: 'Fernanda Lima', date: '01/08/2026', status: 'Concluído', image: '👅', result: 'Halitose Severa', score: 92, notes: 'Saburra espessa grau 3 com pigmentação. Encaminhar para cirurgião-dentista.', anamnesis: { fumante: 'Sim', escovacao: '1x ao dia', medicacao: 'Nenhuma', bocaSeca: 'Sim', cirurgia: 'Não' } },
]

type Diag = typeof cybDiagnostics[0]

function DiagnosticDetail({ diag, onBack }: { diag: Diag; onBack: () => void }) {
  const [result, setResult] = useState(diag.result || '')
  const [score, setScore] = useState(diag.score || 50)
  const [notes, setNotes] = useState(diag.notes || '')
  const [status, setStatus] = useState(diag.status)
  const [saved, setSaved] = useState(false)

  const scoreColor = score < 33 ? '#16A34A' : score < 66 ? '#F59E0B' : '#DC2626'
  const scoreLabel = score < 33 ? 'Halitose Leve' : score < 66 ? 'Halitose Moderada' : 'Halitose Severa'

  const handleSave = () => {
    setStatus('Concluído')
    setSaved(true)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#0B6B82', cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 600, fontSize: 15, marginBottom: 24, padding: 0 }}>← Voltar</button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 26, fontWeight: 800, color: '#0F2A35', margin: '0 0 4px' }}>{diag.user}</h1>
          <p style={{ color: '#5A7A85', fontSize: 14, margin: 0 }}>Diagnóstico #{diag.id} — {diag.date}</p>
        </div>
        <span style={{ background: status === 'Pendente' ? '#FEF3C7' : '#D1FAE5', color: status === 'Pendente' ? '#92400E' : '#065F46', padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700 }}>
          {status}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 14 }}>
        {/* Image */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #C5E2EA' }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 15, fontWeight: 700, color: '#0F2A35', margin: '0 0 16px' }}>Imagem Capturada</h3>
          <div style={{ background: '#0F2A35', borderRadius: 12, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
            <span style={{ fontSize: 80 }}>{diag.image}</span>
          </div>
          <p style={{ fontSize: 12, color: '#5A7A85', textAlign: 'center', marginTop: 8 }}>Capturada em {diag.date}</p>
        </div>

        {/* Anamnesis */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #C5E2EA' }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 15, fontWeight: 700, color: '#0F2A35', margin: '0 0 16px' }}>Anamnese do Paciente</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Fumante', value: diag.anamnesis.fumante },
              { label: 'Frequência de escovação', value: diag.anamnesis.escovacao },
              { label: 'Medicação', value: diag.anamnesis.medicacao },
              { label: 'Boca seca', value: diag.anamnesis.bocaSeca },
              { label: 'Cirurgia bucal recente', value: diag.anamnesis.cirurgia },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F0F9FF', borderRadius: 8 }}>
                <span style={{ fontSize: 13, color: '#5A7A85' }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0F2A35' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Diagnosis form */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #C5E2EA' }}>
        <h3 style={{ fontFamily: 'Outfit', fontSize: 17, fontWeight: 700, color: '#0F2A35', margin: '0 0 20px' }}>
          {status === 'Concluído' ? 'Diagnóstico Registrado' : 'Registrar Diagnóstico'}
        </h3>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0F2A35', marginBottom: 8, fontFamily: 'Outfit' }}>
            Índice de Halitose: <span style={{ color: scoreColor }}>{score} — {scoreLabel}</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={score}
            onChange={e => setScore(Number(e.target.value))}
            style={{ width: '100%', accentColor: scoreColor }}
          />
          <div style={{ height: 10, background: 'linear-gradient(to right, #16A34A, #F59E0B, #DC2626)', borderRadius: 999, marginTop: 8, position: 'relative' }}>
            <div style={{ position: 'absolute', left: `${score}%`, top: '50%', transform: 'translate(-50%, -50%)', width: 16, height: 16, borderRadius: '50%', background: '#fff', border: `3px solid ${scoreColor}`, boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#5A7A85', marginTop: 4 }}>
            <span>Sem halitose</span>
            <span>Moderada</span>
            <span>Severa</span>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0F2A35', marginBottom: 6, fontFamily: 'Outfit' }}>Resultado / Classificação</label>
          <input
            type="text"
            value={result || scoreLabel}
            onChange={e => setResult(e.target.value)}
            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #C5E2EA', borderRadius: 10, fontSize: 14, fontFamily: 'Inter', outline: 'none', boxSizing: 'border-box', color: '#0F2A35' }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0F2A35', marginBottom: 6, fontFamily: 'Outfit' }}>Observações e Recomendações</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            placeholder="Descreva as observações clínicas e recomendações de tratamento..."
            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #C5E2EA', borderRadius: 10, fontSize: 14, fontFamily: 'Inter', outline: 'none', resize: 'vertical', boxSizing: 'border-box', color: '#0F2A35' }}
          />
        </div>

        {saved && (
          <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: 8, padding: '10px 14px', color: '#065F46', fontSize: 13, marginBottom: 16 }}>
            ✅ Diagnóstico salvo e enviado ao paciente com sucesso!
          </div>
        )}

        <button
          onClick={handleSave}
          style={{ background: status === 'Concluído' ? '#16A34A' : '#0B6B82', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 28px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 15, cursor: 'pointer', width: '100%' }}
        >
          {status === 'Concluído' ? '✅ Diagnóstico Concluído — Editar' : 'Salvar e Enviar Diagnóstico'}
        </button>
      </div>
    </div>
  )
}

export default function CYBDiagnostics() {
  const [selected, setSelected] = useState<Diag | null>(null)
  const [filter, setFilter] = useState<'Todos' | 'Pendente' | 'Concluído'>('Todos')

  const filtered = filter === 'Todos' ? cybDiagnostics : cybDiagnostics.filter(d => d.status === filter)

  if (selected) return (
    <div style={{ padding: '20px 16px' }}>
      <DiagnosticDetail diag={selected} onBack={() => setSelected(null)} />
    </div>
  )

  return (
    <div style={{ background: '#F0F9FF', padding: '20px 16px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#0F2A35', margin: '0 0 2px' }}>Diagnósticos CYB</h1>
          <p style={{ color: '#5A7A85', fontSize: 13, margin: 0 }}>Análise e resposta de diagnósticos</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Total', value: cybDiagnostics.length, color: '#0B6B82' },
            { label: 'Pendentes', value: cybDiagnostics.filter(d => d.status === 'Pendente').length, color: '#F59E0B' },
            { label: 'Concluídos', value: cybDiagnostics.filter(d => d.status === 'Concluído').length, color: '#16A34A' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: '1px solid #C5E2EA', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#5A7A85' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['Todos', 'Pendente', 'Concluído'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? '#0B6B82' : '#E0F4F8', color: filter === f ? '#fff' : '#0B6B82', border: 'none', borderRadius: 8, padding: '8px 18px', fontFamily: 'Outfit', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              {f}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(d => (
            <div
              key={d.id}
              onClick={() => setSelected(d)}
              style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', border: `1px solid ${d.status === 'Pendente' ? '#FCD34D' : '#C5E2EA'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(11,107,130,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🔬</div>
                <div>
                  <div style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 700, color: '#0F2A35', marginBottom: 2 }}>{d.user}</div>
                  <div style={{ fontSize: 13, color: '#5A7A85' }}>Capturado em {d.date}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {d.score !== undefined && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: d.score < 33 ? '#16A34A' : d.score < 66 ? '#F59E0B' : '#DC2626' }}>{d.score}</div>
                    <div style={{ fontSize: 10, color: '#5A7A85' }}>índice</div>
                  </div>
                )}
                <span style={{
                  background: d.status === 'Pendente' ? '#FEF3C7' : '#D1FAE5',
                  color: d.status === 'Pendente' ? '#92400E' : '#065F46',
                  padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700
                }}>
                  {d.status}
                </span>
                <span style={{ color: '#C5E2EA', fontSize: 18 }}>›</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
