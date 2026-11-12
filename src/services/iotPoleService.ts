import { Occurrence, SmartPoleState } from '../types';

export interface IoTEvaluationResult {
  updatedPole: SmartPoleState;
  isDark: boolean;
  isAnomalyDetected: boolean;
  existingActiveIoTOccurrence: Occurrence | null;
  shouldTriggerAutoOccurrence: boolean;
  telemetryMessage: string;
  telemetryLevel: 'INFO' | 'WARN' | 'CRITICAL' | 'SUCCESS';
}

/**
 * Deterministic IoT Evaluation Engine for the Smart Streetlight
 * Rule:
 * - Dark condition: ambientLux < darkThresholdLux (default 25 lx)
 * - Normal Night operation: isDark === true && isLampHardwareOk === true -> Light ON (120W)
 * - Normal Day operation: isDark === false -> Light OFF (standby 2.1W)
 * - ANOMALY (Triggers Automatic Occurrence): isDark === true && isLampHardwareOk === false -> Light OFF in the dark!
 */
export const iotPoleService = {
  evaluatePoleTelemetry(
    currentPole: SmartPoleState,
    nextAmbientLux: number,
    nextIsLampHardwareOk: boolean,
    allOccurrences: Occurrence[]
  ): IoTEvaluationResult {
    const clampedLux = Math.max(0, Math.min(1000, Math.round(nextAmbientLux)));
    const isDark = clampedLux < currentPole.darkThresholdLux;

    // A lamp only emits light if it is dark (photocell relay closed) AND the LED hardware is operational
    const isLightEmitting = isDark && nextIsLampHardwareOk;

    // Electrical telemetry calculation
    const voltageV = nextIsLampHardwareOk ? 220.4 : 218.9;
    const powerDrawWatts = isLightEmitting
      ? 124.5 // Full LED luminaire power draw when lit at night
      : nextIsLampHardwareOk
      ? 2.1 // Photocell + ESP32 telemetry standby during day
      : 0.4; // Fault state: relay triggered but open circuit / burned LED driver

    // Check if it is dark AND the pole is off (anomaly)
    const isAnomalyDetected = isDark && !isLightEmitting;

    // Check if there is already an unresolved automatic occurrence for this pole
    const existingActiveIoTOccurrence =
      allOccurrences.find(
        (occ) =>
          occ.origin === 'IOT_AUTO' &&
          occ.iotMetadata?.poleId === currentPole.poleId &&
          occ.status !== 'RESOLVIDA'
      ) || null;

    const shouldTriggerAutoOccurrence =
      isAnomalyDetected && !existingActiveIoTOccurrence;

    const updatedPole: SmartPoleState = {
      ...currentPole,
      ambientLux: clampedLux,
      isLampHardwareOk: nextIsLampHardwareOk,
      isLightEmitting,
      voltageV,
      powerDrawWatts,
      lastHeartbeat: new Date().toISOString(),
    };

    let telemetryMessage = '';
    let telemetryLevel: 'INFO' | 'WARN' | 'CRITICAL' | 'SUCCESS' = 'INFO';

    if (!isDark && nextIsLampHardwareOk) {
      telemetryMessage = `[NODE #${currentPole.poleId}] Fotocélula: ${clampedLux} lx (Dia). Luminária em standby econômico (${powerDrawWatts}W).`;
      telemetryLevel = 'INFO';
    } else if (!isDark && !nextIsLampHardwareOk) {
      telemetryMessage = `[NODE #${currentPole.poleId}] Diagnóstico diurno (${clampedLux} lx): Driver LED sem resposta de continuidade. Aguardando ciclo noturno.`;
      telemetryLevel = 'WARN';
    } else if (isDark && isLightEmitting) {
      telemetryMessage = `[NODE #${currentPole.poleId}] Noite detectada (${clampedLux} lx). Luminária LED ACESA nominalmente (${powerDrawWatts}W @ ${voltageV}V).`;
      telemetryLevel = 'SUCCESS';
    } else if (shouldTriggerAutoOccurrence) {
      telemetryMessage = `[ALERTA CRÍTICO #${currentPole.poleId}] Escuridão detectada (${clampedLux} lx) e POSTE APAGADO (0.4W)! Abrindo ocorrência automática de manutenção...`;
      telemetryLevel = 'CRITICAL';
    } else {
      telemetryMessage = `[NODE #${currentPole.poleId}] Anomalia ativa (${clampedLux} lx / Poste Apagado). Ocorrência automática #${existingActiveIoTOccurrence?.protocol} já está na fila do Agente.`;
      telemetryLevel = 'WARN';
    }

    return {
      updatedPole,
      isDark,
      isAnomalyDetected,
      existingActiveIoTOccurrence,
      shouldTriggerAutoOccurrence,
      telemetryMessage,
      telemetryLevel,
    };
  },
};
