import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '@/utils/storage'; // Replace AsyncStorage import
import { login as loginApi, register as registerApi } from '@/utils/api';

type User = {
  id: string;
  email: string;
  role: string;
  ageCategory?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean; // Add this
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, ageCategory?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const restoreSession = async () => {
    try {
      const savedToken = await storage.getItem('auth_token');
      const savedUser = await storage.getItem('auth_user');
      console.log('Restoring session:', { hasToken: !!savedToken, hasUser: !!savedUser });
      
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error restoring session:', error);
    }
  };

  const logout = async () => {
    console.log('LOGOUT CALLED');
    setUser(null);
    setToken(null);
    await storage.removeItem('auth_token');
    await storage.removeItem('auth_user');
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await loginApi(email, password);
      setUser(data.user);
      setToken(data.access_token);
      await storage.setItem('auth_token', data.access_token);
      await storage.setItem('auth_user', JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, ageCategory?: string) => {
    setIsLoading(true);
    try {
      const data = await registerApi(name, email, password, ageCategory);
      setUser(data.user);
      setToken(data.access_token);
      await storage.setItem('auth_token', data.access_token);
      await storage.setItem('auth_user', JSON.stringify(data.user));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};