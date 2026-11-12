import {
  Occurrence,
  OccurrenceCategory,
  OccurrenceStatus,
  SmartPoleState,
  UserProfile,
} from '../types';
import { COLORS } from '../theme/theme';

export const MOCK_USERS: Record<'CITIZEN' | 'AGENT', UserProfile> = {
  CITIZEN: {
    id: 'usr-citizen-01',
    name: 'Clara Vasconcelos',
    role: 'CITIZEN',
    roleLabel: 'Cidadã • Moradora do Bairro',
    neighborhood: 'Jardim Botânico • Setor Norte',
    badgeCode: 'CID-8842',
    avatarInitials: 'CV',
  },
  AGENT: {
    id: 'usr-agent-01',
    name: 'Eng. Marcos Silveira',
    role: 'AGENT',
    roleLabel: 'Agente Técnico de Zeladoria',
    neighborhood: 'Unidade Operacional • Regional 04',
    badgeCode: 'AGT-0419',
    avatarInitials: 'MS',
  },
};

export interface CategoryMeta {
  id: OccurrenceCategory;
  label: string;
  shortLabel: string;
  code: string;
  description: string;
  defaultPhotoUri: string;
  iconName: string;
}

export const CATEGORIES: Record<OccurrenceCategory, CategoryMeta> = {
  ILUMINACAO: {
    id: 'ILUMINACAO',
    label: 'Iluminação Pública / Poste Apagado',
    shortLabel: 'Iluminação',
    code: 'LUM-01',
    description: 'Postes apagados à noite, luminárias piscando ou fiação exposta.',
    defaultPhotoUri:
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80',
    iconName: 'bulb-outline',
  },
  BURACO_VIA: {
    id: 'BURACO_VIA',
    label: 'Buraco na Via / Pavimentação',
    shortLabel: 'Pavimentação',
    code: 'PAV-02',
    description: 'Asfalto cedendo, crateras na pista ou calçada danificada.',
    defaultPhotoUri:
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=900&q=80',
    iconName: 'construct-outline',
  },
  ACUMULO_LIXO: {
    id: 'ACUMULO_LIXO',
    label: 'Acúmulo de Lixo / Descarte Irregular',
    shortLabel: 'Limpeza Urbana',
    code: 'LMP-03',
    description: 'Entulho na calçada, lixeiras transbordando ou coleta pendente.',
    defaultPhotoUri:
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=900&q=80',
    iconName: 'trash-outline',
  },
  ARVORE_PODA: {
    id: 'ARVORE_PODA',
    label: 'Manejo Arbóreo / Queda de Galhos',
    shortLabel: 'Árvores & Poda',
    code: 'BIO-04',
    description: 'Galhos obstruindo passagem, risco de queda ou conflito com rede.',
    defaultPhotoUri:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80',
    iconName: 'leaf-outline',
  },
  DRENAGEM: {
    id: 'DRENAGEM',
    label: 'Bueiro Obstruído / Alagamento',
    shortLabel: 'Drenagem',
    code: 'HID-05',
    description: 'Boca de lobo entupida, vazamento de água ou acúmulo pluvial.',
    defaultPhotoUri:
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80',
    iconName: 'water-outline',
  },
};

export interface StatusMeta {
  id: OccurrenceStatus;
  label: string;
  step: number;
  color: string;
  bgColor: string;
  description: string;
}

export const STATUS_META: Record<OccurrenceStatus, StatusMeta> = {
  ABERTA: {
    id: 'ABERTA',
    label: 'Aberta',
    step: 1,
    color: COLORS.statusOpen,
    bgColor: 'rgba(204, 88, 51, 0.14)',
    description: 'Chamado registrado na fila da central de zeladoria.',
  },
  EM_ANALISE: {
    id: 'EM_ANALISE',
    label: 'Em análise',
    step: 2,
    color: COLORS.statusAnalysis,
    bgColor: 'rgba(212, 154, 54, 0.16)',
    description: 'Triagem técnica validando prioridade e materiais necessários.',
  },
  EM_ANDAMENTO: {
    id: 'EM_ANDAMENTO',
    label: 'Em andamento',
    step: 3,
    color: COLORS.statusProgress,
    bgColor: 'rgba(59, 110, 140, 0.15)',
    description: 'Equipe de campo deslocada e executando o reparo no local.',
  },
  RESOLVIDA: {
    id: 'RESOLVIDA',
    label: 'Resolvida',
    step: 4,
    color: COLORS.statusResolved,
    bgColor: 'rgba(46, 107, 71, 0.15)',
    description: 'Intervenção concluída e auditada pelo agente responsável.',
  },
};

export const STATUS_ORDER: OccurrenceStatus[] = [
  'ABERTA',
  'EM_ANALISE',
  'EM_ANDAMENTO',
  'RESOLVIDA',
];

export const PRESET_LOCATIONS = [
  {
    address: 'Rua das Figueiras, 240 — Jardim Botânico',
    reference: 'Em frente à Padaria Artesanal',
    coordinates: '-23.5642, -46.6521',
  },
  {
    address: 'Av. das Araucárias, 410 — Praça Central',
    reference: 'Ao lado do Poste Inteligente #PZ-042',
    coordinates: '-23.5618, -46.6554',
  },
  {
    address: 'Travessa Ipê Amarelo, 88 — Setor Norte',
    reference: 'Esquina com a ciclovia principal',
    coordinates: '-23.5591, -46.6498',
  },
  {
    address: 'Alameda dos Jatobás, 1120 — Parque Linear',
    reference: 'Próximo ao ponto de ônibus linha 402',
    coordinates: '-23.5675, -46.6589',
  },
];

