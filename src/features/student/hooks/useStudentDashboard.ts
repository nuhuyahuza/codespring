import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { api } from '@/lib/api';

interface DashboardData {
  enrolledCourses: number;
  activeCourses: number;
  hoursLearned: number;
  certificateCount: number;
  averageProgress: number;
  recentCourses: Array<{
    id: string;
    title: string;
    thumbnail: string;
    progress: number;
    lastAccessedAt: string;
  }>;
  allCourses: Array<{
    id: string;
    title: string;
    thumbnail: string;
    progress: number;
    instructor: string;
    category: string;
  }>;
  progress: Array<{
    date: string;
    hoursSpent: number;
    lessonsCompleted: number;
  }>;
  upcomingSessions: Array<{
    id: string;
    courseTitle: string;
    startTime: string;
    duration: number;
    instructor: string;
  }>;
  certificates: Array<{
    id: string;
    courseTitle: string;
    issueDate: string;
    credential: string;
  }>;
}

export function useStudentDashboard() {
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
        const response = await api.get<DashboardData>('/api/student/dashboard');
        setDashboard(response.data);
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