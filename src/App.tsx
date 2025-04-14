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
import { InstructorsPage } from '@/pages/InstructorsPage';
import { AboutPage } from '@/pages/AboutPage';
import { StudentDashboardPage } from '@/pages/StudentDashboardPage';
import { InstructorDashboardPage } from '@/pages/InstructorDashboardPage';
import { LiveClassesPage } from '@/pages/student/LiveClassesPage';
import { AssignmentsPage } from '@/pages/student/AssignmentsPage';
import { CommunityPage } from '@/pages/student/CommunityPage';
import { CertificatesPage } from '@/pages/student/CertificatesPage';
import { CourseLearnPage } from '@/pages/student/CourseLearnPage';
import { CourseDetailPage } from '@/pages/CourseDetailPage';
import { CourseCreationPage } from '@/pages/instructor/CourseCreationPage';
import { CoursesPage } from './pages/CoursesPage';
import { CartPage } from '@/pages/CartPage';

import NotFound from "./pages/NotFound";
import { StudentDashboardLayout } from "./components/layout/StudentDashboardLayout";
import { InstructorDashboardLayout } from "./components/layout/instructor-dashboard-layout";
import { AdminDashboardLayout } from "./components/layout/admin-dashboard-layout";
import Dashboard from "./pages/Dashboard";
import CourseDetail from "./pages/CourseDetail";
import LiveClasses from "./pages/LiveClasses";
import Assignments from "./pages/Assignments";
import CommunityGroups from "./pages/CommunityGroups";
import Certificates from "./pages/Certificates";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Support from "./pages/Support";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminInstructors from "./pages/admin/AdminInstructors";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminLiveClasses from "./pages/admin/AdminLiveClasses";
import AdminAssignments from "./pages/admin/AdminAssignments";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminPermissions from "./pages/admin/AdminPermissions";
import AdminReports from "./pages/admin/AdminReports";
import Courses from './pages/Courses_1';

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

            
            {/* Student Dashboard Routes */}
            <Route element={<StudentDashboardLayout />}>
              <Route path="/student/dashboard" element={<Dashboard />} />
              
              <Route path="/student/courses" element={<Courses />} />
              <Route path="/student/courses/:courseId" element={<CourseDetail />} />
              <Route path="/student/live-classes" element={<LiveClasses />} />
              <Route path="/student/assignments" element={<Assignments />} />
              <Route path="/student/community" element={<CommunityGroups />} />
              <Route path="/student/certificates" element={<Certificates />} />
              <Route path="/student/calendar" element={<NotFound />} />
              <Route path="/student/profile" element={<Profile />} />
              <Route path="/student/notifications" element={<Notifications />} />
              <Route path="/student/support" element={<Support />} />
            </Route>
            
            {/* Instructor Dashboard Routes */}
            <Route element={<InstructorDashboardLayout />}>
              <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
              <Route path="/instructor/courses" element={<NotFound />} />
              <Route path="/instructor/courses/create" element={<NotFound />} />
              <Route path="/instructor/live-classes" element={<NotFound />} />
              <Route path="/instructor/assignments" element={<NotFound />} />
              <Route path="/instructor/students" element={<NotFound />} />
              <Route path="/instructor/analytics" element={<NotFound />} />
              <Route path="/instructor/calendar" element={<NotFound />} />
              <Route path="/instructor/profile" element={<NotFound />} />
              <Route path="/instructor/settings" element={<NotFound />} />
            </Route>
            
            {/* Admin Dashboard Routes */}
            <Route element={<AdminDashboardLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/instructors" element={<AdminInstructors />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/courses" element={<AdminCourses />} />
              <Route path="/admin/live-classes" element={<AdminLiveClasses />} />
              <Route path="/admin/assignments" element={<AdminAssignments />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
              <Route path="/admin/permissions" element={<AdminPermissions />} />
              <Route path="/admin/reports" element={<AdminReports />} />
            </Route>
        </Routes>
      </RootLayout>
    </CartProvider>
  );
}

export default App;
