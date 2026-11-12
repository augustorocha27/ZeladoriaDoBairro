import { CATEGORIES } from '../data/mockData';
import {
  Occurrence,
  OccurrenceCategory,
  OccurrenceStatus,
  SmartPoleState,
  UserProfile,
} from '../types';

export interface CreateCitizenOccurrenceInput {
  title: string;
  description: string;
  category: OccurrenceCategory;
  address: string;
  reference: string;
  coordinates: string;
  photoUri?: string;
  user: UserProfile;
}

export const occurrenceService = {
  generateProtocol(prefix = 'ZEL'): string {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-2026-${randomNum}`;
  },

  createCitizenOccurrence(input: CreateCitizenOccurrenceInput): Occurrence {
    const now = new Date().toISOString();
    const categoryMeta = CATEGORIES[input.category];
    const protocol = this.generateProtocol('ZEL');

    return {
      id: `occ-${Date.now()}`,
      protocol,
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category,
      status: 'ABERTA',
      origin: 'CITIZEN',
      location: {
        address: input.address.trim(),
        reference: input.reference.trim() || 'Referência informada no local',
        coordinates: input.coordinates || '-23.5630, -46.6540',
      },
      photoUri: input.photoUri?.trim() || categoryMeta.defaultPhotoUri,
      createdAt: now,
      updatedAt: now,
      reporterId: input.user.id,
      reporterName: input.user.name,
      history: [
        {
          id: `hist-${Date.now()}`,
          status: 'ABERTA',
          timestamp: now,
          actorName: input.user.name,
          actorRole: 'CITIZEN',
          note: 'Ocorrência aberta pelo cidadão via aplicativo mobile.',
        },
      ],
    };
  },

  createIoTAutoOccurrence(pole: SmartPoleState): Occurrence {
    const now = new Date().toISOString();
    const protocol = this.generateProtocol('IOT');

    return {
      id: `occ-iot-${Date.now()}`,
      protocol,
      title: `Falha Crítica de Iluminação — ${pole.name}`,
      description: `Abertura automática via telemetria IoT: Sensor fotocélula detectou escuridão no logradouro (${pole.ambientLux} lx < limite de ${pole.darkThresholdLux} lx), porém a luminária LED encontra-se apagada (consumo medido: ${pole.powerDrawWatts}W). Requer substituição de driver/módulo LED.`,
      category: 'ILUMINACAO',
      status: 'ABERTA',
      origin: 'IOT_AUTO',
      location: {
        address: pole.address,
        reference: `Poste Inteligente ID #${pole.poleId} (Telemetria Autônoma)`,
        coordinates: pole.coordinates,
      },
      photoUri: CATEGORIES.ILUMINACAO.defaultPhotoUri,
      createdAt: now,
      updatedAt: now,
      reporterId: `iot-node-${pole.poleId}`,
      reporterName: `Sensor IoT • Poste #${pole.poleId}`,
      iotMetadata: {
        poleId: pole.poleId,
        ambientLux: pole.ambientLux,
        voltageV: pole.voltageV,
        powerDrawWatts: pole.powerDrawWatts,
        sensorDiagnosticCode: 'ERR_DARK_LAMP_OFF_0x4F',
      },
      history: [
        {
          id: `hist-iot-${Date.now()}`,
          status: 'ABERTA',
          timestamp: now,
          actorName: `Módulo IoT #${pole.poleId}`,
          actorRole: 'IOT_SENSOR',
          note: `Disparo autônomo: Luminosidade ambiente em ${pole.ambientLux} lx (Noite/Escuro) com luminária inoperante (0.0W na saída LED).`,
        },
      ],
    };
  },

  updateStatus(
    occurrence: Occurrence,
    nextStatus: OccurrenceStatus,
    agent: UserProfile,
    customNote?: string
  ): Occurrence {
    const now = new Date().toISOString();
    const defaultNotes: Record<OccurrenceStatus, string> = {
      ABERTA: 'Chamado reaberto para nova verificação na fila técnica.',
      EM_ANALISE:
        'Chamado recebido pela engenharia. Analisando severidade e recursos necessários.',
      EM_ANDAMENTO:
        'Ordem de serviço emitida. Equipe operacional de campo em deslocamento/execução.',
      RESOLVIDA:
        'Manutenção finalizada com sucesso e validada em inspeção local.',
    };

    const note = customNote?.trim() || defaultNotes[nextStatus];

    return {
      ...occurrence,
      status: nextStatus,
      updatedAt: now,
      assignedAgentName: agent.name,
      history: [
        ...occurrence.history,
        {
          id: `hist-${Date.now()}`,
          status: nextStatus,
          timestamp: now,
          actorName: agent.name,
          actorRole: 'AGENT',
          note,
        },
      ],
    };
  },
};
