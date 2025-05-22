import { createContext, useContext, useState } from 'react';
import { login as loginApi, register as registerApi } from '@/utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    setUser(data.user);
    setToken(data.access_token);
  };

  const register = async (name, email, password) => {
    const data = await registerApi(name, email, password);
    setUser(data.user);
    setToken(data.access_token);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);