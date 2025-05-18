import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { mockLogin, mockRegister } from '@/utils/mockApi';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check for saved user on component mount
  useEffect(() => {
    const checkSavedUser = async () => {
      try {
        // In a real app, you would get the user from AsyncStorage
        // For this mock, we'll just leave it as not authenticated
        setIsAuthenticated(false);
        setUser(null);
      } catch (error) {
        console.error('Failed to get saved user:', error);
      }
    };
    
    checkSavedUser();
  }, []);
  
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mock API call
      const userData = await mockLogin(email, password);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mock API call
      const userData = await mockRegister(name, email, password);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const logout = useCallback(() => {
    // In a real app, you would clear tokens from AsyncStorage
    setUser(null);
    setIsAuthenticated(false);
  }, []);
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}