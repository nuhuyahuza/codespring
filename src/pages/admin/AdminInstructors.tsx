
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
  Star,
  Plus
} from "lucide-react";
import { AddInstructorModal } from "@/components/modals/add-instructor-modal";

const AdminInstructors = () => {
  // Mock instructor data
  const instructors = [
    { 
      id: "1", 
      name: "Dr. Emma Wilson", 
      email: "emma.w@example.com", 
      specialty: "Machine Learning", 
      courses: 4, 
      students: 156, 
      rating: 4.8,
      status: "Active"
    },
    { 
      id: "2", 
      name: "Prof. Michael Chen", 
      email: "michael.c@example.com", 
      specialty: "Web Development", 
      courses: 6, 
      students: 234, 
      rating: 4.9,
      status: "Active"
    },
    { 
      id: "3", 
      name: "Dr. Sarah Davis", 
      email: "sarah.d@example.com", 
      specialty: "Data Science", 
      courses: 3, 
      students: 112, 
      rating: 4.7,
      status: "Active"
    },
    { 
      id: "4", 
      name: "Prof. Robert Brown", 
      email: "robert.b@example.com", 
      specialty: "Mobile Development", 
      courses: 5, 
      students: 198, 
      rating: 4.6,
      status: "Active"
    },
    { 
      id: "5", 
      name: "Dr. James Thompson", 
      email: "james.t@example.com", 
      specialty: "UI/UX Design", 
      courses: 2, 
      students: 87, 
      rating: 4.5,
      status: "Inactive"
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Instructor Management" 
        description="View and manage all platform instructors"
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <AddInstructorModal />
        </div>
      </PageHeader>

      <DashboardCard>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search instructors..." className="pl-8" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <AddInstructorModal triggerContent={
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Instructor
              </>
            } />
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instructors.map((instructor) => (
                <TableRow key={instructor.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{instructor.name}</div>
                      <div className="text-sm text-muted-foreground">{instructor.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{instructor.specialty}</TableCell>
                  <TableCell>{instructor.courses}</TableCell>
                  <TableCell>{instructor.students}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
                      <span>{instructor.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      instructor.status === "Active" 
                        ? "bg-green-50 text-green-700" 
                        : "bg-red-50 text-red-700"
                    }`}>
                      {instructor.status}
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
                        <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
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

export default AdminInstructors;
