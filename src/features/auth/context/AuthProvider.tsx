import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { User, CartItem } from '../types';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = sessionStorage.getItem('token');
      if (storedToken) {
        try {
          const decoded = jwtDecode<{ userId: string; email: string; role: string }>(storedToken);
          setToken(storedToken);
          
          // Fetch user data from API
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            sessionStorage.removeItem('token');
            setToken(null);
          }
        } catch (err) {
          console.error('Token validation error:', err);
          sessionStorage.removeItem('token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid credentials');
      }

      const { token: newToken, user: userData } = await response.json();
      
      // Store token in both state and sessionStorage
      sessionStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      console.log('Login successful:', { token: newToken?.slice(0, 10) + '...', user: userData });
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setCart([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser: () => Promise.resolve(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 