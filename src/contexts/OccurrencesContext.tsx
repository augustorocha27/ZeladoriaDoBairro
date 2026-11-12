import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { MOCK_USERS } from '../data/mockData';
import {
  CreateCitizenOccurrenceInput,
  occurrenceService,
} from '../services/occurrenceService';
import { storageService } from '../storage/storageService';
import { Occurrence, OccurrenceStatus, SmartPoleState } from '../types';

interface OccurrencesContextData {
  occurrences: Occurrence[];
  isLoadingOccurrences: boolean;
  addCitizenOccurrence: (
    input: Omit<CreateCitizenOccurrenceInput, 'user'>
  ) => Promise<Occurrence>;
  triggerIoTOccurrenceIfNeeded: (
    pole: SmartPoleState
  ) => Promise<Occurrence | null>;
  updateOccurrenceStatus: (
    occurrenceId: string,
    nextStatus: OccurrenceStatus,
    note?: string
  ) => Promise<void>;
  resetOccurrencesData: () => Promise<void>;
}

const OccurrencesContext = createContext<OccurrencesContextData>(
  {} as OccurrencesContextData
);

export const OccurrencesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [isLoadingOccurrences, setIsLoadingOccurrences] = useState(true);

  useEffect(() => {
    (async () => {
      const loaded = await storageService.getOccurrences();
      setOccurrences(loaded);
      setIsLoadingOccurrences(false);
    })();
  }, []);

  const addCitizenOccurrence = useCallback(
    async (
      input: Omit<CreateCitizenOccurrenceInput, 'user'>
    ): Promise<Occurrence> => {
      const newOccurrence = occurrenceService.createCitizenOccurrence({
        ...input,
        user: MOCK_USERS.CITIZEN,
      });

      const updatedList = [newOccurrence, ...occurrences];
      setOccurrences(updatedList);
      await storageService.saveOccurrences(updatedList);
      return newOccurrence;
    },
    [occurrences]
  );

  const triggerIoTOccurrenceIfNeeded = useCallback(
    async (pole: SmartPoleState): Promise<Occurrence | null> => {
      const existingActive = occurrences.find(
        (occ) =>
          occ.origin === 'IOT_AUTO' &&
          occ.iotMetadata?.poleId === pole.poleId &&
          occ.status !== 'RESOLVIDA'
      );

      if (existingActive) {
        return null;
      }

      const autoOccurrence = occurrenceService.createIoTAutoOccurrence(pole);
      const updatedList = [autoOccurrence, ...occurrences];
      setOccurrences(updatedList);
      await storageService.saveOccurrences(updatedList);
      return autoOccurrence;
    },
    [occurrences]
  );

  const updateOccurrenceStatus = useCallback(
    async (
      occurrenceId: string,
      nextStatus: OccurrenceStatus,
      note?: string
    ) => {
      const updatedList = occurrences.map((occ) => {
        if (occ.id !== occurrenceId) return occ;
        return occurrenceService.updateStatus(
          occ,
          nextStatus,
          MOCK_USERS.AGENT,
          note
        );
      });

      setOccurrences(updatedList);
      await storageService.saveOccurrences(updatedList);
    },
    [occurrences]
  );

  const resetOccurrencesData = useCallback(async () => {
    const { occurrences: fresh } = await storageService.resetAllDemoData();
    setOccurrences(fresh);
  }, []);

  return (
    <OccurrencesContext.Provider
      value={{
        occurrences,
        isLoadingOccurrences,
        addCitizenOccurrence,
        triggerIoTOccurrenceIfNeeded,
        updateOccurrenceStatus,
        resetOccurrencesData,
      }}
    >
      {children}
    </OccurrencesContext.Provider>
  );
};

export const useOccurrences = () => useContext(OccurrencesContext);
