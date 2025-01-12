import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string | null;
  progress: number;
  lastAccessedAt: string;
}

interface Certificate {
  id: string;
  courseTitle: string;
  issueDate: string;
  credential: string;
}

interface Session {
  id: string;
  courseTitle: string;
  startTime: string;
  duration: number;
  instructor: string;
}

interface ProgressData {
  date: string;
  hoursSpent: number;
  lessonsCompleted: number;
}

interface DashboardData {
  enrolledCourses: number;
  activeCourses: number;
  hoursLearned: number;
  certificateCount: number;
  averageProgress: number;
  recentCourses: Course[];
  allCourses: Course[];
  progress: ProgressData[];
  upcomingSessions: Session[];
  certificates: Certificate[];
}

async function fetchDashboard(token: string): Promise<DashboardData> {
  const response = await api.get("/student/dashboard", token);
  return response;
}

export function useStudentDashboard() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['studentDashboard'],
    queryFn: async () => {
      const response = await api.get('/student/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
} 