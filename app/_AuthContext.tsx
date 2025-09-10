import React, { createContext, ReactNode, useContext, useState } from 'react';

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fakeDelay = (ms = 500) => new Promise((r) => setTimeout(r, ms));

  const register = async (email: string, _password: string) => {
    setLoading(true);
    await fakeDelay();
    const newUser = { id: String(Date.now()), email };
    setUser(newUser);
    setLoading(false);
    return newUser;
  };

  const login = async (email: string, _password: string) => {
    setLoading(true);
    await fakeDelay();
    const existingUser = { id: '1', email };
    setUser(existingUser);
    setLoading(false);
    return existingUser;
  };

  const logout = async () => {
    setLoading(true);
    await fakeDelay(200);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
