import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAnalytics } from '@/features/admin/hooks/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from '@/features/admin/components/UserManagement';
import { CourseManagement } from '@/features/admin/components/CourseManagement';
import { EnrollmentManagement } from '@/features/admin/components/EnrollmentManagement';
import { RevenueChart } from '@/features/admin/components/RevenueChart';
import { formatCurrency } from '@/lib/utils';
import { Users, BookOpen, GraduationCap, DollarSign } from 'lucide-react';

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { analytics, isLoading, error } = useAnalytics();

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
        <h2 className="text-xl font-semibold text-destructive">Error loading analytics</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="container py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your platform and view analytics
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  +{analytics.newUsersThisMonth} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalCourses}</div>
                <p className="text-xs text-muted-foreground">
                  +{analytics.newCoursesThisMonth} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalEnrollments}</div>
                <p className="text-xs text-muted-foreground">
                  +{analytics.newEnrollmentsThisMonth} this month
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
                  {formatCurrency(analytics.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{formatCurrency(analytics.revenueThisMonth)} this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <RevenueChart data={analytics.revenueData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <UserManagement />
            </TabsContent>

            <TabsContent value="courses">
              <CourseManagement />
            </TabsContent>

            <TabsContent value="enrollments">
              <EnrollmentManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
} 