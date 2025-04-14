
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { CourseCard } from "@/components/ui/course-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, BookOpen, CheckCircle } from "lucide-react";
import { useStudentDashboard } from "@/features/student/hooks/useStudentDashboard";

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

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for courses
  const { data: dashboard } = useStudentDashboard();

  // Filter courses based on search query
  const filteredCourses = dashboard?.enrolledCourses.filter((course: Course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inProgressCourses = filteredCourses?.filter((course: Course) => course.progress < 100);
  const completedCourses = filteredCourses?.filter((course: Course) => course.progress === 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="My Courses" 
        description="Browse and manage your enrolled courses"
      >
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-[260px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
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

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all" className="flex gap-2">
            <BookOpen size={16} />
            <span>All Courses</span>
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="flex gap-2">
            <BookOpen size={16} />
            <span>In Progress</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex gap-2">
            <CheckCircle size={16} />
            <span>Completed</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6 mt-6">
          {filteredCourses && filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses?.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-lg font-medium">No courses found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search query or filters
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-6 mt-6">
          {inProgressCourses && inProgressCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-lg font-medium">No in-progress courses</h3>
              <p className="text-muted-foreground mt-1">
                All your enrolled courses are completed
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6 mt-6">
          {completedCourses && completedCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCourses && completedCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-lg font-medium">No completed courses</h3>
              <p className="text-muted-foreground mt-1">
                Continue working on your current courses
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Courses;
