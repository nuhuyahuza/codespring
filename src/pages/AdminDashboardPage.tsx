import { Link, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { UserManagement } from '@/features/admin/components/UserManagement';
import { CourseManagement } from '@/features/admin/components/CourseManagement';
import { Card, CardContent } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, DollarSign } from 'lucide-react';

export function AdminDashboardPage() {
  const location = useLocation();
  const currentPath = location.pathname;

  const renderContent = () => {
    switch (currentPath) {
      case '/admin/users':
        return <UserManagement />;
      case '/admin/courses':
        return <CourseManagement />;
      case '/admin/settings':
        return <div>Settings Dashboard</div>;
      default:
        return (
          <div className="space-y-8">
            <h1 className="text-2xl font-semibold">Overview</h1>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-500">Total Users</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-semibold">1,234</span>
                    <div className="text-sm text-gray-500">+180 from last month</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-500">Total Courses</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-semibold">45</span>
                    <div className="text-sm text-gray-500">+3 from last month</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-500">Active Enrollments</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-semibold">2,567</span>
                    <div className="text-sm text-gray-500">+201 from last month</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-500">Total Revenue</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-2xl font-semibold">$45,231.89</span>
                    <div className="text-sm text-gray-500">+20.1% from last month</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Management Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2">User Management</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Manage system users, roles, and permissions
                  </p>
                  <Link
                    to="/admin/users"
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    View Users →
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2">Course Management</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Manage courses, content, and enrollments
                  </p>
                  <Link
                    to="/admin/courses"
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    View Courses →
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2">System Settings</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Configure system settings and preferences
                  </p>
                  <Link
                    to="/admin/settings"
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    View Settings →
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return <DashboardLayout>{renderContent()}</DashboardLayout>;
} 