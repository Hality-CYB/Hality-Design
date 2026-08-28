import halityLogo from '@/imports/Logo-Hality-rncwhngo9oo4u9tdlspy0644l1cpwnm78navwjh0jk.png'

interface LandingPageProps {
  onNavigate: (view: string) => void
}

const causes = [
  { icon: '🐟', title: 'Alimentação', desc: 'A quebra de partículas de comidas nos dentes pode aumentar o número de bactérias e causar odor desagradável.' },
  { icon: '🦷', title: 'Higienização Oral Falha', desc: 'Se você não escova os dentes e passa fio dental diariamente, partículas de comida permanecem na boca, causando mau hálito e saburra lingual.' },
  { icon: '🚬', title: 'Tabagismo', desc: 'Fumar causa mau odor característico. Fumantes também têm maior possibilidade de apresentar problemas na gengiva.' },
  { icon: '💧', title: 'Boca Seca', desc: 'A saliva ajuda a limpar a boca, removendo partículas que causam mau odor. A xerostomia pode contribuir para o mau hálito.' },
  { icon: '💊', title: 'Medicação', desc: 'Alguns medicamentos podem produzir mau hálito ao contribuírem com a boca seca ou ao liberar componentes químicos na respiração.' },
  { icon: '🦠', title: 'Infecções Na Boca', desc: 'O mau hálito pode ser causado pelas feridas resultantes de uma cirurgia oral, como a remoção de dentes ou ainda causado por cáries e gengivite.' },
  { icon: '👃', title: 'Problemas de Nariz e Garganta', desc: 'O mau hálito pode derivar de pequenos nódulos que se formam nas amígdalas e são cobertos por bactérias que produzem cheiro.' },
]

