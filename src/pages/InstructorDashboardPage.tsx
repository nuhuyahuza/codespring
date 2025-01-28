import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseManagement } from '@/features/instructor/components/CourseManagement';
import { BookOpen, Users, Clock, DollarSign, PlusCircle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/utils';
import { CreateCourseModal } from '@/features/instructor/components/CreateCourseModal';
import { Button } from '@/components/ui';
import { EmptyState } from '@/components/EmptyState';
import { Navigation } from '@/components/layout/Navigation';

interface DashboardStats {
  courses: number;
  students: number;
  revenue: number;
  rating: number;
  recentCourses: any[];
}

export function InstructorDashboardPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['instructor-stats'],
    queryFn: () => api.get('/api/instructor/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">⌛</div>
      </div>
    );
  }

  if (!isLoading && stats?.courses === 0) {
    return (
      <ProtectedRoute requiredRole="INSTRUCTOR">
        <div className="container py-16">
          <EmptyState
            icon={<BookOpen className="w-12 h-12 text-muted-foreground" />}
            title="No Courses Yet"
            description="Start your teaching journey by creating your first course."
            action={
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Your First Course
              </Button>
            }
          />
          <CreateCourseModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['instructor-stats'] });
            }}
          />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="INSTRUCTOR">
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="py-8">
          <div className="container mx-auto px-6">
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
                    <div className="text-2xl font-bold">{stats?.courses}</div>
                    <p className="text-xs text-muted-foreground">
                      Active courses
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.students}</div>
                    <p className="text-xs text-muted-foreground">
                      Enrolled students
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats?.revenue || 0)}</div>
                    <p className="text-xs text-muted-foreground">
                      Lifetime earnings
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.rating.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">
                      Out of 5 stars
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Content Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="courses">Courses</TabsTrigger>
                  <TabsTrigger value="students">Students</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="col-span-full">
                      <CardHeader>
                        <CardTitle>Recent Courses</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {stats?.recentCourses.map((course) => (
                          <div
                            key={course.id}
                            className="flex items-center justify-between py-2"
                          >
                            <div>
                              <div className="font-medium">{course.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {course._count.enrollments} students enrolled
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(course.price)}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="courses">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Your Courses</h2>
                    <Button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Create New Course
                    </Button>
                  </div>
                  <CourseManagement />
                  <CreateCourseModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                      queryClient.invalidateQueries({ queryKey: ['instructor-stats'] });
                    }}
                  />
                </TabsContent>

                <TabsContent value="students">
                  <div className="text-center text-muted-foreground">
                    Student management coming soon...
                  </div>
                </TabsContent>

                <TabsContent value="analytics">
                  <div className="text-center text-muted-foreground">
                    Analytics dashboard coming soon...
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}