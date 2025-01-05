import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui';

export function RootLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Link to="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link to="/signup">
                <Button>Get started</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-2">
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t md:hidden">
            <div className="container mx-auto px-4 py-4 space-y-4">
              <Link
                to="/courses"
                className="block text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              <Link
                to="/instructors"
                className="block text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Instructors
              </Link>
              <Link
                to="/about"
                className="block text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="pt-4 space-y-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-center">
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full justify-center">
                    Get started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">About</h3>
              <p className="text-sm text-muted-foreground">
                CodeSpring is a modern platform for online learning and teaching.
                Join millions of students and instructors in our global classroom.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Learn</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/courses" className="text-muted-foreground hover:text-foreground">
                    Browse courses
                  </Link>
                </li>
                <li>
                  <Link to="/instructors" className="text-muted-foreground hover:text-foreground">
                    Find instructors
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Teach</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/teach" className="text-muted-foreground hover:text-foreground">
                    Become an instructor
                  </Link>
                </li>
                <li>
                  <Link to="/resources" className="text-muted-foreground hover:text-foreground">
                    Teaching resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="text-muted-foreground hover:text-foreground">
                    Help center
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} CodeSpring. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 