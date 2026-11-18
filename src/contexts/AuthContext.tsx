import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { MOCK_USERS } from '../data/mockData';
import { storageService } from '../storage/storageService';
import { UserProfile, UserRole } from '../types';

interface AuthContextData {
  user: UserProfile | null;
  isLoadingAuth: boolean;
  loginAs: (
    role: UserRole,
    customName?: string,
    customBadge?: string
  ) => Promise<void>;
  switchRole: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Always start unauthenticated (null) so the app opens directly on the Login Screen
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingAuth] = useState(false);

  const loginAs = useCallback(
    async (role: UserRole, customName?: string, customBadge?: string) => {
      const baseProfile = MOCK_USERS[role];
      const trimmedName = customName?.trim();
      const initials = trimmedName
        ? trimmedName
            .split(' ')
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() || '')
            .join('')
        : baseProfile.avatarInitials;

      const profile: UserProfile = {
        ...baseProfile,
        name: trimmedName || baseProfile.name,
        badgeCode: customBadge?.trim() || baseProfile.badgeCode,
        avatarInitials: initials || baseProfile.avatarInitials,
      };

      setUser(profile);
      await storageService.saveActiveUserRole(role);
    },
    []
  );

  const switchRole = useCallback(async () => {
    const nextRole: UserRole = user?.role === 'AGENT' ? 'CITIZEN' : 'AGENT';
    await loginAs(nextRole);
  }, [user, loginAs]);

  const logout = useCallback(async () => {
    setUser(null);
    await storageService.saveActiveUserRole(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingAuth,
        loginAs,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
