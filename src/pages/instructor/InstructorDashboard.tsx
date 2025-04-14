import { PageHeader } from "@/components/ui/page-header";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart, BookOpen, Users, Video, FileText, Calendar, PlusCircle } from "lucide-react";

const InstructorDashboard = () => {
  // Mock data for dashboard stats
  const stats = {
    totalStudents: 256,
    totalCourses: 8,
    activeClasses: 3,
    pendingAssignments: 12,
    totalRevenue: "$24,500",
    averageRating: 4.8
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Instructor Dashboard" 
        description="Manage your courses, students, and teaching schedule"
      >
        <Button asChild>
          <Link to="/instructor/courses/create" className="flex items-center gap-2">
            <PlusCircle size={16} />
            Create New Course
          </Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard className="dashboard-stats-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="stats-label">Total Students</p>
              <p className="stats-value">{stats.totalStudents}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-2">
            <Link to="/instructor/students" className="text-sm text-primary hover:underline">
              View all students
            </Link>
          </div>
        </DashboardCard>

        <DashboardCard className="dashboard-stats-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="stats-label">Your Courses</p>
              <p className="stats-value">{stats.totalCourses}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <BookOpen size={20} />
            </div>
          </div>
          <div className="mt-2">
            <Link to="/instructor/courses" className="text-sm text-primary hover:underline">
              Manage courses
            </Link>
          </div>
        </DashboardCard>

        <DashboardCard className="dashboard-stats-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="stats-label">Active Classes</p>
              <p className="stats-value">{stats.activeClasses}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Video size={20} />
            </div>
          </div>
          <div className="mt-2">
            <Link to="/instructor/live-classes" className="text-sm text-primary hover:underline">
              View schedule
            </Link>
          </div>
        </DashboardCard>

        <DashboardCard className="dashboard-stats-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="stats-label">Pending Reviews</p>
              <p className="stats-value">{stats.pendingAssignments}</p>
            </div>
            <div className="p-3 rounded-full bg-amber-100 text-amber-600">
              <FileText size={20} />
            </div>
          </div>
          <div className="mt-2">
            <Link to="/instructor/assignments" className="text-sm text-primary hover:underline">
              Review assignments
            </Link>
          </div>
        </DashboardCard>

        <DashboardCard className="dashboard-stats-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="stats-label">Analytics</p>
              <p className="stats-value">{stats.averageRating} <span className="text-sm">avg. rating</span></p>
            </div>
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <BarChart size={20} />
            </div>
          </div>
          <div className="mt-2">
            <Link to="/instructor/analytics" className="text-sm text-primary hover:underline">
              View analytics
            </Link>
          </div>
        </DashboardCard>

        <DashboardCard className="dashboard-stats-card">
          <div className="flex justify-between items-start">
            <div>
              <p className="stats-label">Schedule</p>
              <p className="stats-value">5 <span className="text-sm">upcoming</span></p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <Calendar size={20} />
            </div>
          </div>
          <div className="mt-2">
            <Link to="/instructor/calendar" className="text-sm text-primary hover:underline">
              View calendar
            </Link>
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <h3 className="text-lg font-medium mb-4">Recent Student Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">Sarah Johnson</p>
                <p className="text-sm text-muted-foreground">Completed Advanced JavaScript Module</p>
              </div>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">Michael Chen</p>
                <p className="text-sm text-muted-foreground">Submitted React assignment</p>
              </div>
              <span className="text-xs text-muted-foreground">5 hours ago</span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">Emily Rodriguez</p>
                <p className="text-sm text-muted-foreground">Posted a question in JavaScript forum</p>
              </div>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard>
          <h3 className="text-lg font-medium mb-4">Upcoming Classes</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">React Performance Optimization</p>
                <p className="text-sm text-muted-foreground">Today at 2:00 PM • 25 students enrolled</p>
              </div>
              <Button size="sm">Start</Button>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">Modern CSS Techniques</p>
                <p className="text-sm text-muted-foreground">Tomorrow at 1:00 PM • 18 students enrolled</p>
              </div>
              <Button size="sm" variant="outline">Prepare</Button>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">JavaScript Fundamentals Q&A</p>
                <p className="text-sm text-muted-foreground">Friday at 11:00 AM • 30 students enrolled</p>
              </div>
              <Button size="sm" variant="outline">Prepare</Button>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default InstructorDashboard;
