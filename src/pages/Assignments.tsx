
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Search, ClipboardList, Check, Clock, AlertTriangle, Download, Upload, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { toast } from "sonner";

const Assignments = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for assignments
  const allAssignments = [
    {
      id: "1",
      title: "Building a React Component Library",
      course: "React Fundamentals",
      dueDate: new Date(2024, 6, 25),
      status: "pending", // pending, submitted, graded
      progress: 60,
      grade: null,
      feedback: null,
    },
    {
      id: "2",
      title: "JavaScript Algorithms Challenge",
      course: "Advanced JavaScript Development",
      dueDate: new Date(2024, 6, 18),
      status: "pending",
      progress: 30,
      grade: null,
      feedback: null,
    },
    {
      id: "3",
      title: "RESTful API with Express",
      course: "Node.js Backend Development",
      dueDate: new Date(2024, 6, 10),
      status: "submitted",
      progress: 100,
      grade: null,
      feedback: null,
    },
    {
      id: "4",
      title: "CSS Grid Layout Implementation",
      course: "CSS Animations and Transitions",
      dueDate: new Date(2024, 5, 30),
      status: "graded",
      progress: 100,
      grade: 92,
      feedback: "Excellent work! Your implementation shows a deep understanding of CSS Grid concepts.",
    },
    {
      id: "5",
      title: "TypeScript Interface Design",
      course: "Introduction to TypeScript",
      dueDate: new Date(2024, 5, 15),
      status: "graded",
      progress: 100,
      grade: 88,
      feedback: "Good job overall. Consider adding more comprehensive documentation for your interfaces.",
    },
  ];

  // Filter assignments based on search query
  const filteredAssignments = allAssignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group assignments by status
  const pendingAssignments = filteredAssignments.filter(
    (assignment) => assignment.status === "pending"
  );
  const submittedAssignments = filteredAssignments.filter(
    (assignment) => assignment.status === "submitted"
  );
  const gradedAssignments = filteredAssignments.filter(
    (assignment) => assignment.status === "graded"
  );

  // Handle file upload
  const handleFileUpload = (assignmentId: string) => {
    toast.success("Assignment submitted successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Assignments" 
        description="Track and manage your course assignments"
      >
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-[260px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search assignments..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Filter size={18} />
          </Button>
        </div>
      </PageHeader>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending" className="flex gap-2">
            <Clock size={16} />
            <span>Pending</span>
          </TabsTrigger>
          <TabsTrigger value="submitted" className="flex gap-2">
            <Upload size={16} />
            <span>Submitted</span>
          </TabsTrigger>
          <TabsTrigger value="graded" className="flex gap-2">
            <Check size={16} />
            <span>Graded</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6 mt-6">
          {pendingAssignments.length > 0 ? (
            <div className="space-y-4">
              {pendingAssignments.map((assignment) => (
                <DashboardCard key={assignment.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-medium text-lg">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Course: {assignment.course}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-muted-foreground" />
                          <span>
                            Due: {format(assignment.dueDate, "MMM dd, yyyy")}
                          </span>
                        </div>
                        
                        {isNearDue(assignment.dueDate) && (
                          <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                            <AlertTriangle size={12} className="mr-1" />
                            Due soon
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="sm:text-right space-y-3">
                      <div className="flex flex-col space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{assignment.progress}%</span>
                        </div>
                        <Progress value={assignment.progress} className="h-1.5" />
                      </div>
                      <div className="flex gap-2 sm:justify-end">
                        <Button variant="outline" size="sm" className="gap-1">
                          <FileText size={14} />
                          <span>View Details</span>
                        </Button>
                        <Button size="sm" className="gap-1" onClick={() => handleFileUpload(assignment.id)}>
                          <Upload size={14} />
                          <span>Submit</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </DashboardCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-lg font-medium">No pending assignments</h3>
              <p className="text-muted-foreground mt-1">
                You're all caught up!
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-6 mt-6">
          {submittedAssignments.length > 0 ? (
            <div className="space-y-4">
              {submittedAssignments.map((assignment) => (
                <DashboardCard key={assignment.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-lg">{assignment.title}</h3>
                        <Badge className="bg-blue-50 text-blue-600 border-blue-200">
                          Submitted
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Course: {assignment.course}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Due: {format(assignment.dueDate, "MMM dd, yyyy")}
                      </p>
                    </div>
                    
                    <div className="sm:text-right space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Awaiting grading
                      </p>
                      <div className="flex gap-2 sm:justify-end">
                        <Button variant="outline" size="sm" className="gap-1">
                          <FileText size={14} />
                          <span>View Submission</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </DashboardCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-lg font-medium">No submitted assignments</h3>
              <p className="text-muted-foreground mt-1">
                You haven't submitted any assignments yet
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="graded" className="space-y-6 mt-6">
          {gradedAssignments.length > 0 ? (
            <div className="space-y-4">
              {gradedAssignments.map((assignment) => (
                <DashboardCard key={assignment.id}>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-lg">{assignment.title}</h3>
                          <Badge className="bg-green-50 text-green-600 border-green-200">
                            Graded
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Course: {assignment.course}
                        </p>
                      </div>
                      
                      <div className="sm:text-right">
                        <div className="inline-flex items-center justify-center rounded-full bg-green-50 px-4 py-1 text-sm font-medium text-green-700">
                          Grade: {assignment.grade}%
                        </div>
                      </div>
                    </div>
                    
                    {assignment.feedback && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Feedback:</h4>
                          <p className="text-sm">{assignment.feedback}</p>
                        </div>
                      </>
                    )}
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <FileText size={14} />
                        <span>View Submission</span>
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download size={14} />
                        <span>Download Feedback</span>
                      </Button>
                    </div>
                  </div>
                </DashboardCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-lg font-medium">No graded assignments</h3>
              <p className="text-muted-foreground mt-1">
                Your instructors haven't graded any assignments yet
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to check if the due date is within 3 days
function isNearDue(dueDate: Date): boolean {
  const now = new Date();
  const diffInDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diffInDays >= 0 && diffInDays <= 3;
}

export default Assignments;
