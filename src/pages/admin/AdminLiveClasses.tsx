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
  Video,
  Users,
  Calendar
} from "lucide-react";
import { ScheduleClassModal } from "@/components/modals/schedule-class-modal";
import { ExportMenu } from "@/components/ui/export-menu";
import { AdminLiveClass } from "@/types";

const AdminLiveClasses = () => {
  // Mock live class data
  const liveClasses:AdminLiveClass[] = [
    { 
      id: "1", 
      title: "Advanced JavaScript Q&A Session", 
      instructor: "Emma Wilson", 
      course: "Advanced JavaScript Development", 
      date: "Jun 15, 2023", 
      time: "3:00 PM - 4:30 PM", 
      duration: "1.5 hours",
      enrolled: 42,
      status: "Upcoming"
    },
    { 
      id: "2", 
      title: "React Hooks Deep Dive", 
      instructor: "Michael Johnson", 
      course: "React Fundamentals", 
      date: "Jun 17, 2023", 
      time: "2:00 PM - 4:00 PM", 
      duration: "2 hours",
      enrolled: 56,
      status: "Upcoming"
    },
    { 
      id: "3", 
      title: "Data Visualization Workshop", 
      instructor: "Sarah Davis", 
      course: "Data Science Bootcamp", 
      date: "Jun 12, 2023", 
      time: "1:00 PM - 3:00 PM", 
      duration: "2 hours",
      enrolled: 38,
      status: "Completed"
    },
    { 
      id: "4", 
      title: "Responsive Design Workshop", 
      instructor: "James Thompson", 
      course: "UX/UI Design Principles", 
      date: "Jun 20, 2023", 
      time: "11:00 AM - 12:30 PM", 
      duration: "1.5 hours",
      enrolled: 29,
      status: "Upcoming"
    },
    { 
      id: "5", 
      title: "Introduction to Machine Learning", 
      instructor: "Robert Chen", 
      course: "Introduction to AI", 
      date: "Jun 22, 2023", 
      time: "4:00 PM - 6:00 PM", 
      duration: "2 hours",
      enrolled: 0,
      status: "Cancelled"
    },
  ];

  // Define columns for export
  const exportColumns = [
    { key: 'title' as keyof typeof liveClasses[0], label: 'Class Title' },
    { key: 'instructor' as keyof typeof liveClasses[0], label: 'Instructor' },
    { key: 'course' as keyof typeof liveClasses[0], label: 'Course' },
    { key: 'date' as keyof typeof liveClasses[0], label: 'Date' },
    { key: 'time' as keyof typeof liveClasses[0], label: 'Time' },
    { key: 'duration' as keyof typeof liveClasses[0], label: 'Duration' },
    { key: 'enrolled' as keyof typeof liveClasses[0], label: 'Enrolled Students' },
    { key: 'status' as keyof typeof liveClasses[0], label: 'Status' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader 
        title="Live Classes Management" 
        description="View and manage all platform live classes"
      >
        <div className="flex gap-3">
          <ExportMenu 
            data={liveClasses}
            columns={exportColumns}
            filename="live-classes-report"
            title="Live Classes Report"
          />
          <ScheduleClassModal />
        </div>
      </PageHeader>

      <DashboardCard className="p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-5 mb-8">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search classes..." className="pl-9" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Calendar className="h-4 w-4" />
              <span>Calendar View</span>
            </Button>
            <ScheduleClassModal triggerContent={
              <>
                <Video className="h-4 w-4 mr-2" />
                Schedule Class
              </>
            } />
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-3">Title</TableHead>
                <TableHead className="py-3">Instructor</TableHead>
                <TableHead className="py-3">Date & Time</TableHead>
                <TableHead className="py-3">Duration</TableHead>
                <TableHead className="py-3">Enrolled</TableHead>
                <TableHead className="py-3">Status</TableHead>
                <TableHead className="w-[50px] py-3"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {liveClasses.map((liveClass) => (
                <TableRow key={liveClass.id}>
                  <TableCell className="py-3">
                    <div>
                      <div className="font-medium">{liveClass.title}</div>
                      <div className="text-sm text-muted-foreground">{liveClass.course}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">{liveClass.instructor}</TableCell>
                  <TableCell className="py-3">
                    <div>
                      <div>{liveClass.date}</div>
                      <div className="text-sm text-muted-foreground">{liveClass.time}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">{liveClass.duration}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{liveClass.enrolled}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      liveClass.status === "Upcoming" 
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" 
                        : liveClass.status === "Completed"
                        ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {liveClass.status}
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
                        <DropdownMenuItem>Edit Schedule</DropdownMenuItem>
                        <DropdownMenuItem>View Attendees</DropdownMenuItem>
                        {liveClass.status === "Upcoming" && (
                          <DropdownMenuItem className="text-red-600 dark:text-red-400">Cancel Class</DropdownMenuItem>
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

export default AdminLiveClasses;
