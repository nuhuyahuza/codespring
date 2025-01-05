import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useInstructorDashboard } from '@/features/instructor/hooks/useInstructorDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseManagement } from '@/features/instructor/components/CourseManagement';
import { SessionManagement } from '@/features/instructor/components/SessionManagement';
import { StudentProgress } from '@/features/instructor/components/StudentProgress';
import { Analytics } from '@/features/instructor/components/Analytics';
import { formatCurrency } from '@/lib/utils';
import { BookOpen, Users, Clock, DollarSign } from 'lucide-react';

export function InstructorDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { dashboard, isLoading, error } = useInstructorDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">⌛</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-destructive">Error loading dashboard</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="INSTRUCTOR">
      <div className="container py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your courses and track student progress
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboard.totalCourses}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboard.activeCourses} active courses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboard.totalStudents}</div>
                <p className="text-xs text-muted-foreground">
                  +{dashboard.newStudentsThisMonth} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboard.upcomingSessions}</div>
                <p className="text-xs text-muted-foreground">
                  Next 7 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(dashboard.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{formatCurrency(dashboard.revenueThisMonth)} this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Analytics data={dashboard.recentActivity} type="recent" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="courses">
              <CourseManagement courses={dashboard.courses} />
            </TabsContent>

            <TabsContent value="sessions">
              <SessionManagement sessions={dashboard.sessions} />
            </TabsContent>

            <TabsContent value="students">
              <StudentProgress students={dashboard.students} />
            </TabsContent>

            <TabsContent value="analytics">
              <Analytics data={dashboard.analytics} type="full" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
} 