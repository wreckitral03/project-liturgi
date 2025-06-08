import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginApi, register as registerApi } from '@/utils/api';

type User = {
  id: string;
  email: string;
  role: string;
  ageCategory?: string; // Add this
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, ageCategory?: string) => Promise<void>; // Update this
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const restoreSession = async () => {
    const savedToken = await AsyncStorage.getItem('auth_token');
    const savedUser = await AsyncStorage.getItem('auth_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  };

  const logout = async () => {
  console.log('LOGOUT CALLED');
  setUser(null);
  setToken(null);
  await AsyncStorage.removeItem('auth_token');
  await AsyncStorage.removeItem('auth_user');
};

  const login = async (email: string, password: string) => {
    const data = await loginApi(email, password);
    setUser(data.user); // This will now include ageCategory from backend
    setToken(data.access_token);
    await AsyncStorage.setItem('auth_token', data.access_token);
    await AsyncStorage.setItem('auth_user', JSON.stringify(data.user));
  };

  const register = async (name: string, email: string, password: string, ageCategory?: string) => {
    const data = await registerApi(name, email, password, ageCategory);
    setUser(data.user); // This will include ageCategory
    setToken(data.access_token);
    await AsyncStorage.setItem('auth_token', data.access_token);
    await AsyncStorage.setItem('auth_user', JSON.stringify(data.user));
  };

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!user }}>
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