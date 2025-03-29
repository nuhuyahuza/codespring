import { createContext } from 'react';

export interface User {
  id: string;
  role: string;
  name:string;
  enrolledCourses?: string[];
  hasCompletedOnboarding: boolean;
  // ... other user properties
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null); 