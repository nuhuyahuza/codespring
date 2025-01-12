import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
}

const menuItems = [
  {
    title: 'Overview',
    path: '/admin',
    icon: BarChart3,
  },
  {
    title: 'Users',
    path: '/admin/users',
    icon: Users,
  },
  {
    title: 'Courses',
    path: '/admin/courses',
    icon: BookOpen,
  },
  {
    title: 'Settings',
    path: '/admin/settings',
    icon: Settings,
  },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCurrentPath = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/admin';
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-full bg-white shadow-sm transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex h-16 items-center justify-between px-4 border-b">
              {!collapsed && (
                <Link to="/" className="text-xl font-bold text-gray-800">
                  CodeSpring
                </Link>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? <ChevronRight /> : <ChevronLeft />}
              </Button>
            </div>

            {/* Navigation */}
            <nav className="mt-6 px-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'mb-1 flex items-center rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-50',
                    isCurrentPath(item.path) &&
                      'bg-blue-50 text-blue-600 hover:bg-blue-50'
                  )}
                >
                  <item.icon className={cn('h-5 w-5', collapsed && 'mx-auto')} />
                  {!collapsed && <span className="ml-3">{item.title}</span>}
                </Link>
              ))}
            </nav>
          </div>

          {/* User Section */}
          <div className="border-t p-4">
            {!collapsed && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
              </div>
            )}
            <Button
              variant="ghost"
              className={cn(
                'flex w-full items-center text-gray-600 hover:bg-gray-50',
                collapsed && 'justify-center'
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          'flex flex-col flex-1 min-h-screen transition-all duration-300',
          collapsed ? 'ml-16' : 'ml-64'
        )}
      >
        {/* Content */}
        <main className="flex-1 p-8">{children}</main>

        {/* Footer */}
        <footer className="mt-auto border-t bg-white p-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">
                  © {new Date().getFullYear()} CodeSpring. All rights reserved.
                </p>
              </div>
              <div className="flex space-x-6">
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                  Terms of Service
                </Link>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
} 