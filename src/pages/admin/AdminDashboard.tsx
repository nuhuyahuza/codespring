
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  Users, BookOpen, GraduationCap, UserCog, Video, 
  BarChart2, DollarSign, Clock
} from "lucide-react";

const AdminDashboard = () => {
  // Mock data for platform stats
  const stats = {
    totalUsers: 1250,
    totalStudents: 1100,
    totalInstructors: 45,
    totalCourses: 120,
    activeLiveClasses: 15,
    totalRevenue: "$125,800",
    activeStudents: 850,
    completionRate: "78%"
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Admin Dashboard" 
        description="Manage all aspects of your learning platform"
      >
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/admin/reports">Reports</Link>
          </Button>
          <Button asChild>
            <Link to="/admin/settings">Platform Settings</Link>
          </Button>
        </div>
      </PageHeader>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard className="dashboard-stats-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="stats-label">Total Users</p>
                  <p className="stats-value">{stats.totalUsers}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Users size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard className="dashboard-stats-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="stats-label">Total Courses</p>
                  <p className="stats-value">{stats.totalCourses}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <BookOpen size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard className="dashboard-stats-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="stats-label">Total Revenue</p>
                  <p className="stats-value">{stats.totalRevenue}</p>
                </div>
                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                  <DollarSign size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard className="dashboard-stats-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="stats-label">Active Classes</p>
                  <p className="stats-value">{stats.activeLiveClasses}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <Video size={20} />
                </div>
              </div>
            </DashboardCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard>
              <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">New instructor registered</p>
                    <p className="text-sm text-muted-foreground">Dr. Robert Chen from Stanford University</p>
                  </div>
                  <span className="text-xs text-muted-foreground">1 hour ago</span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">New course published</p>
                    <p className="text-sm text-muted-foreground">Advanced Machine Learning by Prof. Emma Wilson</p>
                  </div>
                  <span className="text-xs text-muted-foreground">3 hours ago</span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">Payment issue reported</p>
                    <p className="text-sm text-muted-foreground">Student ID #45829 - Transaction failed</p>
                  </div>
                  <span className="text-xs text-muted-foreground">5 hours ago</span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">Course completion</p>
                    <p className="text-sm text-muted-foreground">15 students completed "React Fundamentals"</p>
                  </div>
                  <span className="text-xs text-muted-foreground">1 day ago</span>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">View All Activity</Button>
              </div>
            </DashboardCard>

            <DashboardCard>
              <h3 className="text-lg font-medium mb-4">Platform Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Active Students</span>
                    <span className="text-sm font-medium">{stats.activeStudents}/{stats.totalStudents}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: "77%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Course Completion Rate</span>
                    <span className="text-sm font-medium">{stats.completionRate}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Instructor Participation</span>
                    <span className="text-sm font-medium">89%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: "89%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Platform Uptime</span>
                    <span className="text-sm font-medium">99.8%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: "99.8%" }}></div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">Detailed Analytics</Button>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard className="dashboard-stats-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="stats-label">Students</p>
                  <p className="stats-value">{stats.totalStudents}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <GraduationCap size={20} />
                </div>
              </div>
              <div className="mt-2">
                <Link to="/admin/students" className="text-sm text-primary hover:underline">
                  Manage students
                </Link>
              </div>
            </DashboardCard>

            <DashboardCard className="dashboard-stats-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="stats-label">Instructors</p>
                  <p className="stats-value">{stats.totalInstructors}</p>
                </div>
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                  <UserCog size={20} />
                </div>
              </div>
              <div className="mt-2">
                <Link to="/admin/instructors" className="text-sm text-primary hover:underline">
                  Manage instructors
                </Link>
              </div>
            </DashboardCard>

            <DashboardCard className="dashboard-stats-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="stats-label">Admins</p>
                  <p className="stats-value">12</p>
                </div>
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <Users size={20} />
                </div>
              </div>
              <div className="mt-2">
                <Link to="/admin/users" className="text-sm text-primary hover:underline">
                  Manage admins
                </Link>
              </div>
            </DashboardCard>
          </div>

          <DashboardCard>
            <h3 className="text-lg font-medium mb-4">Recent User Registrations</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-3 pr-4 font-medium">Name</th>
                    <th className="text-left pb-3 px-4 font-medium">Email</th>
                    <th className="text-left pb-3 px-4 font-medium">Role</th>
                    <th className="text-left pb-3 px-4 font-medium">Joined</th>
                    <th className="text-right pb-3 pl-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-3 pr-4">Robert Chen</td>
                    <td className="py-3 px-4">robert.chen@example.com</td>
                    <td className="py-3 px-4">Instructor</td>
                    <td className="py-3 px-4">Today</td>
                    <td className="py-3 pl-4 text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Maria Garcia</td>
                    <td className="py-3 px-4">maria.g@example.com</td>
                    <td className="py-3 px-4">Student</td>
                    <td className="py-3 px-4">Yesterday</td>
                    <td className="py-3 pl-4 text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">James Wilson</td>
                    <td className="py-3 px-4">james.w@example.com</td>
                    <td className="py-3 px-4">Student</td>
                    <td className="py-3 px-4">2 days ago</td>
                    <td className="py-3 pl-4 text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full">View All Users</Button>
            </div>
          </DashboardCard>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard className="dashboard-stats-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="stats-label">Total Courses</p>
                  <p className="stats-value">{stats.totalCourses}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <BookOpen size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard className="dashboard-stats-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="stats-label">Active Courses</p>
                  <p className="stats-value">98</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <BookOpen size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard className="dashboard-stats-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="stats-label">Average Rating</p>
                  <p className="stats-value">4.7</p>
                </div>
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                  <BarChart2 size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard className="dashboard-stats-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="stats-label">Live Classes</p>
                  <p className="stats-value">{stats.activeLiveClasses}</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <Video size={20} />
                </div>
              </div>
            </DashboardCard>
          </div>

          <DashboardCard>
            <h3 className="text-lg font-medium mb-4">Top Performing Courses</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-3 pr-4 font-medium">Course</th>
                    <th className="text-left pb-3 px-4 font-medium">Instructor</th>
                    <th className="text-center pb-3 px-4 font-medium">Students</th>
                    <th className="text-center pb-3 px-4 font-medium">Rating</th>
                    <th className="text-center pb-3 px-4 font-medium">Completion</th>
                    <th className="text-right pb-3 pl-4 font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-3 pr-4">Advanced JavaScript Development</td>
                    <td className="py-3 px-4">Emma Wilson</td>
                    <td className="py-3 px-4 text-center">126</td>
                    <td className="py-3 px-4 text-center">4.9</td>
                    <td className="py-3 px-4 text-center">86%</td>
                    <td className="py-3 pl-4 text-right">$12,500</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">React Fundamentals</td>
                    <td className="py-3 px-4">Michael Johnson</td>
                    <td className="py-3 px-4 text-center">238</td>
                    <td className="py-3 px-4 text-center">4.8</td>
                    <td className="py-3 px-4 text-center">92%</td>
                    <td className="py-3 pl-4 text-right">$18,240</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Data Science Bootcamp</td>
                    <td className="py-3 px-4">Sarah Davis</td>
                    <td className="py-3 px-4 text-center">185</td>
                    <td className="py-3 px-4 text-center">4.7</td>
                    <td className="py-3 px-4 text-center">78%</td>
                    <td className="py-3 pl-4 text-right">$22,100</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full">View All Courses</Button>
            </div>
          </DashboardCard>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard className="dashboard-stats-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="stats-label">Total Revenue</p>
                  <p className="stats-value">{stats.totalRevenue}</p>
                </div>
                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                  <DollarSign size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard className="dashboard-stats-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="stats-label">Monthly Revenue</p>
                  <p className="stats-value">$24,350</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <DollarSign size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard className="dashboard-stats-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="stats-label">Average Per Student</p>
                  <p className="stats-value">$114.36</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <Users size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard className="dashboard-stats-card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="stats-label">Average Per Course</p>
                  <p className="stats-value">$1,048</p>
                </div>
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                  <BookOpen size={20} />
                </div>
              </div>
            </DashboardCard>
          </div>

          <DashboardCard>
            <h3 className="text-lg font-medium mb-4">Revenue Summary</h3>
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md border border-dashed">
              <p className="text-muted-foreground">Revenue chart will be displayed here</p>
            </div>
          </DashboardCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard>
              <h3 className="text-lg font-medium mb-4">Top Revenue Sources</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Course Sales</span>
                    <span className="text-sm font-medium">72%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: "72%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Subscriptions</span>
                    <span className="text-sm font-medium">18%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: "18%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Live Classes</span>
                    <span className="text-sm font-medium">8%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: "8%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Other</span>
                    <span className="text-sm font-medium">2%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: "2%" }}></div>
                  </div>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard>
              <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">Advanced React Course</p>
                    <p className="text-sm text-muted-foreground">Student: Alex Johnson</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$129.99</p>
                    <p className="text-xs text-muted-foreground">Today</p>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">Python for Data Science</p>
                    <p className="text-sm text-muted-foreground">Student: Maria Rodriguez</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$149.99</p>
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">Premium Subscription</p>
                    <p className="text-sm text-muted-foreground">Student: James Wilson</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$19.99/mo</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">View All Transactions</Button>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
