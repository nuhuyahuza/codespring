import { createContext } from 'react';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  hasCompletedOnboarding: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: false,
  error: null,
  isAuthenticated: false
}); 