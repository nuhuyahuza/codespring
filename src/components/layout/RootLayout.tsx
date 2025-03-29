import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAuth } from '@/features/auth';
import { ShoppingCart } from '@/components/cart/ShoppingCart';
import { useState, useEffect } from 'react';
import { MainFooter } from './MainFooter';
import { useTheme } from '@/hooks/useTheme';

export function RootLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Don't show header on auth pages or student pages
  const showHeaderAndFooter = ['/login', '/signup', '/onboarding','/dashboard/instructor','/student'].includes(location.pathname) || location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/student') || location.pathname.startsWith('/instructor') || location.pathname.startsWith('/admin');
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const firstSectionHeight = window.innerHeight;
      setShowNav(scrollPosition > firstSectionHeight - 100);
    };

    if (isLandingPage) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      setShowNav(true);
    }
  }, [isLandingPage]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!showHeaderAndFooter && (showNav || !isLandingPage) && (
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
              
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="w-9"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="w-9"
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>

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

      <main className="flex-1">{children}</main>

      {!showHeaderAndFooter && <MainFooter />}
    </div>
  );
} 