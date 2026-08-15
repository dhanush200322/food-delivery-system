"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthResponse, ApiResponse } from '@/types';
import { fetchApi } from '@/lib/api';
import { getToken, setToken as setLocalToken, removeToken as removeLocalToken } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
  isCustomer: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On mount, check if token exists and validate session
    const initAuth = async () => {
      const storedToken = getToken();
      if (storedToken) {
        try {
          // fetchApi automatically uses getToken() from lib/auth
          const response = await fetchApi<ApiResponse<{ user: User }>>('/api/auth/me');
          setUser(response.data.user);
          setToken(storedToken);
        } catch (error) {
          // Token is invalid or expired
          console.error("Session restored failed:", error);
          removeLocalToken();
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (data: AuthResponse) => {
    setLocalToken(data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    removeLocalToken();
    setToken(null);
    setUser(null);
  };

  const isCustomer = user?.role === 'CUSTOMER';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        isCustomer,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
