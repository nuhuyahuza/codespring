import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/features/auth';
import { ShoppingCart } from '@/components/cart/ShoppingCart';
import { useState } from 'react';

export function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Don't show header on auth pages
  const isAuthPage = ['/login', '/signup', '/onboarding'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      {!isAuthPage && (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold">CodeSpring</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/courses" className="text-muted-foreground hover:text-foreground">
                Courses
              </Link>
              <Link to="/instructors" className="text-muted-foreground hover:text-foreground">
                Instructors
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground">
                About
              </Link>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {user?.role === 'STUDENT' && <ShoppingCart />}
                  <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
                    Dashboard
                  </Link>
                  <Button variant="ghost" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link to="/signup">
                    <Button>Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden p-4 border-t">
              <nav className="flex flex-col space-y-4">
                <Link to="/courses" className="text-muted-foreground hover:text-foreground">
                  Courses
                </Link>
                <Link to="/instructors" className="text-muted-foreground hover:text-foreground">
                  Instructors
                </Link>
                <Link to="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
                
                {isAuthenticated ? (
                  <>
                    {user?.role === 'STUDENT' && <ShoppingCart />}
                    <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
                      Dashboard
                    </Link>
                    <Button variant="ghost" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost">Login</Button>
                    </Link>
                    <Link to="/signup">
                      <Button>Sign Up</Button>
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </header>
      )}

      <main>{children}</main>
    </div>
  );
} 