export const INITIAL_SMART_POLE: SmartPoleState = {
  poleId: 'PZ-042',
  name: 'Poste Inteligente • Nó #PZ-042',
  address: 'Av. das Araucárias, 410 — Praça Central',
  coordinates: '-23.5618, -46.6554',
  ambientLux: 420, // Daylight initially
  darkThresholdLux: 25,
  isLampHardwareOk: true,
  isLightEmitting: false,
  voltageV: 220.4,
  powerDrawWatts: 2.1, // Standby sensor draw during day
  lastHeartbeat: new Date().toISOString(),
  lastAutoOccurrenceProtocol: null,
};

export const INITIAL_OCCURRENCES: Occurrence[] = [
  {
    id: 'occ-101',
    protocol: 'ZEL-2026-0891',
    title: 'Afundamento asfáltico na faixa de rolamento',
    description:
      'Buraco profundo formado após as chuvas da última terça-feira, obrigando veículos e ciclistas a desviarem bruscamente.',
    category: 'BURACO_VIA',
    status: 'EM_ANDAMENTO',
    origin: 'CITIZEN',
    location: {
      address: 'Rua das Figueiras, 240 — Jardim Botânico',
      reference: 'Em frente à Padaria Artesanal',
      coordinates: '-23.5642, -46.6521',
    },
    photoUri:
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=900&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    reporterId: 'usr-citizen-01',
    reporterName: 'Clara Vasconcelos',
    assignedAgentName: 'Eng. Marcos Silveira',
    history: [
      {
        id: 'hist-1',
        status: 'ABERTA',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        actorName: 'Clara Vasconcelos',
        actorRole: 'CITIZEN',
        note: 'Ocorrência registrada pelo aplicativo com foto e coordenadas GPS.',
      },
      {
        id: 'hist-2',
        status: 'EM_ANALISE',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        actorName: 'Eng. Marcos Silveira',
        actorRole: 'AGENT',
        note: 'Vistoria remota aprovada. Classificado como prioridade alta para tapa-buraco a quente.',
      },
      {
        id: 'hist-3',
        status: 'EM_ANDAMENTO',
        timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
        actorName: 'Eng. Marcos Silveira',
        actorRole: 'AGENT',
        note: 'Equipe de pavimentação #03 no local realizando recorte e aplicação de CBUQ.',
      },
    ],
  },
  {
    id: 'occ-102',
    protocol: 'ZEL-2026-0892',
    title: 'Descarte irregular de resíduos volumosos na calçada',
    description:
      'Restos de poda e caixas acumuladas bloqueando metade do passeio de pedestres próximo à esquina.',
    category: 'ACUMULO_LIXO',
    status: 'EM_ANALISE',
    origin: 'CITIZEN',
    location: {
      address: 'Travessa Ipê Amarelo, 88 — Setor Norte',
      reference: 'Esquina com a ciclovia principal',
      coordinates: '-23.5591, -46.6498',
    },
    photoUri:
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=900&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    reporterId: 'usr-citizen-01',
    reporterName: 'Clara Vasconcelos',
    assignedAgentName: 'Eng. Marcos Silveira',
    history: [
      {
        id: 'hist-201',
        status: 'ABERTA',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        actorName: 'Clara Vasconcelos',
        actorRole: 'CITIZEN',
        note: 'Relato enviado com registro fotográfico.',
      },
      {
        id: 'hist-202',
        status: 'EM_ANALISE',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        actorName: 'Eng. Marcos Silveira',
        actorRole: 'AGENT',
        note: 'Agendado caminhão cata-bagulho para a rota vespertina do Setor Norte.',
      },
    ],
  },
  {
    id: 'occ-103',
    protocol: 'ZEL-2026-0884',
    title: 'Galho de grande porte sobre iluminação de pedestres',
    description:
      'Após ventania, galho ficou apoiado na estrutura lateral da praça, gerando sombra excessiva e risco de queda.',
    category: 'ARVORE_PODA',
    status: 'RESOLVIDA',
    origin: 'CITIZEN',
    location: {
      address: 'Alameda dos Jatobás, 1120 — Parque Linear',
      reference: 'Próximo ao ponto de ônibus linha 402',
      coordinates: '-23.5675, -46.6589',
    },
    photoUri:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    reporterId: 'usr-citizen-01',
    reporterName: 'Clara Vasconcelos',
    assignedAgentName: 'Eng. Marcos Silveira',
    history: [
      {
        id: 'hist-301',
        status: 'ABERTA',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        actorName: 'Clara Vasconcelos',
        actorRole: 'CITIZEN',
        note: 'Solicitação de poda preventiva aberta pelo morador.',
      },
      {
        id: 'hist-302',
        status: 'EM_ANALISE',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
        actorName: 'Eng. Marcos Silveira',
        actorRole: 'AGENT',
        note: 'Laudo fitossanitário rápido aprovou poda de equilíbrio.',
      },
      {
        id: 'hist-303',
        status: 'EM_ANDAMENTO',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        actorName: 'Eng. Marcos Silveira',
        actorRole: 'AGENT',
        note: 'Equipe de manejo arbóreo isolou a área e iniciou corte seguro.',
      },
      {
        id: 'hist-304',
        status: 'RESOLVIDA',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
        actorName: 'Eng. Marcos Silveira',
        actorRole: 'AGENT',
        note: 'Galho removido, biomassa triturada para compostagem e calçada liberada.',
      },
    ],
  },
];
