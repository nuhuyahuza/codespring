import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/features/auth";

interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string | null;
  progress: number;
  lastAccessedAt: string;
}

interface DashboardData {
  enrolledCourses: number;
  activeCourses: number;
  hoursLearned: number;
  averageProgress: number;
  recentCourses: Course[];
  allCourses: Course[];
}

const MOCK_DASHBOARD_DATA: DashboardData = {
  enrolledCourses: 3,
  activeCourses: 2,
  hoursLearned: 25,
  averageProgress: 75,
  recentCourses: [
    {
      id: '1',
      title: 'Advanced JavaScript Development',
      instructor: 'John Doe',
      thumbnail: '/placeholder-course.jpg',
      progress: 75,
      lastAccessedAt: new Date().toISOString(),
    },
    // Add more mock courses as needed
  ],
  allCourses: [
    // Same as recentCourses for now
  ]
};

export function useStudentDashboard() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['studentDashboard'],
    queryFn: async () => {
      if (import.meta.env.DEV) {
        // Return mock data in development
        return MOCK_DASHBOARD_DATA;
      }
      const response = await api.get('/student/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
} 