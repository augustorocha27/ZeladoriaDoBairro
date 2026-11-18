import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CATEGORIES, INITIAL_OCCURRENCES, MOCK_USERS } from '../data/mockData';
import {
  CreateCitizenOccurrenceInput,
  occurrenceService,
} from '../services/occurrenceService';
import { storageService } from '../storage/storageService';
import { Occurrence, OccurrenceStatus, SmartPoleState } from '../types';
import { useAuth } from './AuthContext';

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
  const { user } = useAuth();
  const [occurrences, setOccurrences] =
    useState<Occurrence[]>(INITIAL_OCCURRENCES);
  const occurrencesRef = useRef<Occurrence[]>(INITIAL_OCCURRENCES);
  const [isLoadingOccurrences, setIsLoadingOccurrences] = useState(true);

  useEffect(() => {
    (async () => {
      const loaded = await storageService.getOccurrences();
      occurrencesRef.current = loaded;
      setOccurrences(loaded);
      setIsLoadingOccurrences(false);
    })();
  }, []);

  const addCitizenOccurrence = useCallback(
    async (
      input: Omit<CreateCitizenOccurrenceInput, 'user'>
    ): Promise<Occurrence> => {
      const categoryMeta = CATEGORIES[input.category];
      const safePhotoUri = await storageService.normalizePhotoUriForStorage(
        input.photoUri,
        categoryMeta.defaultPhotoUri
      );

      const activeCitizen =
        user && user.role === 'CITIZEN' ? user : MOCK_USERS.CITIZEN;

      const newOccurrence = occurrenceService.createCitizenOccurrence({
        ...input,
        title:
          input.title?.trim() ||
          `${categoryMeta.shortLabel} — Relato de Morador`,
        description:
          input.description?.trim() ||
          `Solicitação de manutenção urbana (${categoryMeta.label}) registrada pelo morador.`,
        address:
          input.address?.trim() || 'Rua das Figueiras, 240 — Jardim Botânico',
        reference:
          input.reference?.trim() || 'Referência informada pelo morador',
        photoUri: safePhotoUri,
        user: activeCitizen,
      });

      const updatedList = [newOccurrence, ...occurrencesRef.current];
      occurrencesRef.current = updatedList;
      setOccurrences(updatedList);
      await storageService.saveOccurrences(updatedList);
      return newOccurrence;
    },
    [user]
  );

  const triggerIoTOccurrenceIfNeeded = useCallback(
    async (pole: SmartPoleState): Promise<Occurrence | null> => {
      const existingActive = occurrencesRef.current.find(
        (occ) =>
          occ.origin === 'IOT_AUTO' &&
          occ.iotMetadata?.poleId === pole.poleId &&
          occ.status !== 'RESOLVIDA'
      );

      if (existingActive) {
        return null;
      }

      const autoOccurrence = occurrenceService.createIoTAutoOccurrence(pole);
      const updatedList = [autoOccurrence, ...occurrencesRef.current];
      occurrencesRef.current = updatedList;
      setOccurrences(updatedList);
      await storageService.saveOccurrences(updatedList);
      return autoOccurrence;
    },
    []
  );

  const updateOccurrenceStatus = useCallback(
    async (
      occurrenceId: string,
      nextStatus: OccurrenceStatus,
      note?: string
    ) => {
      const activeAgent =
        user && user.role === 'AGENT' ? user : MOCK_USERS.AGENT;

      const updatedList = occurrencesRef.current.map((occ) => {
        if (occ.id !== occurrenceId) return occ;
        return occurrenceService.updateStatus(
          occ,
          nextStatus,
          activeAgent,
          note
        );
      });

      occurrencesRef.current = updatedList;
      setOccurrences(updatedList);
      await storageService.saveOccurrences(updatedList);
    },
    [user]
  );

  const resetOccurrencesData = useCallback(async () => {
    const { occurrences: fresh } = await storageService.resetAllDemoData();
    occurrencesRef.current = fresh;
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
