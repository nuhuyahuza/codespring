
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
  Download,
  Plus,
  GraduationCap
} from "lucide-react";
import { AddStudentModal } from "@/components/modals/add-student-modal";

const AdminStudents = () => {
  // Mock student data
  const students = [
    { 
      id: "1", 
      name: "Emma Wilson", 
      email: "emma.w@example.com", 
      enrollmentDate: "2023-09-01", 
      coursesEnrolled: 3,
      progress: 67,
      status: "Active"
    },
    { 
      id: "2", 
      name: "Michael Chen", 
      email: "michael.c@example.com", 
      enrollmentDate: "2023-08-15", 
      coursesEnrolled: 2,
      progress: 42,
      status: "Active"
    },
    { 
      id: "3", 
      name: "Sarah Davis", 
      email: "sarah.d@example.com", 
      enrollmentDate: "2023-10-05", 
      coursesEnrolled: 1,
      progress: 18,
      status: "Active"
    },
    { 
      id: "4", 
      name: "Robert Brown", 
      email: "robert.b@example.com", 
      enrollmentDate: "2023-07-20", 
      coursesEnrolled: 4,
      progress: 89,
      status: "Active"
    },
    { 
      id: "5", 
      name: "James Thompson", 
      email: "james.t@example.com", 
      enrollmentDate: "2023-11-10", 
      coursesEnrolled: 2,
      progress: 24,
      status: "Inactive"
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Student Management" 
        description="View and manage all platform students"
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <AddStudentModal />
        </div>
      </PageHeader>

      <DashboardCard>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search students..." className="pl-8" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <AddStudentModal triggerContent={
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </>
            } />
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Enrollment Date</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{student.enrollmentDate}</TableCell>
                  <TableCell>{student.coursesEnrolled}</TableCell>
                  <TableCell>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">{student.progress}%</span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      student.status === "Active" 
                        ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {student.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>View Courses</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 dark:text-red-400">Deactivate</DropdownMenuItem>
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

export default AdminStudents;
