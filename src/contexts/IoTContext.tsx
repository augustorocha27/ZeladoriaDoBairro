import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { INITIAL_SMART_POLE } from '../data/mockData';
import { iotPoleService } from '../services/iotPoleService';
import { storageService } from '../storage/storageService';
import { Occurrence, SmartPoleState, TelemetryLogItem } from '../types';
import { useOccurrences } from './OccurrencesContext';

interface IoTContextData {
  pole: SmartPoleState;
  isDark: boolean;
  isAnomalyActive: boolean;
  activeIoTOccurrence: Occurrence | null;
  telemetryLogs: TelemetryLogItem[];
  lastTriggeredAlert: Occurrence | null;
  dismissAlertBanner: () => void;
  setAmbientLux: (lux: number) => Promise<void>;
  setLampHardwareStatus: (isOk: boolean) => Promise<void>;
  /** 1-click scenario for the evaluator: sets night darkness (8 lx) + burns lamp (false) -> triggers auto occurrence! */
  triggerNightFailureSimulation: () => Promise<Occurrence | null>;
  /** Restores normal operation (daylight or working lamp) */
  restoreNormalPoleOperation: () => Promise<void>;
}

const IoTContext = createContext<IoTContextData>({} as IoTContextData);

export const IoTProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { occurrences, triggerIoTOccurrenceIfNeeded } = useOccurrences();
  const [pole, setPole] = useState<SmartPoleState>(INITIAL_SMART_POLE);
  const [lastTriggeredAlert, setLastTriggeredAlert] =
    useState<Occurrence | null>(null);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLogItem[]>([
    {
      id: 'log-init-1',
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      level: 'INFO',
      message:
        '[BOOT] Nó IoT #PZ-042 sincronizado. Fotocélula e medidor de corrente ativos.',
    },
  ]);

  const appendLog = useCallback(
    (
      level: TelemetryLogItem['level'],
      message: string
    ) => {
      setTelemetryLogs((prev) => [
        {
          id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          timestamp: new Date().toLocaleTimeString('pt-BR'),
          level,
          message,
        },
        ...prev.slice(0, 14),
      ]);
    },
    []
  );

  useEffect(() => {
    (async () => {
      const savedPole = await storageService.getSmartPoleState();
      setPole(savedPole);
    })();
  }, []);

  const applyTelemetryChange = useCallback(
    async (
      nextLux: number,
      nextHardwareOk: boolean
    ): Promise<Occurrence | null> => {
      const evalResult = iotPoleService.evaluatePoleTelemetry(
        pole,
        nextLux,
        nextHardwareOk,
        occurrences
      );

      let createdOccurrence: Occurrence | null = null;
      let finalPoleState = evalResult.updatedPole;

      appendLog(evalResult.telemetryLevel, evalResult.telemetryMessage);

      if (evalResult.shouldTriggerAutoOccurrence) {
        createdOccurrence = await triggerIoTOccurrenceIfNeeded(
          evalResult.updatedPole
        );
        if (createdOccurrence) {
          finalPoleState = {
            ...finalPoleState,
            lastAutoOccurrenceProtocol: createdOccurrence.protocol,
          };
          setLastTriggeredAlert(createdOccurrence);
          appendLog(
            'CRITICAL',
            `[AUTO-DISPATCH] Chamado #${createdOccurrence.protocol} gravado no AsyncStorage e enviado à fila do Agente!`
          );
        }
      }

      setPole(finalPoleState);
      await storageService.saveSmartPoleState(finalPoleState);
      return createdOccurrence;
    },
    [pole, occurrences, appendLog, triggerIoTOccurrenceIfNeeded]
  );

  const setAmbientLux = useCallback(
    async (lux: number) => {
      await applyTelemetryChange(lux, pole.isLampHardwareOk);
    },
    [pole.isLampHardwareOk, applyTelemetryChange]
  );

  const setLampHardwareStatus = useCallback(
    async (isOk: boolean) => {
      await applyTelemetryChange(pole.ambientLux, isOk);
    },
    [pole.ambientLux, applyTelemetryChange]
  );

  const triggerNightFailureSimulation =
    useCallback(async (): Promise<Occurrence | null> => {
      appendLog(
        'WARN',
        '[SIMULADOR] Iniciando cenário: Queda abrupta de luminosidade (Noite: 6 lx) + Falha no Driver LED...'
      );
      return await applyTelemetryChange(6, false);
    }, [appendLog, applyTelemetryChange]);

  const restoreNormalPoleOperation = useCallback(async () => {
    appendLog(
      'SUCCESS',
      '[MANUTENÇÃO] Circuito LED restabelecido e fotocélula recalibrada.'
    );
    await applyTelemetryChange(12, true); // Night with working lamp ON
  }, [appendLog, applyTelemetryChange]);

  const dismissAlertBanner = useCallback(() => {
    setLastTriggeredAlert(null);
  }, []);

  const isDark = pole.ambientLux < pole.darkThresholdLux;
  const isAnomalyActive = isDark && !pole.isLightEmitting;

  const activeIoTOccurrence =
    occurrences.find(
      (occ) =>
        occ.origin === 'IOT_AUTO' &&
        occ.iotMetadata?.poleId === pole.poleId &&
        occ.status !== 'RESOLVIDA'
    ) || null;

  return (
    <IoTContext.Provider
      value={{
        pole,
        isDark,
        isAnomalyActive,
        activeIoTOccurrence,
        telemetryLogs,
        lastTriggeredAlert,
        dismissAlertBanner,
        setAmbientLux,
        setLampHardwareStatus,
        triggerNightFailureSimulation,
        restoreNormalPoleOperation,
      }}
    >
      {children}
    </IoTContext.Provider>
  );
};

export const useIoT = () => useContext(IoTContext);
