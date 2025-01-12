import { Link, Outlet, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { UserManagement } from '@/features/admin/components/UserManagement';
import { CourseManagement } from '@/features/admin/components/CourseManagement';

export function AdminDashboardPage() {
  const location = useLocation();
  const currentPath = location.pathname;

  const renderContent = () => {
    switch (currentPath) {
      case '/admin/users':
        return <UserManagement />;
      case '/admin/courses':
        return <CourseManagement />;
      case '/admin/reports':
        return <div>Reports Dashboard</div>;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Users</h2>
              <p className="text-gray-600 mb-4">Manage system users</p>
              <Link
                to="/admin/users"
                className="text-blue-600 hover:text-blue-800"
              >
                View Users →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Courses</h2>
              <p className="text-gray-600 mb-4">Manage all courses</p>
              <Link
                to="/admin/courses"
                className="text-blue-600 hover:text-blue-800"
              >
                View Courses →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Reports</h2>
              <p className="text-gray-600 mb-4">View system analytics</p>
              <Link
                to="/admin/reports"
                className="text-blue-600 hover:text-blue-800"
              >
                View Reports →
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        {renderContent()}
      </div>
    </DashboardLayout>
  );
} 