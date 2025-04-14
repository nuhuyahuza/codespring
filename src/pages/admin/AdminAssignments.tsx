
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  Plus,
  FileText,
  Users
} from "lucide-react";
import { CreateAssignmentModal } from "@/components/modals/create-assignment-modal";
import { ExportMenu } from "@/components/ui/export-menu";

const AdminAssignments = () => {
  // Mock assignment data
  const assignments = [
    { 
      id: "1", 
      title: "Building a REST API", 
      course: "Advanced JavaScript Development", 
      instructor: "Emma Wilson", 
      dueDate: "Jun 20, 2023", 
      submissions: 28, 
      totalStudents: 42,
      status: "Active"
    },
    { 
      id: "2", 
      title: "Creating a React Component Library", 
      course: "React Fundamentals", 
      instructor: "Michael Johnson", 
      dueDate: "Jun 25, 2023", 
      submissions: 15, 
      totalStudents: 56,
      status: "Active"
    },
    { 
      id: "3", 
      title: "Data Cleaning and Preparation", 
      course: "Data Science Bootcamp", 
      instructor: "Sarah Davis", 
      dueDate: "Jun 15, 2023", 
      submissions: 32, 
      totalStudents: 38,
      status: "Active"
    },
    { 
      id: "4", 
      title: "Mobile-First Design Project", 
      course: "UX/UI Design Principles", 
      instructor: "James Thompson", 
      dueDate: "Jun 18, 2023", 
      submissions: 24, 
      totalStudents: 29,
      status: "Active"
    },
    { 
      id: "5", 
      title: "JavaScript Fundamentals Quiz", 
      course: "Advanced JavaScript Development", 
      instructor: "Emma Wilson", 
      dueDate: "Jun 10, 2023", 
      submissions: 40, 
      totalStudents: 42,
      status: "Completed"
    },
  ];

  // Define columns for export
  const exportColumns = [
    { key: 'title' as keyof typeof assignments[0], label: 'Assignment' },
    { key: 'course' as keyof typeof assignments[0], label: 'Course' },
    { key: 'instructor' as keyof typeof assignments[0], label: 'Instructor' },
    { key: 'dueDate' as keyof typeof assignments[0], label: 'Due Date' },
    { key: 'submissions' as keyof typeof assignments[0], label: 'Submissions' },
    { key: 'totalStudents' as keyof typeof assignments[0], label: 'Total Students' },
    { key: 'status' as keyof typeof assignments[0], label: 'Status' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Assignments Management" 
        description="View and manage all platform assignments"
      >
        <div className="flex gap-3">
          <ExportMenu 
            data={assignments}
            columns={exportColumns}
            filename="assignments-report"
            title="Assignments Report"
          />
          <CreateAssignmentModal />
        </div>
      </PageHeader>

      <DashboardCard className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-5 mb-8">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search assignments..." className="pl-9" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <CreateAssignmentModal triggerContent={
              <>
                <FileText className="h-4 w-4 mr-2" />
                Create Assignment
              </>
            } />
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-3">Title</TableHead>
                <TableHead className="py-3">Course</TableHead>
                <TableHead className="py-3">Instructor</TableHead>
                <TableHead className="py-3">Due Date</TableHead>
                <TableHead className="py-3">Submissions</TableHead>
                <TableHead className="py-3">Status</TableHead>
                <TableHead className="w-[50px] py-3"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium py-3">{assignment.title}</TableCell>
                  <TableCell className="py-3">{assignment.course}</TableCell>
                  <TableCell className="py-3">{assignment.instructor}</TableCell>
                  <TableCell className="py-3">{assignment.dueDate}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{assignment.submissions}/{assignment.totalStudents}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      assignment.status === "Active" 
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
                        : "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    }`}>
                      {assignment.status}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Assignment</DropdownMenuItem>
                        <DropdownMenuItem>View Submissions</DropdownMenuItem>
                        <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                        {assignment.status === "Active" && (
                          <DropdownMenuItem className="text-red-600 dark:text-red-400">Close Assignment</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DashboardCard>
    </div>
  );
};

export default AdminAssignments;
