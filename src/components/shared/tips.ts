import type { IconName } from './Icons'

// Dicas de saúde — mesma fonte usada na Home e nas Orientações do paciente,
// e gerenciada pelo admin em Conteúdos.
export type TipFormat = 'texto' | 'imagem' | 'video'
export type TipLevel = 1 | 2 | 3

export interface Tip {
  id: number
  title: string
  cat: string
  format: TipFormat
  body: string
  mediaUrl?: string
  iconName: IconName
  levels: TipLevel[]
  showOnHome: boolean
  pub: boolean
  order: number
  date: string
  views: number
}

export const TIPS: Tip[] = [
  { id: 1, title: 'Higiene da Língua', cat: 'Higiene', format: 'texto', body: 'Use um limpador de língua pela manhã. A saburra lingual é a principal causa da halitose. Passe suavemente 3 a 5 vezes da parte posterior para a ponta.', iconName: 'sparkles', levels: [1, 2, 3], showOnHome: true, pub: true, order: 1, date: '10/08/2026', views: 1230 },
  { id: 2, title: 'Hidratação', cat: 'Saúde', format: 'texto', body: 'Beba 2 litros de água por dia. A boca seca favorece o crescimento de bactérias anaeróbias que produzem compostos sulfurados, causadores do mau hálito.', iconName: 'drop', levels: [1, 2, 3], showOnHome: true, pub: true, order: 2, date: '08/08/2026', views: 874 },
  { id: 3, title: 'Alimentos Aliados', cat: 'Nutrição', format: 'texto', body: 'Consuma maçã, cenoura, salsinha e iogurte natural. Esses alimentos ajudam a neutralizar os compostos causadores do mau hálito de forma natural.', iconName: 'heart', levels: [2, 3], showOnHome: true, pub: true, order: 3, date: '05/08/2026', views: 401 },
  { id: 4, title: 'Rotina de Higiene', cat: 'Rotina', format: 'video', body: 'Vídeo demonstrativo: escove os dentes após cada refeição, use fio dental diariamente e enxaguante sem álcool para completar a limpeza bucal.', iconName: 'checkCircle', levels: [1, 2, 3], showOnHome: false, pub: true, order: 4, date: '01/08/2026', views: 512 },
  { id: 5, title: 'Consulta Periódica', cat: 'Saúde', format: 'texto', body: 'Visite seu dentista a cada 6 meses. Cáries e doença periodontal são causas frequentes de halitose que exigem tratamento profissional.', iconName: 'medical', levels: [2, 3], showOnHome: false, pub: true, order: 5, date: '28/07/2026', views: 340 },
  { id: 6, title: 'Evite Tabagismo', cat: 'Estilo de Vida', format: 'imagem', body: 'O cigarro resseca a mucosa oral e deposita substâncias odoríferas nos tecidos. Parar de fumar melhora significativamente o hálito.', iconName: 'noSymbol', levels: [3], showOnHome: false, pub: false, order: 6, date: '20/07/2026', views: 0 },
]
