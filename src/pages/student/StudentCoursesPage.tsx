import { useState } from 'react';
import { Search,Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { StudentDashboardLayout } from '@/components/layout/StudentDashboardLayout';
import { EnrolledCourses } from '@/features/student/components/EnrolledCourses';
import { useStudentDashboard } from '@/features/student/hooks/useStudentDashboard';

interface Course {
  id: string;
  title: string;
  thumbnail: string | null;
  progress: number;
  instructor: {
    name: string;
  };
  lastAccessedAt?: string;
}

export function StudentCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: dashboard, isLoading, error } = useStudentDashboard();

  if (isLoading) {
    return (
      <StudentDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </StudentDashboardLayout>
    );
  }

  if (error || !dashboard?.enrolledCourses) {
    return (
      <StudentDashboardLayout>
        <div className="container py-6">
          <div className="text-center text-muted-foreground">
            Unable to load your courses. Please try again later.
          </div>
        </div>
      </StudentDashboardLayout>
    );
  }

  const filteredCourses = dashboard.enrolledCourses.filter((course: Course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <StudentDashboardLayout>
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Courses</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your courses..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <EnrolledCourses 
          courses={filteredCourses}
          showProgress={true}
          showFilters={true}
        />
      </div>
    </StudentDashboardLayout>
  );
} 