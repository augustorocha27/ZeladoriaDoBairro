import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  INITIAL_OCCURRENCES,
  INITIAL_SMART_POLE,
  MOCK_USERS,
} from '../data/mockData';
import { Occurrence, SmartPoleState, UserProfile, UserRole } from '../types';

const STORAGE_KEYS = {
  OCCURRENCES: '@zeladoria_v1:occurrences',
  ACTIVE_USER_ROLE: '@zeladoria_v1:active_user_role',
  SMART_POLE_STATE: '@zeladoria_v1:smart_pole_state',
};

export const storageService = {
  async getOccurrences(): Promise<Occurrence[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.OCCURRENCES);
      if (!raw) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.OCCURRENCES,
          JSON.stringify(INITIAL_OCCURRENCES)
        );
        return INITIAL_OCCURRENCES;
      }
      return JSON.parse(raw) as Occurrence[];
    } catch (error) {
      console.warn('[storageService] Fallback to INITIAL_OCCURRENCES:', error);
      return INITIAL_OCCURRENCES;
    }
  },

  async saveOccurrences(occurrences: Occurrence[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.OCCURRENCES,
        JSON.stringify(occurrences)
      );
    } catch (error) {
      console.error('[storageService] Error saving occurrences:', error);
    }
  },

  async getActiveUser(): Promise<UserProfile | null> {
    try {
      const role = (await AsyncStorage.getItem(
        STORAGE_KEYS.ACTIVE_USER_ROLE
      )) as UserRole | null;
      if (!role || !MOCK_USERS[role]) {
        return null;
      }
      return MOCK_USERS[role];
    } catch {
      return null;
    }
  },

  async saveActiveUserRole(role: UserRole | null): Promise<void> {
    try {
      if (!role) {
        await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ROLE);
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ROLE, role);
      }
    } catch (error) {
      console.error('[storageService] Error saving active role:', error);
    }
  },

  async getSmartPoleState(): Promise<SmartPoleState> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.SMART_POLE_STATE);
      if (!raw) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.SMART_POLE_STATE,
          JSON.stringify(INITIAL_SMART_POLE)
        );
        return INITIAL_SMART_POLE;
      }
      return JSON.parse(raw) as SmartPoleState;
    } catch {
      return INITIAL_SMART_POLE;
    }
  },

  async saveSmartPoleState(state: SmartPoleState): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SMART_POLE_STATE,
        JSON.stringify(state)
      );
    } catch (error) {
      console.error('[storageService] Error saving smart pole state:', error);
    }
  },

  async resetAllDemoData(): Promise<{
    occurrences: Occurrence[];
    poleState: SmartPoleState;
  }> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.OCCURRENCES,
      JSON.stringify(INITIAL_OCCURRENCES)
    );
    await AsyncStorage.setItem(
      STORAGE_KEYS.SMART_POLE_STATE,
      JSON.stringify(INITIAL_SMART_POLE)
    );
    return {
      occurrences: INITIAL_OCCURRENCES,
      poleState: INITIAL_SMART_POLE,
    };
  },
};
