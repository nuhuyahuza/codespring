
import React, { useState } from "react";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { CourseCard } from "@/components/ui/course-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useStudentDashboard } from "@/features/student/hooks/useStudentDashboard";
import { useAuth } from "@/features/auth";

interface Course {
  id: string;
  title: string;
  thumbnail: string | null;
  progress: number;
  instructor: {
    name: string;
  };
  lastAccessedAt?: string;
}

const Dashboard = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const { data: dashboard, isLoading, error } = useStudentDashboard();
  const { user } = useAuth();
  const overallProgress = 75;

  // Mock data for enrolled courses

  const enrolledCourses = dashboard?.enrolledCourses.filter((course: Course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Mock data for upcoming live classes
  const upcomingClasses = [
    {
      id: "1",
      title: "React Performance Optimization",
      time: "Today at 2:00 PM",
      instructor: "Jane Cooper",
    },
    {
      id: "2",
      title: "Modern CSS Techniques",
      time: "Tomorrow at 1:00 PM",
      instructor: "Esther Howard",
    },
  ];

  // Mock data for community groups
  const communityGroups = [
    {
      id: "1",
      name: "JavaScript Study Group",
      members: 24,
      recentActivity: "New discussion: 'Promises vs Async/Await'",
    },
    {
      id: "2",
      name: "Web Development Projects",
      members: 36,
      recentActivity: "New member joined: Sarah Johnson",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
        <div className="space-y-2">
          <div className="inline-flex items-center rounded-full bg-codespring-green-50 px-3 py-1 text-sm font-medium text-codespring-green-700 animate-slide-in">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-codespring-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-codespring-green-500"></span>
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight animate-slide-in">Welcome back, {user?.name || 'Student'}! 👋</h1>
          <p className="text-muted-foreground text-lg animate-slide-in">
            Keep up the great work! You're making excellent progress.
          </p>
        </div>
        <div className="md:ml-auto animate-scale">
          <ProgressCircle value={overallProgress} size={120} />
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold tracking-tight">My Courses</h2>
          <Button variant="link" asChild>
            <Link to="/student/courses" className="flex items-center">
              View all
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses?.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold tracking-tight">Upcoming Live Classes</h2>
            <Button variant="link" asChild>
              <Link to="/live-classes" className="flex items-center">
                View all
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </Button>
          </div>
          <DashboardCard className="border">
            {upcomingClasses.length > 0 ? (
              <div className="space-y-4">
                {upcomingClasses.map((liveClass, index) => (
                  <React.Fragment key={liveClass.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="mt-0.5">
                          <Clock size={18} className="text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{liveClass.title}</h3>
                          <p className="text-sm text-muted-foreground">{liveClass.time}</p>
                          <p className="text-sm">Instructor: {liveClass.instructor}</p>
                        </div>
                      </div>
                      <Button>Join</Button>
                    </div>
                    {index < upcomingClasses.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No upcoming classes</p>
                <Button variant="outline" className="mt-4">
                  Browse available classes
                </Button>
              </div>
            )}
          </DashboardCard>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold tracking-tight">Community & Groups</h2>
            <Button variant="link" asChild>
              <Link to="/community-groups" className="flex items-center">
                View all
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </Button>
          </div>
          <DashboardCard className="border">
            {communityGroups.length > 0 ? (
              <div className="space-y-4">
                {communityGroups.map((group, index) => (
                  <React.Fragment key={group.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="mt-0.5">
                          <Users size={18} className="text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{group.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {group.members} members
                          </p>
                          <p className="text-sm">{group.recentActivity}</p>
                        </div>
                      </div>
                      <Button variant="outline">
                        <Link to={`/community-groups/${group.id}`}>View</Link>
                      </Button>
                    </div>
                    {index < communityGroups.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No community groups</p>
                <Button variant="outline" className="mt-4">
                  Browse available groups
                </Button>
              </div>
            )}
          </DashboardCard>
        </section>
      </div>
      
      <footer className="border-t pt-6 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex gap-6">
            <Link to="/terms" className="hover:underline">Terms of Service</Link>
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/contact" className="hover:underline">Contact Us</Link>
          </div>
          <div>© 2024 Codespring. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
