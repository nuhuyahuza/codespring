
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  UserCog, 
  Video, 
  BarChart2, 
  DollarSign, 
  Clock,
  Download,
  Calendar,
  ArrowUpRight
} from "lucide-react";

const AdminAnalytics = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Platform Analytics" 
        description="View detailed analytics and reports for your platform"
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
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
            <DashboardCard className="overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold">1,250</p>
                  <div className="flex items-center mt-1 text-xs text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>12% increase</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Users size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard className="overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                  <p className="text-3xl font-bold">120</p>
                  <div className="flex items-center mt-1 text-xs text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>5% increase</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <BookOpen size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard className="overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold">$125,800</p>
                  <div className="flex items-center mt-1 text-xs text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>18% increase</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                  <DollarSign size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard className="overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Course Completion</p>
                  <p className="text-3xl font-bold">78%</p>
                  <div className="flex items-center mt-1 text-xs text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>3% increase</span>
                  </div>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <BarChart2 size={20} />
                </div>
              </div>
            </DashboardCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard>
              <h3 className="text-lg font-medium mb-4">User Growth</h3>
              <div className="h-[250px] bg-muted/20 rounded-md border border-dashed flex items-center justify-center">
                <p className="text-muted-foreground">User growth chart will be displayed here</p>
              </div>
            </DashboardCard>

            <DashboardCard>
              <h3 className="text-lg font-medium mb-4">Revenue Trends</h3>
              <div className="h-[250px] bg-muted/20 rounded-md border border-dashed flex items-center justify-center">
                <p className="text-muted-foreground">Revenue trends chart will be displayed here</p>
              </div>
            </DashboardCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DashboardCard>
              <h3 className="text-lg font-medium mb-4">Top Performing Courses</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="font-medium">React Fundamentals</p>
                  <p className="text-sm">238 students</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Data Science Bootcamp</p>
                  <p className="text-sm">185 students</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Advanced JavaScript</p>
                  <p className="text-sm">126 students</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">UX/UI Design</p>
                  <p className="text-sm">92 students</p>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard>
              <h3 className="text-lg font-medium mb-4">Top Instructors</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="font-medium">Michael Johnson</p>
                  <p className="text-sm">8 courses</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Emma Wilson</p>
                  <p className="text-sm">6 courses</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Sarah Davis</p>
                  <p className="text-sm">5 courses</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Robert Chen</p>
                  <p className="text-sm">4 courses</p>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard>
              <h3 className="text-lg font-medium mb-4">User Demographics</h3>
              <div className="h-[200px] bg-muted/20 rounded-md border border-dashed flex items-center justify-center">
                <p className="text-muted-foreground">Demographics chart will be displayed here</p>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardCard>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Students</p>
                  <p className="text-3xl font-bold">1,100</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <GraduationCap size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Instructors</p>
                  <p className="text-3xl font-bold">45</p>
                </div>
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                  <UserCog size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Admins</p>
                  <p className="text-3xl font-bold">12</p>
                </div>
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <Users size={20} />
                </div>
              </div>
            </DashboardCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard>
              <h3 className="text-lg font-medium mb-4">New Registrations</h3>
              <div className="h-[250px] bg-muted/20 rounded-md border border-dashed flex items-center justify-center">
                <p className="text-muted-foreground">Registrations chart will be displayed here</p>
              </div>
            </DashboardCard>

            <DashboardCard>
              <h3 className="text-lg font-medium mb-4">Active Users</h3>
              <div className="h-[250px] bg-muted/20 rounded-md border border-dashed flex items-center justify-center">
                <p className="text-muted-foreground">Active users chart will be displayed here</p>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <DashboardCard>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                  <p className="text-3xl font-bold">120</p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <BookOpen size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Live Classes</p>
                  <p className="text-3xl font-bold">15</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <Video size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Completion</p>
                  <p className="text-3xl font-bold">78%</p>
                </div>
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                  <BarChart2 size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Duration</p>
                  <p className="text-3xl font-bold">12h</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Clock size={20} />
                </div>
              </div>
            </DashboardCard>
          </div>

          <DashboardCard>
            <h3 className="text-lg font-medium mb-4">Course Enrollments</h3>
            <div className="h-[300px] bg-muted/20 rounded-md border border-dashed flex items-center justify-center">
              <p className="text-muted-foreground">Course enrollments chart will be displayed here</p>
            </div>
          </DashboardCard>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <DashboardCard>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold">$125,800</p>
                </div>
                <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
                  <DollarSign size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                  <p className="text-3xl font-bold">$24,350</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <DollarSign size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Per Student</p>
                  <p className="text-3xl font-bold">$114</p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <Users size={20} />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Per Course</p>
                  <p className="text-3xl font-bold">$1,048</p>
                </div>
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                  <BookOpen size={20} />
                </div>
              </div>
            </DashboardCard>
          </div>

          <DashboardCard>
            <h3 className="text-lg font-medium mb-4">Revenue Breakdown</h3>
            <div className="h-[300px] bg-muted/20 rounded-md border border-dashed flex items-center justify-center">
              <p className="text-muted-foreground">Revenue breakdown chart will be displayed here</p>
            </div>
          </DashboardCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;
