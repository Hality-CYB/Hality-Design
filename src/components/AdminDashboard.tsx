import { useState } from 'react'

interface AdminDashboardProps {
  activeView: string
  onNavigate: (view: string) => void
}

const mockUsers = [
  { id: 1, name: 'Ana Paula Ferreira', email: 'ana@email.com', role: 'Usuário', status: 'Ativo', diagnostics: 3, joined: '01/06/2026' },
  { id: 2, name: 'Carlos Mendes', email: 'carlos@email.com', role: 'Profissional', status: 'Ativo', diagnostics: 7, joined: '15/05/2026' },
  { id: 3, name: 'Fernanda Lima', email: 'fernanda@email.com', role: 'Usuário', status: 'Inativo', diagnostics: 1, joined: '20/04/2026' },
  { id: 4, name: 'Roberto Souza', email: 'roberto@email.com', role: 'Profissional', status: 'Ativo', diagnostics: 12, joined: '10/03/2026' },
  { id: 5, name: 'Julia Costa', email: 'julia@email.com', role: 'Usuário', status: 'Ativo', diagnostics: 2, joined: '05/07/2026' },
]

const adminDiagnostics = [
  { id: 1, user: 'Ana Paula Ferreira', date: '12/08/2026', status: 'Pendente', result: null },
  { id: 2, user: 'Carlos Mendes', date: '10/08/2026', status: 'Concluído', result: 'Halitose Moderada' },
  { id: 3, user: 'Roberto Souza', date: '08/08/2026', status: 'Concluído', result: 'Halitose Leve' },
  { id: 4, user: 'Julia Costa', date: '05/08/2026', status: 'Pendente', result: null },
  { id: 5, user: 'Fernanda Lima', date: '01/08/2026', status: 'Concluído', result: 'Halitose Severa' },
]

const adminTips = [
  { id: 1, title: 'Higiene da Língua', category: 'Higiene', status: 'Publicado' },
  { id: 2, title: 'Hidratação Adequada', category: 'Saúde', status: 'Publicado' },
  { id: 3, title: 'Alimentos Aliados', category: 'Nutrição', status: 'Rascunho' },
  { id: 4, title: 'Rotina de Higiene Bucal', category: 'Higiene', status: 'Publicado' },
]

const adminNotifications = [
  { id: 1, title: 'Manutenção programada', body: 'O sistema ficará indisponível no dia 20/08 das 02h às 04h.', target: 'Todos', sent: '14/08/2026' },
  { id: 2, title: 'Novo recurso disponível', body: 'A calibragem avançada de câmera está disponível para todos os usuários.', target: 'Todos', sent: '10/08/2026' },
  { id: 3, title: 'Lembrete de diagnóstico', body: 'Já faz 30 dias desde seu último exame. Realize um novo diagnóstico.', target: 'Inativos', sent: '05/08/2026' },
]

const anamnesisQuestions = [
  { id: 1, question: 'Você percebe mau hálito?', type: 'Sim/Não', active: true },
  { id: 2, question: 'Com que frequência escova os dentes?', type: 'Múltipla escolha', active: true },
  { id: 3, question: 'Você é fumante?', type: 'Sim/Não', active: true },
  { id: 4, question: 'Usa alguma medicação regularmente?', type: 'Texto', active: true },
  { id: 5, question: 'Tem sensação de boca seca?', type: 'Sim/Não', active: false },
  { id: 6, question: 'Passou por cirurgia bucal recentemente?', type: 'Sim/Não', active: true },
]

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '16px', border: '1px solid rgba(11,107,130,0.08)', boxShadow: '0 2px 12px rgba(11,107,130,0.06)' }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 800, color, marginBottom: 2 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#5A7A85', lineHeight: 1.3 }}>{label}</div>
    </div>
  )
}

