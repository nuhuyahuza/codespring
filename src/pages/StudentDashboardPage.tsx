import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useStudentDashboard } from '@/features/student/hooks/useStudentDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnrolledCourses } from '@/features/student/components/EnrolledCourses';
import { LearningProgress } from '@/features/student/components/LearningProgress';
import { UpcomingSessions } from '@/features/student/components/UpcomingSessions';
import { Certificates } from '@/features/student/components/Certificates';
import { BookOpen, Clock, Award, BarChart, Loader2 } from 'lucide-react';
import { getErrorMessage } from '@/lib/utils';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function StudentDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const { data: dashboard, isLoading, error } = useStudentDashboard();

  useEffect(() => {
    // If user has no enrolled courses, redirect to courses page
    if (user?.role === 'STUDENT' && (!user.enrolledCourses || user.enrolledCourses.length === 0)) {
      navigate('/courses');
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-destructive">Error loading dashboard</h2>
        <p className="text-muted-foreground">{getErrorMessage(error)}</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-destructive">No dashboard data available</h2>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="STUDENT">
      <div className="container py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Learning Dashboard</h1>
            <p className="text-muted-foreground">
              Track your progress and continue learning
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboard.enrolledCourses}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboard.activeCourses} active courses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboard.hoursLearned}h</div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Certificates</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboard.certificateCount}</div>
                <p className="text-xs text-muted-foreground">
                  Earned certificates
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboard.averageProgress}%</div>
                <p className="text-xs text-muted-foreground">
                  Across all courses
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Continue Learning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EnrolledCourses
                      courses={dashboard.recentCourses}
                      showProgress
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="courses">
              <EnrolledCourses
                courses={dashboard.allCourses}
                showProgress
                showFilters
              />
            </TabsContent>

            <TabsContent value="progress">
              <LearningProgress progress={dashboard.progress} />
            </TabsContent>

            <TabsContent value="sessions">
              <UpcomingSessions sessions={dashboard.upcomingSessions} />
            </TabsContent>

            <TabsContent value="certificates">
              <Certificates certificates={dashboard.certificates} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
} 