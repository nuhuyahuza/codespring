import { createContext } from 'react';

export interface User {
  id: string;
  role: string;
  enrolledCourses?: string[];
  // ... other user properties
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null); 