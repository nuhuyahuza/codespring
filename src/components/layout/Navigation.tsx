import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/features/auth';

interface NavigationProps {
  showBackButton?: boolean;
  className?: string;
}

export function Navigation({ showBackButton = false, className = '' }: NavigationProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className={`w-full py-4 px-6 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <Link to="/" className="text-2xl font-bold text-primary">
          Codespring
        </Link>
      </div>

      {user ? (
        <div className="flex items-center gap-6">
          {user.role === 'STUDENT' ? (
            <>
              <Link to="/courses" className="hover:text-primary">Courses</Link>
              <Link to="/my-learning" className="hover:text-primary">My Learning</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard/instructor" className="hover:text-primary">Dashboard</Link>
              <Link to="/courses/manage" className="hover:text-primary">My Courses</Link>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-primary"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link to="/courses" className="hover:text-primary">Courses</Link>
          <Link to="/about" className="hover:text-primary">About</Link>
          <Link to="/instructors" className="hover:text-primary">Instructors</Link>
        </div>
      )}
    </nav>
  );
} 