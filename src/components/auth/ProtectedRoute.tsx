import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requireOnboarding?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  requireOnboarding = true 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Handle onboarding redirection
  if (requireOnboarding && user?.hasCompletedOnboarding === false) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
} 