const steps = [
  { num: '01', title: 'Cadastre-se', desc: 'Crie sua conta gratuitamente na plataforma CYB.' },
  { num: '02', title: 'Capture a imagem', desc: 'Fotografe sua língua seguindo as recomendações de iluminação e posição.' },
  { num: '03', title: 'IA analisa', desc: 'Nossa inteligência artificial analisa a imagem e identifica padrões associados à halitose.' },
  { num: '04', title: 'Receba o diagnóstico', desc: 'Veja o resultado detalhado com dicas de tratamento personalizadas.' },
]

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#F0F9FF' }}>
      <style>{`
        .lp-section { padding: 80px 24px; }
        .lp-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .lp-steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .lp-reco-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .lp-heading { font-size: 36px; }
        .lp-phone { width: 280px; height: 480px; }
        @media (max-width: 860px) {
          .lp-section { padding: 56px 20px; }
          .lp-hero-grid { grid-template-columns: 1fr; gap: 40px; }
          .lp-hero-grid > div:first-child { text-align: center; }
          .lp-hero-grid > div:first-child > div:first-child { margin-left: auto; margin-right: auto; }
          .lp-hero-grid p { margin-left: auto; margin-right: auto; }
          .lp-hero-grid .lp-hero-actions { justify-content: center; }
          .lp-phone { width: 220px; height: 380px; }
          .lp-steps-grid { grid-template-columns: repeat(2, 1fr); }
          .lp-reco-grid { grid-template-columns: 1fr; }
          .lp-heading { font-size: 28px; }
        }
        @media (max-width: 480px) {
          .lp-section { padding: 40px 16px; }
          .lp-steps-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Hero */}
      <section className="lp-section" style={{ background: 'linear-gradient(135deg, #E0F4F8 0%, #F0F9FF 60%, #D4EDDA 100%)' }}>
        <div className="lp-hero-grid" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#C8EAD4', borderRadius: 999, padding: '6px 16px', marginBottom: 20 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#16A34A', fontFamily: 'Outfit', letterSpacing: 1 }}>TECNOLOGIA & IA</span>
            </div>
            <h1 style={{ fontFamily: 'Outfit', fontSize: 'clamp(28px, 6vw, 52px)', fontWeight: 800, color: '#0F2A35', lineHeight: 1.1, margin: '0 0 20px' }}>
              Diagnóstico inteligente do<br />
              <span style={{ color: '#0B6B82' }}>mau hálito</span> com IA
            </h1>
            <p style={{ fontSize: 16, color: '#5A7A85', lineHeight: 1.7, marginBottom: 36, maxWidth: 460 }}>
              Pioneira no Brasil, a Hality é especialista no diagnóstico e tratamento da halitose há mais de 10 anos. Agora com inteligência artificial para análise de imagens da língua.
            </p>
            <div className="lp-hero-actions" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('register')}
                style={{ background: '#16A34A', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 28px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 14px rgba(22,163,74,0.35)' }}
              >
                Realizar Diagnóstico
              </button>
              <button
                onClick={() => onNavigate('login')}
                style={{ background: '#fff', color: '#0B6B82', border: '2px solid #0B6B82', borderRadius: 10, padding: '14px 28px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
              >
                Já tenho conta
              </button>
            </div>
          </div>

          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div className="lp-phone" style={{ background: '#0F2A35', borderRadius: 40, padding: '12px', boxShadow: '0 30px 80px rgba(11,107,130,0.25)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg, #0B6B82 0%, #0a4f61 100%)', borderRadius: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '20px 16px' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fff', fontSize: 11, fontFamily: 'Inter' }}>Check Your Breath</span>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <div style={{ width: 180, height: 180, border: '2px dashed rgba(255,255,255,0.5)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ width: 16, height: 16, borderTop: '2px solid #4ade80', borderLeft: '2px solid #4ade80', position: 'absolute', top: -1, left: -1 }} />
                    <div style={{ width: 16, height: 16, borderTop: '2px solid #4ade80', borderRight: '2px solid #4ade80', position: 'absolute', top: -1, right: -1 }} />
                    <div style={{ width: 16, height: 16, borderBottom: '2px solid #4ade80', borderLeft: '2px solid #4ade80', position: 'absolute', bottom: -1, left: -1 }} />
                    <div style={{ width: 16, height: 16, borderBottom: '2px solid #4ade80', borderRight: '2px solid #4ade80', position: 'absolute', bottom: -1, right: -1 }} />
                    <span style={{ fontSize: 60 }}>👅</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, textAlign: 'center', fontFamily: 'Inter' }}>Posicione sua língua dentro do enquadramento</p>
                </div>
                <button style={{ width: 60, height: 60, borderRadius: '50%', background: '#fff', border: '3px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📷</button>
              </div>
            </div>
            <div style={{ position: 'absolute', top: 20, right: 0, background: '#fff', borderRadius: 12, padding: '10px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: 11, color: '#16A34A', fontWeight: 700, fontFamily: 'Outfit' }}>✓ IA Analisando</div>
              <div style={{ fontSize: 10, color: '#5A7A85', fontFamily: 'Inter' }}>Resultado em segundos</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="lp-section" style={{ background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="lp-heading" style={{ fontFamily: 'Outfit', fontWeight: 800, color: '#0F2A35', margin: '0 0 12px' }}>Como funciona</h2>
            <p style={{ color: '#5A7A85', fontSize: 16 }}>Diagnóstico rápido em 4 passos simples</p>
          </div>
          <div className="lp-steps-grid">
            {steps.map((step) => (
              <div key={step.num} style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#E0F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: 'Outfit', fontWeight: 800, fontSize: 18, color: '#0B6B82' }}>
                  {step.num}
                </div>
                <h3 style={{ fontFamily: 'Outfit', fontSize: 17, fontWeight: 700, color: '#0F2A35', margin: '0 0 8px' }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: '#5A7A85', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="lp-section" style={{ background: '#F0F9FF' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="lp-heading" style={{ fontFamily: 'Outfit', fontWeight: 800, color: '#0F2A35', margin: '0 0 12px' }}>Recomendações para o Exame</h2>
            <p style={{ color: '#5A7A85', fontSize: 16 }}>Siga essas orientações para garantir um diagnóstico preciso</p>
          </div>
          <div className="lp-reco-grid">
            {[
              { icon: '📋', text: 'Preencher corretamente o formulário de anamnese' },
              { icon: '📸', text: 'Realizar a foto conforme a demonstração no aplicativo' },
              { icon: '🔦', text: 'Com o celular na posição foto com flash ligado faça uma foto' },
              { icon: '🌅', text: 'Realizar o exame pela manhã, em jejum' },
              { icon: '🚫', text: 'Não usar antisséptico bucal antes do exame' },
              { icon: '💧', text: 'Manter-se hidratado(a) antes da captura' },
            ].map((rec, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #C5E2EA' }}>
                <span style={{ fontSize: 24 }}>{rec.icon}</span>
                <span style={{ fontSize: 14, color: '#0F2A35', lineHeight: 1.4 }}>{rec.text}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => onNavigate('register')}
              style={{ background: '#16A34A', color: '#fff', border: 'none', borderRadius: 10, padding: '16px 40px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 4px 14px rgba(22,163,74,0.3)' }}
            >
              REALIZAR DIAGNÓSTICO
            </button>
          </div>
        </div>
      </section>

      {/* Causes */}
      <section className="lp-section" style={{ background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="lp-heading" style={{ fontFamily: 'Outfit', fontWeight: 800, color: '#0F2A35', margin: '0 0 12px' }}>Causas da Halitose</h2>
            <p style={{ color: '#5A7A85', fontSize: 16 }}>Entenda os principais fatores que causam o mau hálito</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {causes.map((cause) => (
              <div key={cause.title} style={{ background: '#F0F9FF', borderRadius: 16, padding: 24, border: '1px solid #C5E2EA', transition: 'transform 0.2s' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{cause.icon}</div>
                <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 700, color: '#0B6B82', margin: '0 0 8px' }}>{cause.title}</h3>
                <p style={{ fontSize: 13, color: '#5A7A85', lineHeight: 1.6, margin: 0 }}>{cause.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-section" style={{ background: 'linear-gradient(135deg, #0B6B82, #0a4f61)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <img src={halityLogo} alt="Hality" style={{ height: 48, marginBottom: 24, filter: 'brightness(0) invert(1)' }} />
          <h2 className="lp-heading" style={{ fontFamily: 'Outfit', fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>
            Caro Dr(a), faça parte dessa revolução
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
            Iniciamos uma nova fase no diagnóstico da halitose e desde já agradecemos sua disponibilidade em ajudar a desenvolver nosso sistema.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('register')}
              style={{ background: '#16A34A', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 28px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
            >
              Criar conta grátis
            </button>
            <button style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10, padding: '14px 28px', fontFamily: 'Outfit', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              Entrar em Contato
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0F2A35', padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: 'Inter', margin: 0 }}>
          © 2026 Hality Diagnóstico do Hálito — Check Your Breath (CYB). Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}
