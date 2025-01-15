import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth';

interface DashboardData {
  enrolledCourses: Array<{
    id: string;
    title: string;
    thumbnail: string | null;
    progress: number;
    instructor: {
      name: string;
    };
  }>;
  stats: {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
  };
}

export function useStudentDashboard() {
  const { token } = useAuth();

  return useQuery<DashboardData>({
    queryKey: ['studentDashboard'],
    queryFn: async () => {
      console.log('Starting to fetch student dashboard...');
      
      if (!token) {
        console.error('No auth token available');
        throw new Error('Authentication token is required');
      }

      try {
        console.log('Making request with token:', token.slice(0, 10) + '...');
        
        const response = await fetch('http://localhost:5000/api/student', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Dashboard API Error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });
          throw new Error(`Failed to fetch dashboard: ${response.status} ${errorText}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          console.error('Unexpected content type:', contentType);
          throw new Error('Server did not return JSON');
        }

        const data = await response.json();
        console.log('Raw API Response:', data);
        
        // Validate the response structure
        if (!data || typeof data !== 'object') {
          console.error('Invalid response format:', data);
          throw new Error('Invalid response format');
        }

        if (!Array.isArray(data.enrolledCourses)) {
          console.error('enrolledCourses is not an array:', data.enrolledCourses);
          throw new Error('Invalid enrolledCourses format');
        }

        // Log each course for debugging
        data.enrolledCourses.forEach((course: { 
          id: string;
          title: string;
          progress: number;
          instructor: { name: string; }
        }, index:number) => {
          console.log(`Course ${index + 1}:`, {
            id: course.id,
            title: course.title,
            progress: course.progress,
            instructor: course.instructor?.name
          });
        });

        return data;
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        throw error;
      }
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });
} 