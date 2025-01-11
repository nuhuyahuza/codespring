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

    switch (user.role) {
      case 'STUDENT':
        navigate('/dashboard/student');
        break;
      case 'INSTRUCTOR':
        navigate('/dashboard/instructor');
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