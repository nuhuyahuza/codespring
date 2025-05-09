import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function DashboardRedirect() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    // Check if user has completed onboarding
    if (!user.hasCompletedOnboarding) {
      navigate('/onboarding');
      return;
    }

    // Always navigate to the role-specific dashboard, let the dashboard handle empty states
    switch (user.role) {
      case 'STUDENT':
        navigate('/student/dashboard');
        break;
      case 'INSTRUCTOR':
        navigate('/instructor/dashboard');
        break;
      case 'ADMIN':
        navigate('/admin');
        break;
      default:
        navigate('/unauthorized');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">⌛</div>
      </div>
    );
  }

  return null;
} 