import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios.js';
import { demoUser, isDemoMode } from '../utils/demo.js';

const AuthContext = createContext(null);
const TOKEN_KEY = 'chatlite_token';
const USER_KEY = 'chatlite_user';

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(getStoredUser);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    setInitializing(false);
  }, []);

  const saveSession = useCallback((newToken, newUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(
    async (credentials) => {
      if (isDemoMode()) {
        const userName = credentials.email?.split('@')[0] || demoUser.name;
        const user = { ...demoUser, name: userName };
        saveSession('demo-token', user);
        return { token: 'demo-token', user };
      }

      const { data } = await api.post('/auth/login', credentials);
      saveSession(data.token, data.user);
      return data;
    },
    [saveSession]
  );

  const register = useCallback(
    async (formData) => {
      if (isDemoMode()) {
        const user = { ...demoUser, name: formData.name || demoUser.name, email: formData.email || demoUser.email };
        saveSession('demo-token', user);
        return { token: 'demo-token', user };
      }

      const { data } = await api.post('/auth/register', formData);
      saveSession(data.token, data.user);
      return data;
    },
    [saveSession]
  );

  const value = useMemo(
    () => ({
      token,
      user,
      initializing,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout
    }),
    [token, user, initializing, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
};
