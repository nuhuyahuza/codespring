import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { useAuth } from '@/features/auth';

// Import your pages
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { UserOnboardingPage } from '@/pages/UserOnboardingPage';
import { DashboardRedirect } from '@/pages/DashboardRedirect';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { CoursesPage } from '@/pages/courses';
import { CourseDetailsPage } from '@/pages/courses/CourseDetailsPage';
import { InstructorsPage } from '@/pages/InstructorsPage';
import { AboutPage } from '@/pages/AboutPage';

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <RootLayout>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
        <Route path="/instructors" element={<InstructorsPage />} />
        <Route path="/about" element={<AboutPage />} />
        
        {/* Auth routes - redirect if already authenticated */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" state={{ from: location }} replace /> : 
              <LoginPage />
          } 
        />
        <Route 
          path="/signup" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" state={{ from: location }} replace /> : 
              <SignUpPage />
          } 
        />

        {/* Protected routes */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute requireOnboarding={false}>
              <UserOnboardingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* Catch all route - only redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </RootLayout>
  );
}

export default App;
