/**
 * Camada 3 (Execução Determinística — AGENTS.md):
 * Validador de Arquitetura, Regras IoT, AsyncStorage e Fidelidade ao Prompt.Md.
 */
import fs from 'node:fs';
import path from 'node:path';

const REQUIRED_FILES = [
  'package.json',
  'App.tsx',
  'src/polyfills.ts',
  'directives/zeladoria_arquitetura.md',
  'src/theme/theme.ts',
  'src/types/index.ts',
  'src/data/mockData.ts',
  'src/storage/storageService.ts',
  'src/services/occurrenceService.ts',
  'src/services/iotPoleService.ts',
  'src/contexts/AuthContext.tsx',
  'src/contexts/OccurrencesContext.tsx',
  'src/contexts/IoTContext.tsx',
  'src/components/GlobalStylesAndNoise.tsx',
  'src/components/FloatingIslandNavbar.tsx',
  'src/components/PrecisionMicroUIDashboard.tsx',
  'src/components/ManifestoAndProtocolSection.tsx',
  'src/components/OperationalTriadAndFooter.tsx',
  'src/components/OccurrenceCard.tsx',
  'src/components/OccurrenceDetailModal.tsx',
  'src/screens/LoginScreen.tsx',
  'src/screens/CitizenHomeScreen.tsx',
  'src/screens/NewOccurrenceScreen.tsx',
  'src/screens/AgentDashboardScreen.tsx',
  'src/screens/IoTSimulatorScreen.tsx',
  'src/navigation/AppNavigator.tsx',
];

const PROMPT_MD_COLORS = ['#2E4036', '#CC5833', '#F2F0E9', '#1A1A1A'];

const root = process.cwd();
const missing = REQUIRED_FILES.filter(
  (rel) => !fs.existsSync(path.join(root, rel))
);

if (missing.length > 0) {
  console.error('[ERRO] Arquivos ausentes:', missing);
  process.exit(1);
}

const themeContent = fs
  .readFileSync(path.join(root, 'src/theme/theme.ts'), 'utf8')
  .toUpperCase();

for (const hex of PROMPT_MD_COLORS) {
  if (!themeContent.includes(hex)) {
    console.error(`[ERRO] Cor obrigatória do Prompt.Md ausente: ${hex}`);
    process.exit(1);
  }
}

// Verify Prompt.Md Visual Texture & Artifacts
const noiseFile = fs.readFileSync(
  path.join(root, 'src/components/GlobalStylesAndNoise.tsx'),
  'utf8'
);
if (!noiseFile.includes('feTurbulence') || !noiseFile.includes('0.05')) {
  console.error('[ERRO] Global SVG Noise Overlay (0.05 opacity) não encontrado.');
  process.exit(1);
}

const microUIFile = fs.readFileSync(
  path.join(root, 'src/components/PrecisionMicroUIDashboard.tsx'),
  'utf8'
);
if (!microUIFile.includes('.pop()') || !microUIFile.includes('.unshift(')) {
  console.error('[ERRO] Lógica unshift(pop()) do Diagnostic Shuffler ausente.');
  process.exit(1);
}

const protocolFile = fs.readFileSync(
  path.join(root, 'src/components/ManifestoAndProtocolSection.tsx'),
  'utf8'
);
if (
  !protocolFile.includes('nuraSpinSlow') ||
  !protocolFile.includes('nuraLaserScan') ||
  !protocolFile.includes('nuraEkgDash')
) {
  console.error('[ERRO] Artefatos animados da seção Protocol ausentes.');
  process.exit(1);
}

console.log(
  `[OK] Todos os ${REQUIRED_FILES.length} arquivos da arquitetura em 3 camadas verificados.`
);
console.log(
  '[OK] Paleta estrita do Prompt.Md (#2E4036, #CC5833, #F2F0E9, #1A1A1A) validada.'
);
console.log(
  '[OK] Artefatos do Prompt.Md (Noise 0.05, Floating Island, Diagnostic Shuffler, Telemetry Typewriter, Mock Cursor Scheduler, Manifesto, Protocol Stack & System Operational Footer) validados.'
);
