import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { MOCK_USERS } from '../data/mockData';
import { storageService } from '../storage/storageService';
import { UserProfile, UserRole } from '../types';

interface AuthContextData {
  user: UserProfile | null;
  isLoadingAuth: boolean;
  loginAs: (role: UserRole) => Promise<void>;
  switchRole: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    (async () => {
      const savedUser = await storageService.getActiveUser();
      if (savedUser) {
        setUser(savedUser);
      }
      setIsLoadingAuth(false);
    })();
  }, []);

  const loginAs = useCallback(async (role: UserRole) => {
    const profile = MOCK_USERS[role];
    setUser(profile);
    await storageService.saveActiveUserRole(role);
  }, []);

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
