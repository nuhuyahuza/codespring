import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { api } from '@/lib/api';

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  price: number;
  enrollmentCount: number;
  rating: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  lastUpdated: string;
}

interface Session {
  id: string;
  courseTitle: string;
  startTime: string;
  duration: number;
  enrolledStudents: number;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
}

interface Student {
  id: string;
  name: string;
  email: string;
  enrolledCourses: number;
  averageProgress: number;
  lastActive: string;
}

interface ActivityData {
  enrollments: Array<{
    date: string;
    count: number;
  }>;
  revenue: Array<{
    date: string;
    amount: number;
  }>;
  ratings: Array<{
    date: string;
    average: number;
    count: number;
  }>;
}

interface DashboardData {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  newStudentsThisMonth: number;
  upcomingSessions: number;
  totalRevenue: number;
  revenueThisMonth: number;
  courses: Course[];
  sessions: Session[];
  students: Student[];
  recentActivity: ActivityData;
  analytics: ActivityData;
}

export function useInstructorDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      if (!user) {
        setError('User not authenticated');
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<DashboardData>('/api/instructor/dashboard');
        setDashboard(response);
        setError(null);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, [user]);

  return {
    dashboard,
    isLoading,
    error,
  };
} 