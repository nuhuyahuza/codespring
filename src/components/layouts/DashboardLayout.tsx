import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold text-gray-800">
                CodeSpring
              </Link>
              <Link to="/courses" className="text-gray-600 hover:text-gray-800">
                Courses
              </Link>
              {user?.role === 'INSTRUCTOR' && (
                <Link
                  to="/dashboard/instructor"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Instructor Dashboard
                </Link>
              )}
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
} 