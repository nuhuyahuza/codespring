import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { useStudentDashboard } from '@/features/student/hooks/useStudentDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Calendar, Users } from 'lucide-react';
import { StudentDashboardLayout } from '@/components/layout/StudentDashboardLayout';

export function StudentDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: dashboard, isLoading } = useStudentDashboard();
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
      <div className="container py-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'Student'}! 👋</h1>
          <p className="text-muted-foreground">
            Keep up the great work! You're making excellent progress.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
              <Progress value={75} className="mt-2" />
            </CardContent>
          </Card>
          {/* Add more stat cards */}
        </div>

        {/* Course Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your courses..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Courses Section */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboard?.enrolledCourses.map((course) => (
                <div key={course.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{course.title}</h3>
                    <Progress value={course.progress} className="mt-2" />
                    <p className="text-sm text-muted-foreground mt-1">
                      {course.progress}% complete
                    </p>
                  </div>
                  <Button onClick={() => navigate(`/courses/${course.id}/learn`)}>
                    Resume
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Upcoming Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add upcoming classes list */}
              </CardContent>
            </Card>

            {/* Community Groups */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  My Groups
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add community groups list */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
} 