function AdminOverview() {
  return (
    <div style={{ background: '#F0F9FF', minHeight: '100%' }}>
      <div style={{ background: 'linear-gradient(135deg, #0a3d4a, #0B6B82)', padding: '20px 20px 28px' }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 2px' }}>Painel Administrativo</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, margin: 0 }}>Hality — Visão geral</p>
      </div>
      <div style={{ padding: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
        <StatCard label="Total de Usuários" value="128" icon="👥" color="#0B6B82" />
        <StatCard label="Diagnósticos este mês" value="47" icon="🔬" color="#F59E0B" />
        <StatCard label="Pendentes de análise" value="12" icon="⏳" color="#DC2626" />
        <StatCard label="Dicas publicadas" value="6" icon="💡" color="#16A34A" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #C5E2EA' }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 17, fontWeight: 700, color: '#0F2A35', margin: '0 0 16px' }}>Diagnósticos Recentes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {adminDiagnostics.slice(0, 4).map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F0F9FF' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F2A35', fontFamily: 'Outfit' }}>{d.user}</div>
                  <div style={{ fontSize: 12, color: '#5A7A85' }}>{d.date}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: d.status === 'Pendente' ? '#F59E0B' : '#16A34A', background: d.status === 'Pendente' ? '#FEF3C7' : '#D1FAE5', padding: '3px 10px', borderRadius: 999 }}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #C5E2EA' }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 17, fontWeight: 700, color: '#0F2A35', margin: '0 0 16px' }}>Novos Usuários</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {mockUsers.slice(0, 4).map(u => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0', borderBottom: '1px solid #F0F9FF' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0B6B82', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit', fontWeight: 700, fontSize: 13 }}>
                  {u.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F2A35', fontFamily: 'Outfit' }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: '#5A7A85' }}>{u.role}</div>
                </div>
                <span style={{ fontSize: 11, color: u.status === 'Ativo' ? '#16A34A' : '#6B7280', fontWeight: 600 }}>{u.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

function UsersManagement() {
  const [search, setSearch] = useState('')
  const filtered = mockUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ padding: '20px 16px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, color: '#0F2A35', margin: '0 0 4px' }}>Gerenciar Usuários</h1>
          <p style={{ color: '#5A7A85', fontSize: 15, margin: 0 }}>{mockUsers.length} usuários cadastrados</p>
        </div>
        <button style={{ background: '#0B6B82', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>+ Novo Usuário</button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: 400, padding: '10px 14px', border: '1.5px solid #C5E2EA', borderRadius: 10, fontSize: 14, fontFamily: 'Inter', outline: 'none', boxSizing: 'border-box', color: '#0F2A35' }}
        />
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #C5E2EA', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F0F9FF' }}>
              {['Nome', 'E-mail', 'Perfil', 'Status', 'Diagnósticos', 'Cadastro', 'Ações'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#0B6B82', fontFamily: 'Outfit', borderBottom: '1px solid #C5E2EA' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F0F9FF' : 'none' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0B6B82', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                      {u.name.charAt(0)}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#0F2A35', fontFamily: 'Outfit' }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#5A7A85', fontFamily: 'Inter' }}>{u.email}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 12, color: '#0B6B82', background: '#E0F4F8', padding: '3px 10px', borderRadius: 999, fontWeight: 600 }}>{u.role}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: u.status === 'Ativo' ? '#16A34A' : '#6B7280', background: u.status === 'Ativo' ? '#D1FAE5' : '#F3F4F6', padding: '3px 10px', borderRadius: 999 }}>{u.status}</span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#0F2A35', textAlign: 'center' }}>{u.diagnostics}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#5A7A85' }}>{u.joined}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ background: '#E0F4F8', color: '#0B6B82', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 600 }}>Editar</button>
                    <button style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 600 }}>Bloquear</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DiagnosticsManagement() {
  const [filter, setFilter] = useState<'Todos' | 'Pendente' | 'Concluído'>('Todos')
  const filtered = filter === 'Todos' ? adminDiagnostics : adminDiagnostics.filter(d => d.status === filter)

  return (
    <div style={{ padding: '20px 16px', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, color: '#0F2A35', margin: '0 0 14px' }}>Gerenciar Diagnósticos</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['Todos', 'Pendente', 'Concluído'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? '#0B6B82' : '#E0F4F8', color: filter === f ? '#fff' : '#0B6B82', border: 'none', borderRadius: 8, padding: '8px 18px', fontFamily: 'Outfit', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #C5E2EA', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F0F9FF' }}>
              {['#', 'Paciente', 'Data', 'Status', 'Resultado', 'Ações'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#0B6B82', fontFamily: 'Outfit', borderBottom: '1px solid #C5E2EA' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <tr key={d.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F0F9FF' : 'none' }}>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#5A7A85' }}>#{d.id}</td>
                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#0F2A35', fontFamily: 'Outfit' }}>{d.user}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#5A7A85' }}>{d.date}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: d.status === 'Pendente' ? '#F59E0B' : '#16A34A', background: d.status === 'Pendente' ? '#FEF3C7' : '#D1FAE5', padding: '3px 10px', borderRadius: 999 }}>
                    {d.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#0F2A35' }}>{d.result || '—'}</td>
                <td style={{ padding: '14px 16px' }}>
                  <button style={{ background: '#E0F4F8', color: '#0B6B82', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 600 }}>
                    {d.status === 'Pendente' ? 'Analisar' : 'Ver'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TipsManagement() {
  const [tips, setTips] = useState(adminTips)
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('Higiene')

  const addTip = () => {
    if (!newTitle) return
    setTips(prev => [...prev, { id: prev.length + 1, title: newTitle, category: newCategory, status: 'Rascunho' }])
    setNewTitle('')
    setShowForm(false)
  }

  return (
    <div style={{ padding: '20px 16px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, color: '#0F2A35', margin: 0 }}>Gerenciar Dicas</h1>
        <button onClick={() => setShowForm(true)} style={{ background: '#0B6B82', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>+ Nova Dica</button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #0B6B82', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 700, color: '#0F2A35', margin: '0 0 16px' }}>Nova Dica</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input type="text" placeholder="Título da dica" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ padding: '10px 14px', border: '1.5px solid #C5E2EA', borderRadius: 10, fontSize: 14, fontFamily: 'Inter', outline: 'none', color: '#0F2A35' }} />
            <select value={newCategory} onChange={e => setNewCategory(e.target.value)} style={{ padding: '10px 14px', border: '1.5px solid #C5E2EA', borderRadius: 10, fontSize: 14, fontFamily: 'Inter', outline: 'none', color: '#0F2A35', background: '#fff' }}>
              {['Higiene', 'Saúde', 'Nutrição', 'Tratamento'].map(c => <option key={c}>{c}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, background: '#E0F4F8', color: '#0B6B82', border: 'none', borderRadius: 10, padding: '10px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={addTip} style={{ flex: 2, background: '#0B6B82', color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tips.map(tip => (
          <div key={tip.id} style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: '1px solid #C5E2EA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'Outfit', fontSize: 15, fontWeight: 700, color: '#0F2A35', marginBottom: 4 }}>{tip.title}</div>
              <span style={{ fontSize: 12, color: '#0B6B82', background: '#E0F4F8', padding: '2px 8px', borderRadius: 999 }}>{tip.category}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: tip.status === 'Publicado' ? '#16A34A' : '#6B7280', background: tip.status === 'Publicado' ? '#D1FAE5' : '#F3F4F6', padding: '3px 10px', borderRadius: 999 }}>{tip.status}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ background: '#E0F4F8', color: '#0B6B82', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 600 }}>Editar</button>
                <button onClick={() => setTips(prev => prev.filter(t => t.id !== tip.id))} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 600 }}>Remover</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NotificationsManagement() {
  const [notifs, setNotifs] = useState(adminNotifications)
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newBody, setNewBody] = useState('')

  const addNotif = () => {
    if (!newTitle || !newBody) return
    setNotifs(prev => [...prev, { id: prev.length + 1, title: newTitle, body: newBody, target: 'Todos', sent: new Date().toLocaleDateString('pt-BR') }])
    setNewTitle(''); setNewBody(''); setShowForm(false)
  }

  return (
    <div style={{ padding: '20px 16px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, color: '#0F2A35', margin: 0 }}>Gerenciar Avisos</h1>
        <button onClick={() => setShowForm(true)} style={{ background: '#0B6B82', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>+ Novo Aviso</button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #0B6B82', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 700, color: '#0F2A35', margin: '0 0 16px' }}>Novo Aviso</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input type="text" placeholder="Título" value={newTitle} onChange={e => setNewTitle(e.target.value)} style={{ padding: '10px 14px', border: '1.5px solid #C5E2EA', borderRadius: 10, fontSize: 14, fontFamily: 'Inter', outline: 'none', color: '#0F2A35' }} />
            <textarea placeholder="Mensagem" value={newBody} onChange={e => setNewBody(e.target.value)} rows={3} style={{ padding: '10px 14px', border: '1.5px solid #C5E2EA', borderRadius: 10, fontSize: 14, fontFamily: 'Inter', outline: 'none', resize: 'vertical', color: '#0F2A35' }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, background: '#E0F4F8', color: '#0B6B82', border: 'none', borderRadius: 10, padding: '10px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={addNotif} style={{ flex: 2, background: '#0B6B82', color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Enviar Aviso</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notifs.map(n => (
          <div key={n.id} style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: '1px solid #C5E2EA' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'Outfit', fontSize: 15, fontWeight: 700, color: '#0F2A35', marginBottom: 4 }}>{n.title}</div>
                <p style={{ fontSize: 13, color: '#5A7A85', margin: '0 0 8px', lineHeight: 1.5 }}>{n.body}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#0B6B82', background: '#E0F4F8', padding: '2px 8px', borderRadius: 999 }}>Para: {n.target}</span>
                  <span style={{ fontSize: 11, color: '#5A7A85' }}>Enviado em {n.sent}</span>
                </div>
              </div>
              <button onClick={() => setNotifs(prev => prev.filter(x => x.id !== n.id))} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 600, flexShrink: 0 }}>Remover</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnamnesisManagement() {
  const [questions, setQuestions] = useState(anamnesisQuestions)
  const [showForm, setShowForm] = useState(false)
  const [newQ, setNewQ] = useState('')
  const [newType, setNewType] = useState('Sim/Não')

  const toggleActive = (id: number) => setQuestions(prev => prev.map(q => q.id === id ? { ...q, active: !q.active } : q))
  const addQuestion = () => {
    if (!newQ) return
    setQuestions(prev => [...prev, { id: prev.length + 1, question: newQ, type: newType, active: true }])
    setNewQ(''); setShowForm(false)
  }

  return (
    <div style={{ padding: '20px 16px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, color: '#0F2A35', margin: 0 }}>Gerenciar Anamnese</h1>
        <button onClick={() => setShowForm(true)} style={{ background: '#0B6B82', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>+ Nova Pergunta</button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #0B6B82', marginBottom: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input type="text" placeholder="Pergunta da anamnese" value={newQ} onChange={e => setNewQ(e.target.value)} style={{ padding: '10px 14px', border: '1.5px solid #C5E2EA', borderRadius: 10, fontSize: 14, fontFamily: 'Inter', outline: 'none', color: '#0F2A35' }} />
            <select value={newType} onChange={e => setNewType(e.target.value)} style={{ padding: '10px 14px', border: '1.5px solid #C5E2EA', borderRadius: 10, fontSize: 14, fontFamily: 'Inter', outline: 'none', color: '#0F2A35', background: '#fff' }}>
              {['Sim/Não', 'Múltipla escolha', 'Texto', 'Escala 1-5'].map(t => <option key={t}>{t}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, background: '#E0F4F8', color: '#0B6B82', border: 'none', borderRadius: 10, padding: '10px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Cancelar</button>
              <button onClick={addQuestion} style={{ flex: 2, background: '#0B6B82', color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {questions.map((q, i) => (
          <div key={q.id} style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: '1px solid #C5E2EA', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: q.active ? 1 : 0.6 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: '#5A7A85', fontFamily: 'Inter' }}>#{i + 1}</span>
                <span style={{ fontFamily: 'Outfit', fontSize: 15, fontWeight: 700, color: '#0F2A35' }}>{q.question}</span>
              </div>
              <span style={{ fontSize: 11, color: '#0B6B82', background: '#E0F4F8', padding: '2px 8px', borderRadius: 999 }}>{q.type}</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => toggleActive(q.id)} style={{ background: q.active ? '#FEF3C7' : '#D1FAE5', color: q.active ? '#92400E' : '#065F46', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 600 }}>
                {q.active ? 'Desativar' : 'Ativar'}
              </button>
              <button onClick={() => setQuestions(prev => prev.filter(x => x.id !== q.id))} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 600 }}>Remover</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboard({ activeView, onNavigate: _onNavigate }: AdminDashboardProps) {
  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: '#F0F9FF' }}>
      {activeView === 'admin-dashboard' && <AdminOverview />}
      {activeView === 'admin-users' && <UsersManagement />}
      {activeView === 'admin-diagnostics' && <DiagnosticsManagement />}
      {activeView === 'admin-tips' && <TipsManagement />}
      {activeView === 'admin-notifications' && <NotificationsManagement />}
      {activeView === 'admin-anamnesis' && <AnamnesisManagement />}
    </div>
  )
}
