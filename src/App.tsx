import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { useAuth } from '@/features/auth';
import { CartProvider } from '@/contexts/CartContext';
import { wsClient } from '@/lib/websocket';
import { useEffect } from 'react';

// Import your pages
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { UserOnboardingPage } from '@/pages/UserOnboardingPage';
import { DashboardRedirect } from '@/pages/DashboardRedirect';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { CourseDetailsPage } from '@/pages/courses/CourseDetailsPage';
import { InstructorsPage } from '@/pages/InstructorsPage';
import { AboutPage } from '@/pages/AboutPage';
import { StudentDashboardPage } from '@/pages/StudentDashboardPage';
import { InstructorDashboardPage } from '@/pages/InstructorDashboardPage';
import { LiveClassesPage } from '@/pages/student/LiveClassesPage';
import { AssignmentsPage } from '@/pages/student/AssignmentsPage';
import { CommunityPage } from '@/pages/student/CommunityPage';
import { CertificatesPage } from '@/pages/student/CertificatesPage';
import { StudentCoursesPage } from '@/pages/student/StudentCoursesPage';
import { CourseLearnPage } from '@/pages/student/CourseLearnPage';
import { CourseDetailPage } from '@/pages/CourseDetailPage';
import { CourseCreationPage } from '@/pages/instructor/CourseCreationPage';
import { CoursesPage } from './pages/CoursesPage';
import { CartPage } from '@/pages/CartPage';

function App() {
  const { isAuthenticated, token } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      wsClient.connect(token);
    }
  }, [token]);

  return (
    <CartProvider>
      <RootLayout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/instructors" element={<InstructorsPage />} />
          <Route path="/about" element={<AboutPage />} />
          
          {/* Auth routes */}
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
                <Routes>
                  <Route index element={<DashboardRedirect />} />
                  <Route path="student/*" element={<StudentDashboardPage />} />
                  <Route path="instructor/*" element={<InstructorDashboardPage />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Instructor Routes */}
          <Route 
            path="/dashboard/courses/create" 
            element={
              <ProtectedRoute>
                <CourseCreationPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/courses/:courseId/edit" 
            element={
              <ProtectedRoute>
                <CourseCreationPage />
              </ProtectedRoute>
            } 
          />

          {/* Student Dashboard Routes */}
          <Route path="/dashboard/student" element={<StudentDashboardPage />} />
          <Route path="/dashboard/student/courses" element={<StudentCoursesPage />} />
          <Route path="/dashboard/student/live-classes" element={<LiveClassesPage />} />
          <Route path="/dashboard/student/assignments" element={<AssignmentsPage />} />
          <Route path="/dashboard/student/community" element={<CommunityPage />} />
          <Route path="/dashboard/student/certificates" element={<CertificatesPage />} />
          
          {/* Course Learning Route */}
          <Route 
            path="/student/courses/:courseId/learn" 
            element={
                <CourseLearnPage />
            } 
          />

          {/* Course Details Route */}
          <Route path="/courses/:id" element={<CourseDetailPage />} />

          {/* Cart Route */}
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } 
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RootLayout>
    </CartProvider>
  );
}

export default App;
