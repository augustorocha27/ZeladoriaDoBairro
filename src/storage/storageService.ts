import { Platform } from 'react-native';
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

/**
 * Compresses large data:image base64 URIs on Web so localStorage (5MB limit)
 * never throws QuotaExceededError when a user picks a photo from their computer/phone.
 */
async function normalizePhotoUriForStorage(
  uri: string | undefined,
  fallbackUri: string
): Promise<string> {
  if (!uri || !uri.trim()) return fallbackUri;
  if (
    Platform.OS === 'web' &&
    uri.startsWith('data:image/') &&
    uri.length > 120_000 &&
    typeof document !== 'undefined'
  ) {
    try {
      return await new Promise<string>((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          const maxWidth = 720;
          const scale = img.width > maxWidth ? maxWidth / img.width : 1;
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(fallbackUri);
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.72));
        };
        img.onerror = () => resolve(fallbackUri);
        img.src = uri;
      });
    } catch {
      return fallbackUri;
    }
  }
  return uri;
}

export const storageService = {
  normalizePhotoUriForStorage,

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
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        await AsyncStorage.setItem(
          STORAGE_KEYS.OCCURRENCES,
          JSON.stringify(INITIAL_OCCURRENCES)
        );
        return INITIAL_OCCURRENCES;
      }
      return parsed as Occurrence[];
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
      console.warn(
        '[storageService] Quota error saving occurrences, trimming heavy inline photos:',
        error
      );
      try {
        const safeList = occurrences.map((occ) => ({
          ...occ,
          photoUri:
            occ.photoUri && occ.photoUri.length > 150_000
              ? 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=900&q=80'
              : occ.photoUri,
        }));
        await AsyncStorage.setItem(
          STORAGE_KEYS.OCCURRENCES,
          JSON.stringify(safeList)
        );
      } catch (innerErr) {
        console.error('[storageService] Fatal save error:', innerErr);
      }
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
