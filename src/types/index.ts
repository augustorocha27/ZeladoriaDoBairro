export type UserRole = 'CITIZEN' | 'AGENT';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  neighborhood: string;
  badgeCode: string;
  avatarInitials: string;
}

export type OccurrenceStatus =
  | 'ABERTA'
  | 'EM_ANALISE'
  | 'EM_ANDAMENTO'
  | 'RESOLVIDA';

export type OccurrenceCategory =
  | 'ILUMINACAO'
  | 'BURACO_VIA'
  | 'ACUMULO_LIXO'
  | 'ARVORE_PODA'
  | 'DRENAGEM';

export type OccurrenceOrigin = 'CITIZEN' | 'IOT_AUTO';

export interface StatusHistoryEntry {
  id: string;
  status: OccurrenceStatus;
  timestamp: string;
  actorName: string;
  actorRole: UserRole | 'IOT_SENSOR';
  note: string;
}

export interface IoTMetadata {
  poleId: string;
  ambientLux: number;
  voltageV: number;
  powerDrawWatts: number;
  sensorDiagnosticCode: string;
}

export interface Occurrence {
  id: string;
  protocol: string;
  title: string;
  description: string;
  category: OccurrenceCategory;
  status: OccurrenceStatus;
  origin: OccurrenceOrigin;
  location: {
    address: string;
    reference: string;
    coordinates: string;
  };
  photoUri: string;
  createdAt: string;
  updatedAt: string;
  reporterId: string;
  reporterName: string;
  assignedAgentName?: string;
  iotMetadata?: IoTMetadata;
  history: StatusHistoryEntry[];
}

export interface SmartPoleState {
  poleId: string;
  name: string;
  address: string;
  coordinates: string;
  /** Ambient light level in Lux (0 = pitch dark night, < 25 = dark threshold, 500+ = daylight) */
  ambientLux: number;
  /** Threshold below which the pole should automatically turn ON */
  darkThresholdLux: number;
  /** Simulated hardware condition: true = LED bulb working, false = LED bulb burned out / relay fault */
  isLampHardwareOk: boolean;
  /** Derived state: is the pole currently emitting light? */
  isLightEmitting: boolean;
  /** Simulated electrical telemetry */
  voltageV: number;
  powerDrawWatts: number;
  lastHeartbeat: string;
  lastAutoOccurrenceProtocol: string | null;
}

export interface TelemetryLogItem {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'CRITICAL' | 'SUCCESS';
  message: string;
}
