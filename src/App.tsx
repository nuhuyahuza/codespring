import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SignUpPage } from './pages/SignUpPage';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseEnrollmentPage } from './pages/CourseEnrollmentPage';
import { CourseContentPage } from './pages/CourseContentPage';
import { Layout } from './components/layout/Layout';
import { AuthProvider } from './features/auth/context/AuthContext';
import { PaymentProvider } from './features/payment/context/PaymentContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PaymentProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:courseId/enroll" element={<CourseEnrollmentPage />} />
                <Route path="/courses/:courseId/learn" element={<CourseContentPage />} />
                <Route path="/" element={<Navigate to="/courses" replace />} />
              </Routes>
            </Layout>
          </Router>
        </PaymentProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
