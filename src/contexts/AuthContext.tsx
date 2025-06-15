
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, role: string, parentId: string) => void;
  logout: () => void;
  token: string | null;
  role: string | null;
  parentId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const [parentId, setParentId] = useState<string | null>(localStorage.getItem('parentId'));

  const login = (newToken: string, newRole: string, newParentId: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    localStorage.setItem('parentId', newParentId);
    setToken(newToken);
    setRole(newRole);
    setParentId(newParentId);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('parentId');
    setToken(null);
    setRole(null);
    setParentId(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token, role, parentId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
