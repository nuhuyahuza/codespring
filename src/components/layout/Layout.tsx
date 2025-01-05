import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">CodeSpring</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link
                to="/courses"
                className="transition-colors hover:text-foreground/80 text-foreground"
              >
                Courses
              </Link>
              <Link
                to="/live-sessions"
                className="transition-colors hover:text-foreground/80 text-foreground"
              >
                Live Sessions
              </Link>
              <Link
                to="/groups"
                className="transition-colors hover:text-foreground/80 text-foreground"
              >
                Groups
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Add search functionality here */}
            </div>
            <nav className="flex items-center">
              <Button
                variant="ghost"
                className="mr-2 px-0 text-base hover:bg-transparent focus:ring-0 md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle menu</span>
              </Button>
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild className="hidden md:flex">
                <Link to="/signup">Get started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-14 z-50 w-full bg-background md:hidden">
          <nav className="container grid gap-y-4 p-4">
            <Link
              to="/courses"
              className="text-lg font-medium hover:text-foreground/80"
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              to="/live-sessions"
              className="text-lg font-medium hover:text-foreground/80"
              onClick={() => setIsMenuOpen(false)}
            >
              Live Sessions
            </Link>
            <Link
              to="/groups"
              className="text-lg font-medium hover:text-foreground/80"
              onClick={() => setIsMenuOpen(false)}
            >
              Groups
            </Link>
            <hr className="my-4" />
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                Sign in
              </Link>
            </Button>
            <Button asChild className="w-full">
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                Get started
              </Link>
            </Button>
          </nav>
        </div>
      )}

      <main className="container mx-auto py-6">{children}</main>

      <footer className="border-t bg-background">
        <div className="container py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold">About</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                    About us
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Support</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                    Contact us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Follow us</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CodeSpring. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 