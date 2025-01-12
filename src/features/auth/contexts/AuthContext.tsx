interface User {
  id: string;
  role: string;
  enrolledCourses?: string[];
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const updateUser = async () => {
    try {
      const response = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated, 
      login, 
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
} 