import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { useStudentDashboard } from '@/features/student/hooks/useStudentDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';

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

      {/* Progress Overview */}
      <div className="flex justify-end">
        <div className="w-32 h-32 relative">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-muted stroke-current"
              strokeWidth="10"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className="text-primary stroke-current"
              strokeWidth="10"
              strokeLinecap="round"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
              strokeDasharray={`${75 * 2.51327} 251.327`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">75%</span>
          </div>
        </div>
      </div>

      {/* Course Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* My Courses */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">My Courses</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dashboard?.recentCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={course.progress} />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{course.progress}% complete</span>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate(`/courses/${course.id}/learn`)}
                  >
                    Resume Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 