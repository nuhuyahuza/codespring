import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

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

async function fetchDashboard(): Promise<DashboardData> {
  return api.get("/api/dashboard/student");
}

export function useStudentDashboard() {
  return useQuery({
    queryKey: ["studentDashboard"],
    queryFn: fetchDashboard,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 60 * 1000, // Consider data stale after 1 minute
  });
} 