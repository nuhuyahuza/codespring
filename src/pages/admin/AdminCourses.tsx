
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
  Users,
  Clock
} from "lucide-react";
import { AddCourseModal } from "@/components/modals/add-course-modal";

const AdminCourses = () => {
  // Mock course data
  const courses = [
    { 
      id: "1", 
      title: "Introduction to Web Development", 
      instructor: "Dr. Emma Wilson", 
      category: "Web Development", 
      studentsEnrolled: 156, 
      duration: "8 weeks",
      status: "Published"
    },
    { 
      id: "2", 
      title: "Advanced JavaScript Concepts", 
      instructor: "Prof. Michael Chen", 
      category: "Web Development", 
      studentsEnrolled: 98, 
      duration: "6 weeks",
      status: "Published"
    },
    { 
      id: "3", 
      title: "Data Science Fundamentals", 
      instructor: "Dr. Sarah Davis", 
      category: "Data Science", 
      studentsEnrolled: 112, 
      duration: "10 weeks",
      status: "Published"
    },
    { 
      id: "4", 
      title: "Mobile App Development with React Native", 
      instructor: "Prof. Robert Brown", 
      category: "Mobile Development", 
      studentsEnrolled: 87, 
      duration: "8 weeks",
      status: "Draft"
    },
    { 
      id: "5", 
      title: "UI/UX Design Principles", 
      instructor: "Dr. James Thompson", 
      category: "Design", 
      studentsEnrolled: 76, 
      duration: "6 weeks",
      status: "Archived"
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Course Management" 
        description="View and manage all platform courses"
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <AddCourseModal />
        </div>
      </PageHeader>

      <DashboardCard>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-8" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <AddCourseModal triggerContent={
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </>
            } />
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{course.studentsEnrolled}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{course.duration}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      course.status === "Published" 
                        ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                        : course.status === "Draft" 
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-gray-50 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400"
                    }`}>
                      {course.status}
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Course</DropdownMenuItem>
                        <DropdownMenuItem>View Students</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 dark:text-red-400">Archive Course</DropdownMenuItem>
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

export default AdminCourses;
