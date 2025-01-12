import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { User, CartItem } from '../types';

export interface AuthContextType {
  user: User | null;
  cart: CartItem[];
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  cart: [],
  login: async () => { throw new Error('Not implemented') },
  logout: () => {},
  isLoading: false,
  error: null,
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  isAuthenticated: false
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authAttempted, setAuthAttempted] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      if (authAttempted) return;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          setIsLoading(false);
          setIsInitialized(true);
          setAuthAttempted(true);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
        setAuthAttempted(true);
      }
    };

    initAuth();
  }, [authAttempted]);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCart([]);
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      if (!prev.some(i => i.id === item.id)) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Show loading spinner while initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider 
      value={{
        user,
        cart,
        login,
        logout,
        isLoading,
        error,
        addToCart,
        removeFromCart,
        clearCart,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext, AuthProvider, useAuth }; 