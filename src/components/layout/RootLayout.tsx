import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui';
import { MainFooter } from './MainFooter';
import { useTheme } from '@/hooks/useTheme';

export function RootLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isDashboardRoute = location.pathname.includes('/dashboard') || 
    location.pathname.includes('/admin');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      if (isLandingPage) {
        const scrollPosition = window.scrollY;
        setShowNav(scrollPosition > window.innerHeight * 0.8);
      }
    };

    if (isLandingPage) {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
    } else if (!isAuthPage) {
      setShowNav(true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLandingPage, isAuthPage]);

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${
          showNav ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-foreground">CodeSpring</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-6">
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
                className="hover:bg-transparent"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 hover:text-yellow-500 transition-colors" />
                ) : (
                  <Moon className="h-5 w-5 hover:text-blue-500 transition-colors" />
                )}
              </Button>
              <Link to="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link to="/signup">
                <Button>Get started</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className="hover:bg-transparent"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 hover:text-yellow-500 transition-colors" />
                ) : (
                  <Moon className="h-5 w-5 hover:text-blue-500 transition-colors" />
                )}
              </Button>
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
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/courses"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link
                  to="/instructors"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Instructors
                </Link>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">Sign in</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Get started</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className={showNav ? 'pt-16' : ''}>
        <Outlet />
      </main>

      {/* Footer - Only show on non-dashboard routes */}
      {!isDashboardRoute && <MainFooter />}
    </div>
  );
} 