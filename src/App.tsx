import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LandingPage } from "@/pages/LandingPage";
import { CoursesPage } from "@/pages/courses";
import { SignUpPage } from "@/pages/SignUpPage";
import { LoginPage } from "@/pages/LoginPage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/ResetPasswordPage";
import { CourseEnrollmentPage } from "@/pages/CourseEnrollmentPage";
import { CourseDiscussionsPage } from "@/pages/CourseDiscussionsPage";
import { StudentDashboardPage } from "@/pages/StudentDashboardPage";
import { InstructorDashboardPage } from "@/pages/InstructorDashboardPage";
import { CreateCoursePage } from "@/pages/CreateCoursePage";
import { EditCoursePage } from "@/pages/EditCoursePage";
import { DashboardRedirect } from "@/pages/DashboardRedirect";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Providers } from "@/components/providers";
import { CourseContentPage } from "@/pages/CourseContentPage";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Providers>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/courses" element={<CoursesPage />} />

          {/* Dashboard Redirect */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboardPage />
            </ProtectedRoute>
          }>
            <Route index element={<div>Admin Overview</div>} />
            <Route path="users" element={<div>Users Management</div>} />
            <Route path="courses" element={<div>Courses Management</div>} />
            <Route path="reports" element={<div>System Reports</div>} />
          </Route>

          {/* Protected Student Routes */}
          <Route
            path="/courses/:courseId"
            element={
              <ProtectedRoute>
                <CourseContentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId/enroll"
            element={
              <ProtectedRoute>
                <CourseEnrollmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId/discussions"
            element={
              <ProtectedRoute>
                <CourseDiscussionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Instructor Routes */}
          <Route
            path="/dashboard/instructor"
            element={
              <ProtectedRoute requiredRole="INSTRUCTOR">
                <InstructorDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/create"
            element={
              <ProtectedRoute requiredRole="INSTRUCTOR">
                <CreateCoursePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId/edit"
            element={
              <ProtectedRoute requiredRole="INSTRUCTOR">
                <EditCoursePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Providers>
    </QueryClientProvider>
  );
}

export default App;
