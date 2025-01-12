import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth';

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
    return <div>Loading...</div>;
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Handle onboarding redirection - only if requireOnboarding is true and user hasn't completed it
  if (requireOnboarding && user && !user.hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // For students who have completed onboarding but haven't enrolled in any courses
  if (user?.role === 'STUDENT' && user?.hasCompletedOnboarding && location.pathname === '/dashboard') {
    return <Navigate to="/courses" replace />;
  }

  return <>{children}</>;
} 