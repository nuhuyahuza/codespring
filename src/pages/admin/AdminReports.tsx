
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  BarChart2, 
  LineChart, 
  PieChart, 
  Calendar, 
  Users, 
  BookOpen, 
  DollarSign, 
  FileText 
} from "lucide-react";

const AdminReports = () => {
  const [dateRange, setDateRange] = useState("last30days");
  const [reportFormat, setReportFormat] = useState("pdf");

  const downloadReport = (reportType: string) => {
    // This would handle the report download
    console.log(`Downloading ${reportType} report in ${reportFormat} format for range: ${dateRange}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Reports & Analytics" 
        description="Generate and view platform reports"
      >
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="last90days">Last 90 days</SelectItem>
              <SelectItem value="thisyear">This year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={reportFormat} onValueChange={setReportFormat}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      {dateRange === "custom" && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input type="date" id="start-date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input type="date" id="end-date" />
              </div>
              <div className="flex items-end">
                <Button>Apply Range</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">User Growth</CardTitle>
                <CardDescription className="text-2xl font-bold">+14.5%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-10 w-full bg-muted/20 rounded-md"></div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Course Enrollment</CardTitle>
                <CardDescription className="text-2xl font-bold">+22.8%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-10 w-full bg-muted/20 rounded-md"></div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Growth</CardTitle>
                <CardDescription className="text-2xl font-bold">+18.2%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-10 w-full bg-muted/20 rounded-md"></div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
                <CardDescription className="text-2xl font-bold">78.4%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-10 w-full bg-muted/20 rounded-md"></div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Platform Overview Report</CardTitle>
                <CardDescription>
                  Combined metrics for users, courses, revenue and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full bg-muted/20 rounded-md flex items-center justify-center">
                  <LineChart className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => downloadReport("overview")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Quick Reports</CardTitle>
                    <CardDescription>Frequently accessed reports</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/20 rounded-md hover:bg-muted/40 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-blue-500" />
                      <span>User Activity Report</span>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted/20 rounded-md hover:bg-muted/40 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-green-500" />
                      <span>Course Engagement Report</span>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted/20 rounded-md hover:bg-muted/40 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-amber-500" />
                      <span>Monthly Revenue Report</span>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted/20 rounded-md hover:bg-muted/40 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-purple-500" />
                      <span>Weekly Summary Report</span>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
                <CardDescription>Automatically generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Weekly Executive Summary</p>
                      <p className="text-sm text-muted-foreground">Every Monday at 8:00 AM</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Delete</Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Monthly Financial Report</p>
                      <p className="text-sm text-muted-foreground">1st day of every month</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Delete</Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">Quarterly Performance Report</p>
                      <p className="text-sm text-muted-foreground">Last day of each quarter</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Delete</Button>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Schedule New Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full bg-muted/20 rounded-md flex items-center justify-center">
                  <LineChart className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => downloadReport("user-growth")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Chart
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
                <CardDescription>Breakdown by user characteristics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full bg-muted/20 rounded-md flex items-center justify-center">
                  <PieChart className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => downloadReport("user-demographics")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Chart
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>User Roles</CardTitle>
                <CardDescription>Distribution of user types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full bg-muted/20 rounded-md flex items-center justify-center">
                  <PieChart className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => downloadReport("user-roles")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Chart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Activity Metrics</CardTitle>
                  <CardDescription>Key performance indicators for user engagement</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => downloadReport("user-activity")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium py-2">Metric</th>
                      <th className="text-right font-medium py-2">Current</th>
                      <th className="text-right font-medium py-2">Previous</th>
                      <th className="text-right font-medium py-2">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">Average Daily Active Users</td>
                      <td className="text-right py-3">542</td>
                      <td className="text-right py-3">485</td>
                      <td className="text-right py-3 text-green-600">+11.8%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Average Session Duration</td>
                      <td className="text-right py-3">32m 18s</td>
                      <td className="text-right py-3">28m 45s</td>
                      <td className="text-right py-3 text-green-600">+12.3%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">User Retention Rate (30-day)</td>
                      <td className="text-right py-3">76.4%</td>
                      <td className="text-right py-3">72.1%</td>
                      <td className="text-right py-3 text-green-600">+5.9%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">New User Conversion Rate</td>
                      <td className="text-right py-3">24.8%</td>
                      <td className="text-right py-3">26.2%</td>
                      <td className="text-right py-3 text-red-600">-5.3%</td>
                    </tr>
                    <tr>
                      <td className="py-3">Average Courses Per User</td>
                      <td className="text-right py-3">2.7</td>
                      <td className="text-right py-3">2.4</td>
                      <td className="text-right py-3 text-green-600">+12.5%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Course Enrollments</CardTitle>
                <CardDescription>Course enrollment trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full bg-muted/20 rounded-md flex items-center justify-center">
                  <BarChart2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => downloadReport("course-enrollments")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Chart
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Courses by Enrollment</CardTitle>
                <CardDescription>Highest performing courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Advanced JavaScript Development", enrollments: 238, completion: "92%" },
                    { name: "React Fundamentals", enrollments: 215, completion: "86%" },
                    { name: "Data Science Bootcamp", enrollments: 187, completion: "78%" },
                    { name: "Python for Beginners", enrollments: 156, completion: "82%" },
                    { name: "UX/UI Design Principles", enrollments: 142, completion: "75%" }
                  ].map((course, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{course.name}</p>
                        <p className="text-sm text-muted-foreground">{course.enrollments} enrollments</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{course.completion}</p>
                        <p className="text-sm text-muted-foreground">completion</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Course Categories</CardTitle>
                <CardDescription>Distribution by subject area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full bg-muted/20 rounded-md flex items-center justify-center">
                  <PieChart className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => downloadReport("course-categories")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Chart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Course Performance Metrics</CardTitle>
                  <CardDescription>Key indicators for course effectiveness</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => downloadReport("course-performance")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium py-2">Metric</th>
                      <th className="text-right font-medium py-2">Current</th>
                      <th className="text-right font-medium py-2">Target</th>
                      <th className="text-right font-medium py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">Average Course Rating</td>
                      <td className="text-right py-3">4.7/5.0</td>
                      <td className="text-right py-3">4.5/5.0</td>
                      <td className="text-right py-3 text-green-600">Above Target</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Average Completion Rate</td>
                      <td className="text-right py-3">78.4%</td>
                      <td className="text-right py-3">80.0%</td>
                      <td className="text-right py-3 text-amber-600">Near Target</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Average Time to Complete</td>
                      <td className="text-right py-3">18.2 days</td>
                      <td className="text-right py-3">21 days</td>
                      <td className="text-right py-3 text-green-600">Above Target</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Assignment Submission Rate</td>
                      <td className="text-right py-3">85.6%</td>
                      <td className="text-right py-3">90.0%</td>
                      <td className="text-right py-3 text-amber-600">Near Target</td>
                    </tr>
                    <tr>
                      <td className="py-3">Student-Instructor Engagement</td>
                      <td className="text-right py-3">6.8/10</td>
                      <td className="text-right py-3">7.0/10</td>
                      <td className="text-right py-3 text-amber-600">Near Target</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Platform revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full bg-muted/20 rounded-md flex items-center justify-center">
                  <LineChart className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => downloadReport("revenue-overview")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Chart
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Source</CardTitle>
                <CardDescription>Distribution of revenue streams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full bg-muted/20 rounded-md flex items-center justify-center">
                  <PieChart className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-sm">Course Sales (68%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Subscriptions (22%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Live Classes (8%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="text-sm">Other (2%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Revenue Generating Courses</CardTitle>
                <CardDescription>Highest earning courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Data Science Bootcamp", revenue: "$22,450", students: 187 },
                    { name: "Advanced JavaScript Development", revenue: "$19,040", students: 238 },
                    { name: "React Fundamentals", revenue: "$17,200", students: 215 },
                    { name: "UX/UI Design Principles", revenue: "$14,200", students: 142 },
                    { name: "Machine Learning Fundamentals", revenue: "$12,480", students: 104 }
                  ].map((course, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{course.name}</p>
                        <p className="text-sm text-muted-foreground">{course.students} students</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{course.revenue}</p>
                        <p className="text-sm text-muted-foreground">revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Daily Active Users</CardTitle>
                <CardDescription className="text-2xl font-bold">542</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-10 w-full bg-muted/20 rounded-md"></div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Session Duration</CardTitle>
                <CardDescription className="text-2xl font-bold">32m 18s</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-10 w-full bg-muted/20 rounded-md"></div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Forum Posts</CardTitle>
                <CardDescription className="text-2xl font-bold">1,248</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-10 w-full bg-muted/20 rounded-md"></div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Live Class Attendance</CardTitle>
                <CardDescription className="text-2xl font-bold">76.3%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-10 w-full bg-muted/20 rounded-md"></div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>User Engagement Trends</CardTitle>
                <CardDescription>Platform engagement metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full bg-muted/20 rounded-md flex items-center justify-center">
                  <LineChart className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => downloadReport("engagement-trends")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Chart
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Most Active Community Groups</CardTitle>
                <CardDescription>Groups with highest engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "JavaScript Developers", posts: 548, members: 325 },
                    { name: "Data Science Hub", posts: 412, members: 287 },
                    { name: "UX/UI Design Community", posts: 389, members: 236 },
                    { name: "Web Development", posts: 356, members: 312 },
                    { name: "Mobile App Developers", posts: 298, members: 184 }
                  ].map((group, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{group.name}</p>
                        <p className="text-sm text-muted-foreground">{group.members} members</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{group.posts}</p>
                        <p className="text-sm text-muted-foreground">posts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Engagement</CardTitle>
                <CardDescription>Most engaging course materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Video", count: 48, avgWatchTime: "18:24", completion: "94%" },
                    { type: "Interactive Labs", count: 36, avgWatchTime: "22:46", completion: "87%" },
                    { type: "Quizzes", count: 85, avgWatchTime: "14:52", completion: "92%" },
                    { type: "Reading Materials", count: 124, avgWatchTime: "12:38", completion: "76%" },
                    { type: "Assignments", count: 62, avgWatchTime: "N/A", completion: "82%" }
                  ].map((content, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{content.type}</p>
                        <p className="text-sm text-muted-foreground">{content.count} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{content.completion}</p>
                        <p className="text-sm text-muted-foreground">completion</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
